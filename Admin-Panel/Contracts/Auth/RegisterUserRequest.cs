using System.ComponentModel.DataAnnotations;

namespace Admin_Panel.Contracts.Auth;

public record RegisterUserRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required] int Age,
    [Required] string Email,
    [Required] string Password);