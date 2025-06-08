namespace Admin_Panel.Models
{
    public class User
    {
        private User(string firstName, string lastName, int age, string passwordHash, string email)
        {
            FirstName = firstName;
            LastName = lastName;
            Age = age;
            PasswordHash = passwordHash;
            Email = email;
        }

        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }

        public static User Create(string firstName,
            string lastName, int age, string passwordHash, string email)
        {
            return new User(firstName, lastName, age, passwordHash, email);
        }
    }
}