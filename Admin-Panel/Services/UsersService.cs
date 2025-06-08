using Admin_Panel.Interfaces.Auth;
using Admin_Panel.Interfaces.Repositories;
using Admin_Panel.Models;

namespace Admin_Panel.Services;

public class UsersService
{
    private readonly IJwtProvider _jwtProvider;
    private readonly IUsersRepository _usersRepository;
    private readonly IPasswordHasher _passwordHasher;
    public UsersService(
        IUsersRepository usersRepository, 
        IPasswordHasher passwordHasher,
        IJwtProvider jwtProvider)
    {
        _jwtProvider = jwtProvider;
        _usersRepository = usersRepository;
        _passwordHasher = passwordHasher;
    }
    public async Task Register(string firstName, string lastName, int age, string email, string password)
    {
        var passwordHash = _passwordHasher.Generate(password);
        var user = User.Create(firstName,
            lastName, age, passwordHash, email);
        await _usersRepository.Add(user);
    }
    public async Task<string> Login(string email, string password)
    {
        var user = await _usersRepository.GetByEmail(email);

        var result = _passwordHasher.Verify(password, user.PasswordHash);
        
        if (result == false)
        {
            throw new Exception("Failed to login");
        }

        var token = _jwtProvider.GenerateToken(user);

        return token;
    }
}
