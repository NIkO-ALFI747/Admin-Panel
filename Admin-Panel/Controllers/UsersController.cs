using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Admin_Panel.Data;
using Admin_Panel.Models;
using Microsoft.AspNetCore.Authorization;

namespace Admin_Panel.Controllers;

//[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AdminDbContext _context;
    public UsersController(AdminDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        // Retrieve all users from the database
        return await _context.Users.ToListAsync();
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        // Retrieve a single user by ID
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(); // Return 404 if not found
        return user;
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        // Add a new user to the database
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        // Return 201 Created status with the newly created user
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        // Ensure the ID in the URL matches the ID of the provided user
        if (id != user.Id) return BadRequest();
        // Find the user by ID
        var dbUser = await _context.Users.FindAsync(id);
        if (dbUser == null) return NotFound(); // Return 404 if not found
        
        dbUser.FirstName = user.FirstName;
        dbUser.LastName = user.LastName;
        dbUser.Age = user.Age;

        // Mark the user as modified
        _context.Entry(dbUser).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        // Return 204 No Content status after a successful update
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        // Find the user by ID
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound(); // Return 404 if not found
        // Remove the user from the database
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        // Return 204 No Content status after successful deletion
        return NoContent();
    }
}