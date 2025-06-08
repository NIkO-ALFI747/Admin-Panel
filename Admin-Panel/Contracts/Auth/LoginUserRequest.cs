using System.ComponentModel.DataAnnotations;

namespace Admin_Panel.Contracts.Auth;

public record LoginUserRequest(
    [Required] string Email,
    [Required] string Password);
