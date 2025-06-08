using Admin_Panel.Data;
using Admin_Panel.Interfaces.Repositories;
using Admin_Panel.Models;
using Microsoft.EntityFrameworkCore;

namespace Admin_Panel.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly AdminDbContext _context;
        public UsersRepository(AdminDbContext context)
        {
            _context = context;
        }
        public async Task Add(User user)
        {
            try
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex) 
            {
                Console.WriteLine(ex.Message);
            }
        }
        public async Task<User> GetByEmail(string email)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email) ?? throw new Exception();
            return user;
        }
    }
}
