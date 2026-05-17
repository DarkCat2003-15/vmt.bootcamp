using Scalar.AspNetCore;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;
using Steam.Web.Api.Extensions;
using Steam.Web.Api.Middleware;
using SteamApplication.Interfaces.Servicie;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

await builder.Services.AddCore(builder.Configuration);

builder.Services.AddSingleton<SteamApplication.Servicios.EmailTemplates.EmailTemplateData>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
    var emailTemplateService = scope.ServiceProvider.GetRequiredService<IEmailTemplateService>();

    await emailTemplateService.Init();
    await userService.CreateFirstUser();
}

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/scalar", options =>
    {
        options.WithTitle("STEAM API")
               .WithOpenApiRoutePattern("/openapi/{documentName}.json");
    });
}

app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
