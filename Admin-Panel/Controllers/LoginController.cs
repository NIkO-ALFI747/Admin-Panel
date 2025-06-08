using Admin_Panel.Contracts.Auth;
using Admin_Panel.Services;
using Microsoft.AspNetCore.Mvc;

namespace Admin_Panel.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    [HttpPost]
    public async Task<IResult> Login(
        LoginUserRequest request,
        UsersService usersService
        )
    {
        var token = await usersService.Login(request.Email, request.Password);

        HttpContext.Response.Cookies.Append("api-cookies", token);
        
        return Results.Ok();
    }
}
