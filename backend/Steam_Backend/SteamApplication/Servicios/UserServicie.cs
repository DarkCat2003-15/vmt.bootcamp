using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using SteamApplication.Helpers;
using SteamApplication.Interfaces.Servicie;
using SteamApplication.Models.Dtos;
using SteamApplication.Models.Request.Users;
using SteamApplication.Models.Response;
using SteamApplication.Queries;
using SteamDomain.Database.SqlServer;
using SteamDomain.Database.SqlServer.Context;
using SteamDomain.Database.SqlServer.Entities;
using SteamDomain.Exceptions;
using SteamShared.Constants;
using SteamShared.Helpers;

namespace SteamApplication.Servicios
{
    public class UserService(
        IUnitOfWork uow,
        IConfiguration configuration,
        SMTP smtp,
        IEmailTemplateService emailTemplateService,
        SteamContext context) : IUserService
    {
        public async Task<GenericResponse<UserDto>> Create(CreateUsersRequest model)
        {
            await ValidateEmailIfExists(model.Email);

            if (string.IsNullOrWhiteSpace(model.Password))
                throw new BadRequestException("Password es obligatorio");

            var create = await uow.userRepository.Create(new User
            {
                Email = model.Email,
                UserName = model.Username,
                Password = Hasher.HashPassword(model.Password),
                StatusId = UserStatusConstants.ActiveId
            });

            await TryAssignDefaultRole(create.UserId, RoleConstants.User);

            var template = await emailTemplateService.Get(
                EmailTemplateNameConstants.USER_REGISTER,
                new Dictionary<string, string>
                {
                    { "password", model.Password }
                });

            try
            {
                await smtp.Send(model.Email, template.Subject, template.Body);
            }
            catch
            {
                // La creación del usuario no debe fallar si el correo no pudo enviarse.
            }

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(await Map(create));
        }

        public async Task<GenericResponse<bool>> Delete(Guid id)
        {
            var user = await GetUserById(id);

            user.StatusId = UserStatusConstants.InactiveId;
            user.DeletedAt = DateTimeHelper.UtcNow();
            user.UpdateAt = DateTimeHelper.UtcNow();
            await uow.userRepository.Update(user);

            return ResponseHelper.Create(true);
        }

        public GenericResponse<List<UserDto>> Get(FilterUserRequest model)
        {
            var queryable = uow.userRepository.Queryable();
            var users = queryable
                .ApplyQuery(model)
                .AsQueryable()
                .Skip(model.Offset)
                .Take(model.Limit)
                .ToList();

            var userIds = users.Select(x => x.UserId).ToList();
            var roleMap = context.UserRoles
                .Where(x => userIds.Contains(x.UserId) && x.Role.IsActive)
                .Select(x => new { x.UserId, x.Role.Name })
                .ToList()
                .GroupBy(x => x.UserId)
                .ToDictionary(x => x.Key, x => x.Select(y => y.Name).Distinct().ToList());

            var userDtos = users.Select(user =>
            {
                var statusId = user.StatusId ?? (user.DeletedAt == null ? UserStatusConstants.ActiveId : UserStatusConstants.InactiveId);

                return new UserDto
                {
                    UserId = user.UserId,
                    Username = user.UserName,
                    CreatedAt = user.CreatedAt ?? DateTimeHelper.UtcNow(),
                    Email = user.Email ?? string.Empty,
                    StatusId = statusId,
                    StatusName = UserStatusConstants.ResolveName(statusId),
                    IsActive = UserStatusConstants.IsActive(statusId),
                    Roles = roleMap.GetValueOrDefault(user.UserId, [])
                };
            }).ToList();

            return ResponseHelper.Create(userDtos, count: queryable.Count());
        }

        public async Task<GenericResponse<UserDto>> Get(Guid id)
        {
            var user = await GetUserById(id);
            return ResponseHelper.Create(await Map(user));
        }

        public async Task<GenericResponse<UserDto>> Update(Guid id, UpdateUserRequest model, Guid userId)
        {
            var user = await GetUserById(id);

            if (!string.IsNullOrWhiteSpace(model.Username))
                user.UserName = model.Username;

            if (!string.IsNullOrWhiteSpace(model.Email) && user.Email != model.Email)
            {
                await ValidateEmailIfExists(model.Email);
                user.Email = model.Email;
            }

            user.UpdateAt = DateTimeHelper.UtcNow();

            var update = await uow.userRepository.Update(user);

            await uow.SaveChangesAsync();

            return ResponseHelper.Create(await Map(update));
        }

        private async Task<User> GetUserById(Guid id)
        {
            return await uow.userRepository.Get(id)
                 ?? throw new NotFoundException(ResponseConstants.USER_NOT_EXISTS);
        }

        private async Task<UserDto> Map(User user)
        {
            var statusId = user.StatusId ?? (user.DeletedAt == null ? UserStatusConstants.ActiveId : UserStatusConstants.InactiveId);
            var roles = await uow.roleRepository.GetByUserId(user.UserId);

            return new UserDto
            {
                UserId = user.UserId,
                Username = user.UserName,
                CreatedAt = user.CreatedAt ?? DateTimeHelper.UtcNow(),
                Email = user.Email ?? string.Empty,
                StatusId = statusId,
                StatusName = UserStatusConstants.ResolveName(statusId),
                IsActive = UserStatusConstants.IsActive(statusId),
                Roles = roles.Select(x => x.Name).ToList()
            };
        }

        public async Task CreateFirstUser()
        {
            await EnsureStatusesAndUsers();

            var hasCreated = await uow.userRepository.HasCreated();
            if (hasCreated) return;

            var username = configuration[ConfigurationConstants.FIRST_APP_TIME_USER_USERNAME]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.FIRST_APP_TIME_USER_USERNAME));

