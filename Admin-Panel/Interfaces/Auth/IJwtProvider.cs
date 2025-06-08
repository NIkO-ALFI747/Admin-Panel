using Admin_Panel.Models;

namespace Admin_Panel.Interfaces.Auth
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
    }
}