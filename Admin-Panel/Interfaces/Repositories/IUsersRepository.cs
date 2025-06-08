using Admin_Panel.Models;

namespace Admin_Panel.Interfaces.Repositories
{
    public interface IUsersRepository
    {
        Task Add(User user);
        Task<User> GetByEmail(string email);
    }
}