            var email = configuration[ConfigurationConstants.FIRST_APP_TIME_USER_EMAIL]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.FIRST_APP_TIME_USER_EMAIL));

            var password = configuration[ConfigurationConstants.FIRST_APP_TIME_USER_PASSWORD]
                ?? throw new Exception(ResponseConstants.ConfigurationPropertyNotFound(ConfigurationConstants.FIRST_APP_TIME_USER_PASSWORD));

            await uow.userRepository.Create(new User
            {
                UserName = username,
                Email = email,
                Password = Hasher.HashPassword(password),
                StatusId = UserStatusConstants.ActiveId
            });

            await uow.SaveChangesAsync();

            try
            {
                var firstUser = await uow.userRepository.Get(email);
                if (firstUser != null)
                {
                    await TryAssignDefaultRole(firstUser.UserId, RoleConstants.Admin);
                }
            }
            catch
            {
            }
        }

        public async Task<User> GetExecutor(string value)
        {
            var uuid = Guid.Parse(value);
            return await uow.userRepository.Get(uuid)
                ?? throw new NotFoundException(ResponseConstants.USER_NOT_EXISTS);
        }

        private async Task ValidateEmailIfExists(string email)
        {
            if (await uow.userRepository.IfExists(email))
                throw new BadRequestException(ResponseConstants.USER_EMAIL_TAKED);
        }

        public async Task<GenericResponse<UserDto>> Me(Guid userId)
        {
            var user = await GetUserById(userId);
            return ResponseHelper.Create(await Map(user));
        }

        private async Task TryAssignDefaultRole(Guid userId, string roleName)
        {
            try
            {
                var role = await uow.roleRepository.GetByName(roleName);
                if (role == null || await uow.roleRepository.AssignmentExists(userId, role.Id))
                {
                    return;
                }

                await uow.roleRepository.AssignRole(userId, role.Id, null);
                await uow.SaveChangesAsync();
            }
            catch
            {
            }
        }

        private async Task EnsureStatusesAndUsers()
        {
            var now = DateTimeHelper.UtcNow();
            var hasChanges = false;

            var requiredStatuses = new[]
            {
                new { Id = UserStatusConstants.InactiveId, Code = UserStatusConstants.InactiveCode, Name = UserStatusConstants.InactiveName },
                new { Id = UserStatusConstants.ActiveId, Code = UserStatusConstants.ActiveCode, Name = UserStatusConstants.ActiveName }
            };

            foreach (var requiredStatus in requiredStatuses)
            {
                var status = await context.Statuses.FirstOrDefaultAsync(x => x.StatusId == requiredStatus.Id);

                if (status == null)
                {
                    await context.Statuses.AddAsync(new Status
                    {
                        StatusId = requiredStatus.Id,
                        Code = requiredStatus.Code,
                        ShowName = requiredStatus.Name,
                        CreatedAt = now
                    });

                    hasChanges = true;
                    continue;
                }

                if (status.Code != requiredStatus.Code || status.ShowName != requiredStatus.Name)
                {
                    status.Code = requiredStatus.Code;
                    status.ShowName = requiredStatus.Name;
                    hasChanges = true;
                }
            }

            var usersToNormalize = await context.Users
                .Where(user =>
                    user.StatusId == null ||
                    (user.DeletedAt == null && user.StatusId != UserStatusConstants.ActiveId) ||
                    (user.DeletedAt != null && user.StatusId != UserStatusConstants.InactiveId))
                .ToListAsync();

            foreach (var user in usersToNormalize)
            {
                user.StatusId = user.DeletedAt == null
                    ? UserStatusConstants.ActiveId
                    : UserStatusConstants.InactiveId;

                if (user.UpdateAt == null)
                {
                    user.UpdateAt = now;
                }

                hasChanges = true;
            }

            if (hasChanges)
            {
                await context.SaveChangesAsync();
            }
        }
    }
}
