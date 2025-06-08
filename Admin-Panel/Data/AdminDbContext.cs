using Admin_Panel.Configurations;
using Admin_Panel.Models;
using Microsoft.EntityFrameworkCore;

namespace Admin_Panel.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options) { }
        // This DbSet represents the Users table in the database
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            base.OnModelCreating(modelBuilder);
        }
    }
}