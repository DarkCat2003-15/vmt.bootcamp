# Steam Backend

Backend en ASP.NET Core para el clon de Steam.

## Postman

Importa estos dos archivos:

- `API.postman_collection.json`
- `API.postman_environment.template.json`

La colección ya quedó preparada para demo:

- Guarda `registerToken` al iniciar registro.
- Guarda `userId` al completar registro.
- Guarda `token` y `refreshToken` al iniciar sesión y renovar sesión.
- Guarda `otpCode` para recuperación de contraseña.
- Guarda `appVersion` al consultar la info de la app.
- Usa variables para `baseUrl`, credenciales y passwords de prueba.

Variables principales:

- `baseUrl`
- `registerEmail`
- `registerUsername`
- `registerPassword`
- `loginEmail`
- `loginPassword`
- `recoverNewPassword`
- `changePasswordNew`

## Brevo SMTP

El proyecto ya funciona con SMTP, así que Brevo se integra sin cambiar de proveedor ni librería.

Valores a configurar:

- `Smtp__Host=smtp-relay.brevo.com`
- `Smtp__Port=587`
- `Smtp__User=tu_usuario_smtp_de_brevo`
- `Smtp__Password=tu_clave_smtp_de_brevo`
- `Smtp__From=tu_remitente_validado`

No subas estas credenciales a GitHub. Configúralas como variables de entorno o secretos.

## Render

Se agregaron estos archivos para despliegue:

- `Dockerfile`
- `.dockerignore`
- `render.yaml`

Variables de entorno mínimas en Render:

- `ConnectionStrings__database-1`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__PrivateKey`
- `Smtp__From`
- `Smtp__User`
- `Smtp__Password`
- `FirstAppTime__User__Email`
- `FirstAppTime__User__Password`

Render no ofrece base de datos SQL Server administrada dentro de su oferta habitual, así que para este proyecto necesitas una instancia externa de SQL Server.

## Notas

- En Render se habilitó soporte de `X-Forwarded-*` para que HTTPS funcione bien detrás del proxy.
- `appsettings.json` quedó con placeholders, no con credenciales reales.
