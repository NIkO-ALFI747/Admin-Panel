using Admin_Panel.Data;
using Admin_Panel.Extensions;
using Admin_Panel.Infrastructure;
using Admin_Panel.Interfaces.Auth;
using Admin_Panel.Interfaces.Repositories;
using Admin_Panel.Repositories;
using Admin_Panel.Services;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
// Add services to the container.

services.AddControllers();

var jwtOptions = new JwtOptions();

jwtOptions.SecretKey = builder.Configuration["JWT_SECRET_KEY"] ?? string.Empty;
var expiresHoursStr = builder.Configuration["JWT_EXPIRES_HOURS"];
if (int.TryParse(expiresHoursStr, out int expiresHours) && (expiresHours > 0))
{
    jwtOptions.ExpiresHours = expiresHours;
}
else
{
    throw new Exception("JWT_EXPIRES_HOURS is invalid");
}
if (string.IsNullOrEmpty(jwtOptions.SecretKey))
{
    throw new Exception("JWT_SECRET_KEY is not configured");
}
if (jwtOptions.SecretKey.Length < 64)
{
    throw new Exception("JWT_SECRET_KEY must have more than 63 symbols");
}

// This makes IOptions<JwtOptions> injectable elsewhere in your application if needed.
services.Configure<JwtOptions>(options =>
{
    options.SecretKey = jwtOptions.SecretKey;
    options.ExpiresHours = jwtOptions.ExpiresHours;
});

builder.Services.AddApiAuthentication(Options.Create(jwtOptions));

// Added
// Add the Neon database context using Npgsql provider
services.AddDbContext<AdminDbContext>(options =>
    options.UseNpgsql(Environment.GetEnvironmentVariable("DATASOURCE_URL"))
);
//options.UseNpgsql(
//    "DB_STRING"));

//

services.AddScoped<IUsersRepository, UsersRepository>();
services.AddScoped<UsersService>();

services.AddScoped<IJwtProvider, JwtProvider>();
services.AddScoped<IPasswordHasher, PasswordHasher>();



// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
services.AddOpenApi();

//// Set up JWT authentication to secure API endpoints
//services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            // Validate that the token is signed with the specified key
//            ValidateIssuerSigningKey = true,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY"))),
//            // Disable issuer and audience validation for testing purposes
//            ValidateIssuer = false,
//            ValidateAudience = false
//        };
//    });

services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS"));
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Admin-Panel"));
app.MapOpenApi();
//}

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    //HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});


// Crucial: Add Authentication and Authorization middleware
// Order matters: UseAuthentication before UseAuthorization.
app.UseAuthentication(); // Added

app.UseAuthorization();

app.UseCors();


app.MapControllers();

app.Run();
