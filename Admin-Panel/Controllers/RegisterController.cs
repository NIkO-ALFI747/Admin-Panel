using Admin_Panel.Contracts.Auth;
using Admin_Panel.Services;
using Microsoft.AspNetCore.Mvc;

namespace Admin_Panel.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    [HttpPost]
    public async Task<IResult> Register(
        RegisterUserRequest request,
        UsersService usersService)
    {
        await usersService.Register(request.FirstName,
            request.LastName, request.Age,
            request.Email, request.Password);
        return Results.Ok();
    }
}
