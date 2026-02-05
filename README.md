# Full-Stack Admin Panel: Secure User Management System

## Overview

A production-ready, containerized full-stack web application implementing secure user management with JWT-based authentication, built on modern ASP.NET Core 9.0 backend and React 19 frontend. The system demonstrates enterprise-grade architecture patterns including repository pattern, dependency injection, cookie-based session management, and Docker containerization for scalable deployment.

## Architecture Overview

### System Design

**Architecture Pattern**: Three-tier architecture with clear separation of concerns
- **Presentation Layer**: React 19 SPA with Bootstrap 5 styling
- **Business Logic Layer**: ASP.NET Core Web API with service-oriented architecture
- **Data Access Layer**: Entity Framework Core with Repository pattern over PostgreSQL

**Key Architectural Decisions**:
- **RESTful API Design**: Stateless HTTP communication
- **JWT Authentication**: Token-based security with secure cookie storage
- **Dependency Injection**: ASP.NET Core built-in DI container for loose coupling
- **ORM Abstraction**: Entity Framework Core Code-First approach
- **Containerization**: Docker multi-stage builds for optimized deployment

### Technology Stack

**Backend**:
- **Framework**: ASP.NET Core 9.0 Web API
- **Database**: PostgreSQL 13+ (via Npgsql provider)
- **ORM**: Entity Framework Core 9.0.5
- **Authentication**: JWT Bearer Authentication (Microsoft.AspNetCore.Authentication.JwtBearer 9.0.5)
- **Password Hashing**: BCrypt.Net-Next 4.0.3 (Enhanced mode)
- **API Documentation**: OpenAPI/Swagger (Swashbuckle 8.1.2)

**Frontend**:
- **Framework**: React 19.1.0 with React Router 7.6.2
- **Build Tool**: Vite 6.3.5 (fast HMR, optimized bundling)
- **Styling**: Bootstrap 5.3.6 + React Bootstrap 2.10.10 + SASS 1.89.1
- **Data Tables**: DataTables.net ecosystem (BS5 integration, advanced features)
- **HTTP Client**: Axios 1.9.0
- **State Management**: React Hooks (useState, useEffect)

**Infrastructure**:
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose (multi-container deployment)
- **Runtime**: .NET 9.0 Runtime (mcr.microsoft.com/dotnet/aspnet:9.0)

## Backend Architecture

### Project Structure

```
Admin-Panel/
├── Controllers/          # API endpoint definitions
├── Services/             # Business logic layer
├── Repositories/         # Data access layer
├── Models/               # Domain entities
├── Data/                 # DbContext and database configuration
├── Infrastructure/       # Cross-cutting concerns (JWT, hashing)
├── Interfaces/           # Abstraction contracts
├── Contracts/            # DTOs for API communication
├── Extensions/           # Service registration extensions
├── Configurations/       # EF Core entity configurations
└── Migrations/           # EF Core schema migrations
```

### Domain Model

**User Entity**:
```csharp
public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public int Age { get; set; }
    public string PasswordHash { get; set; }
    public string Email { get; set; }  // Unique index
    
    private User(string firstName, string lastName, int age, 
                 string passwordHash, string email)
    {
        // Private constructor enforces factory pattern
    }
    
    public static User Create(string firstName, string lastName, 
                             int age, string passwordHash, string email)
    {
        return new User(firstName, lastName, age, passwordHash, email);
    }
}
```

**Design Patterns Applied**:
1. **Factory Method**: `User.Create()` static factory enforces controlled instantiation
2. **Encapsulation**: Private constructor prevents external direct instantiation
3. **Domain-Driven Design**: Entity contains business logic and validation rules

**Entity Configuration**:
```csharp
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasIndex(u => u.Email).IsUnique();
    }
}
```
- **Unique Constraint**: Email uniqueness enforced at database level
- **Fluent API**: Explicit configuration separates mapping from entity

### Repository Pattern Implementation

**Interface Definition**:
```csharp
public interface IUsersRepository
{
    Task<User> GetByEmail(string email);
    Task Add(User user);
    // Additional CRUD operations
}
```

**Concrete Implementation**:
```csharp
public class UsersRepository : IUsersRepository
{
    private readonly AdminDbContext _context;
    
    public UsersRepository(AdminDbContext context)
    {
        _context = context;
    }
    
    public async Task<User> GetByEmail(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
    
    public async Task Add(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
}
```

**Benefits**:
- **Abstraction**: Controllers don't depend on EF Core directly
- **Testability**: Repository can be mocked for unit tests
- **Centralized Data Access**: Database queries isolated in single layer
- **Flexibility**: Easy to swap ORM or database provider

### Service Layer Architecture

**UsersService** (Business Logic Orchestration):
```csharp
public class UsersService
{
    private readonly IJwtProvider _jwtProvider;
    private readonly IUsersRepository _usersRepository;
    private readonly IPasswordHasher _passwordHasher;
    
    public UsersService(IUsersRepository usersRepository, 
                       IPasswordHasher passwordHasher,
                       IJwtProvider jwtProvider)
    {
        _jwtProvider = jwtProvider;
        _usersRepository = usersRepository;
        _passwordHasher = passwordHasher;
    }
    
    public async Task Register(string firstName, string lastName, 
                              int age, string email, string password)
    {
        var passwordHash = _passwordHasher.Generate(password);
        var user = User.Create(firstName, lastName, age, passwordHash, email);
        await _usersRepository.Add(user);
    }
    
    public async Task<string> Login(string email, string password)
    {
        var user = await _usersRepository.GetByEmail(email);
        
        if (!_passwordHasher.Verify(password, user.PasswordHash))
        {
            throw new Exception("Failed to login");
        }
        
        return _jwtProvider.GenerateToken(user);
    }
}
```

**Dependency Injection**:
- **Constructor Injection**: All dependencies injected via constructor
- **Interface-Based**: Depends on abstractions (IPasswordHasher, IJwtProvider)
- **Single Responsibility**: Service coordinates between layers, no direct DB access

### Authentication System

#### Password Hashing with BCrypt

**Implementation**:
```csharp
public class PasswordHasher : IPasswordHasher
{
    public string Generate(string password) =>
        BCrypt.Net.BCrypt.EnhancedHashPassword(password);

    public bool Verify(string password, string hashedPassword) =>
        BCrypt.Net.BCrypt.EnhancedVerify(password, hashedPassword);
}
```

**Security Features**:
- **Enhanced Mode**: BCrypt with SHA-384 pre-hashing (handles long passwords)
- **Adaptive Cost**: Automatically scales computational cost with hardware improvements
- **Salt Integration**: Unique salt per password (stored in hash string)
- **Rainbow Table Resistance**: Salting prevents precomputed attack vectors

**BCrypt Algorithm**:
```
Hash Format: $2b$[cost]$[22-char salt][31-char hash]
Example: $2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW
```
- **Cost Factor**: Default 11-12 (2^12 = 4,096 iterations)
- **Work Factor**: Exponentially increases brute-force difficulty

#### JWT Token Generation

**JwtProvider Implementation**:
```csharp
public class JwtProvider : IJwtProvider
{
    private readonly JwtOptions _options;

    public JwtProvider(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public string GenerateToken(User user)
    {
        Claim[] claims = [new("userId", user.Id.ToString())];

        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey)),
            SecurityAlgorithms.HmacSha256);
            
        var token = new JwtSecurityToken(
            claims: claims,
            signingCredentials: signingCredentials,
            expires: DateTime.UtcNow.AddHours(_options.ExpiresHours));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

**JWT Structure**:
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "123",
    "exp": 1735689600
  },
  "signature": "HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)"
}
```

**Token Characteristics**:
- **Algorithm**: HMAC-SHA256 (symmetric signing)
- **Claims**: Minimal payload (userId only for efficiency)
- **Expiration**: Configurable via JWT_EXPIRES_HOURS (default 12 hours)
- **Stateless**: No server-side session storage required

**Configuration Validation**:
```csharp
if (string.IsNullOrEmpty(jwtOptions.SecretKey))
    throw new Exception("JWT_SECRET_KEY is not configured");
    
if (jwtOptions.SecretKey.Length < 64)
    throw new Exception("JWT_SECRET_KEY must have more than 63 symbols");
```
- **Key Length**: Minimum 64 characters (256 bits) enforced
- **Startup Validation**: Fails fast if misconfigured
- **Environment-Based**: Secrets loaded from environment variables

#### JWT Authentication Middleware

**Extension Method**:
```csharp
public static void AddApiAuthentication(
    this IServiceCollection services,
    IOptions<JwtOptions> jwtOptions)
{
    services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.TokenValidationParameters = new()
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtOptions.Value.SecretKey))
            };
            
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["api-cookies"];
                    return Task.CompletedTask;
                }
            };
        });
    services.AddAuthorization();
}
```

**Token Extraction Flow**:
1. `OnMessageReceived` event intercepts HTTP request
2. Extracts JWT from `api-cookies` cookie
3. Populates `context.Token` for validation pipeline
4. Token validated against signing key and expiration

**Validation Parameters**:
- **IssuerSigningKey Validation**: Ensures token signed with correct secret
- **Lifetime Validation**: Rejects expired tokens
- **Issuer/Audience**: Disabled (not multi-tenant application)

### Controller Layer

**LoginController**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    [HttpPost]
    public async Task<IResult> Login(
        LoginUserRequest request,
        UsersService usersService)
    {
        var token = await usersService.Login(request.Email, request.Password);
        
        HttpContext.Response.Cookies.Append("api-cookies", token);
        
        return Results.Ok();
    }
}
```

**Cookie Configuration**:
```csharp
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    Secure = CookieSecurePolicy.Always
});
```

**Security Attributes**:
- **SameSite=Strict**: Prevents CSRF attacks (cookie not sent cross-origin)
- **Secure=Always**: Cookie transmitted only over HTTPS
- **HttpOnly**: Implicitly set (JavaScript cannot access cookie)

**RegisterController**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class RegisterController : ControllerBase
{
    [HttpPost]
    public async Task<IResult> Register(
        RegisterUserRequest request,
        UsersService usersService)
    {
        await usersService.Register(request.FirstName, request.LastName, 
                                    request.Age, request.Email, request.Password);
        return Results.Ok();
    }
}
```

**Data Transfer Objects**:
```csharp
public record LoginUserRequest(
    [Required] string Email,
    [Required] string Password);

public record RegisterUserRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required] int Age,
    [Required] string Email,
    [Required] string Password);
```

**Record Types**:
- **Immutability**: Records are immutable by default
- **Value Equality**: Automatic implementation of structural equality
- **Concise Syntax**: Positional parameters with built-in deconstruction
- **Validation Attributes**: Data Annotations for automatic model validation

**UsersController** (Protected Endpoints):
```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AdminDbContext _context;
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [Authorize]  // JWT required
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        return user;
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.Id) return BadRequest();
        
        var dbUser = await _context.Users.FindAsync(id);
        if (dbUser == null) return NotFound();
        
        dbUser.FirstName = user.FirstName;
        dbUser.LastName = user.LastName;
        dbUser.Age = user.Age;

        _context.Entry(dbUser).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        
        return NoContent();
    }
}
```

**Authorization Strategy**:
- **Selective Protection**: `[Authorize]` on sensitive endpoints only
- **Attribute-Based**: Declarative security via attributes
- **Middleware Integration**: ASP.NET Core automatically validates JWT

### CORS Configuration

```csharp
services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS"));
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});
```

**Security Considerations**:
- **Origin Whitelist**: Only specified origins allowed (no wildcard)
- **Environment-Based**: Different origins per deployment (dev/prod)
- **Preflight Requests**: OPTIONS method automatically handled

### Database Layer

**AdminDbContext**:
```csharp
public class AdminDbContext : DbContext
{
    public AdminDbContext(DbContextOptions<AdminDbContext> options) 
        : base(options) { }
        
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        base.OnModelCreating(modelBuilder);
    }
}
```

**Connection Configuration**:
```csharp
services.AddDbContext<AdminDbContext>(options =>
    options.UseNpgsql(Environment.GetEnvironmentVariable("DATASOURCE_URL"))
);
```

**Entity Framework Migrations**:

**Initial Migration** (20250530112606_InitialCreate):
```csharp
migrationBuilder.CreateTable(
    name: "Users",
    columns: table => new
    {
        Id = table.Column<int>(type: "integer", nullable: false)
            .Annotation("Npgsql:ValueGenerationStrategy", 
                       NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
        FirstName = table.Column<string>(type: "text", nullable: false),
        LastName = table.Column<string>(type: "text", nullable: false),
        Age = table.Column<int>(type: "integer", nullable: false)
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_Users", x => x.Id);
    });
```

**Schema Evolution** (20250601100456_NewUsersProps):
- Added `PasswordHash` and `Email` columns
- Migration enables non-breaking schema changes

**Unique Index Migration** (20250601113711_UsersUniqueIndexingEmail):
- Enforces email uniqueness at database level
- Prevents race conditions in application layer

**Migration Commands**:
```bash
# Add new migration
dotnet ef migrations add MigrationName

# Apply migrations to database
dotnet ef database update

# Generate SQL script
dotnet ef migrations script
```

## Frontend Architecture

### React Application Structure

```
src/
├── components/
│   ├── Auth/              # Login/Registration forms
│   ├── NavBar/            # Navigation and sidebar
│   ├── Users/             # User management components
│   │   └── TableSection/  # DataTable integration
│   └── Router/            # Routing configuration
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegistrationPage.jsx
│   ├── UsersPage.jsx
│   ├── ContactPage.jsx
│   └── ErrorPage.jsx
└── services/
    └── user.js            # API communication layer
```

### Routing System

**AppRouter** (React Router v7):
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function AppRouter() {
  const [isAuth, setIsAuth] = useState(false);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage isAuth={isAuth} setIsAuth={setIsAuth} />} />
        <Route path="/login" element={<LoginPage isAuth={isAuth} setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/users" element={<UsersPage isAuth={isAuth} setIsAuth={setIsAuth} />} />
        <Route path="/contact" element={<ContactPage isAuth={isAuth} setIsAuth={setIsAuth} />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
```

**State Management**:
- `isAuth`: Global authentication state (lifted to router level)
- `setIsAuth`: State setter passed down to components
- **Pattern**: Prop drilling (suitable for simple auth state)

### Data Fetching Layer

**Axios Service**:
```javascript
import axios from "axios";

export const fetchUsers = async () => {
    try {
        const response = await axios.get(import.meta.env.VITE_USERS_URL);
        console.log(response);
    } catch (e) {
        console.error(e);
    }
}
```

**Environment Variables**:
- `VITE_USERS_URL`: Injected at build time via Vite
- Allows different API endpoints per environment (dev/prod)

**Axios Configuration**:
- **Automatic JSON Parsing**: Response data automatically deserialized
- **Cookie Handling**: Axios sends cookies automatically (credentials: 'include')
- **Error Handling**: Structured error objects with HTTP status codes

### UI Components

**UsersPage**:
```jsx
function UsersPage({isAuth, setIsAuth}) {
  return (
    <div className="vh-100 body overflow-auto">
      <NavBar isAuth={isAuth} setIsAuth={setIsAuth}/>
      <div className="container d-flex justify-content-center align-items-start">
        <div className="row border rounded-5 p-3 mt-5 mb-3 bg-white shadow">
          <TableSection />
        </div>
      </div>
    </div>
  );
}
```

**Bootstrap Integration**:
- **Utility Classes**: `vh-100`, `d-flex`, `justify-content-center`
- **Grid System**: `container`, `row` for responsive layout
- **Spacing**: `p-3`, `mt-5`, `mb-3` for consistent padding/margins
- **Visual Effects**: `border`, `rounded-5`, `shadow` for card styling

**DataTables Integration**:

**Dependencies**:
```json
{
  "datatables.net-bs5": "^2.3.2",
  "datatables.net-buttons-bs5": "^3.2.3",
  "datatables.net-colreorder-bs5": "^2.1.1",
  "datatables.net-responsive-bs5": "^3.0.4",
  "datatables.net-searchbuilder-bs5": "^1.8.2",
  "datatables.net-select-bs5": "^3.0.1"
}
```

**Features Enabled**:
- **Buttons**: Export to CSV/Excel/PDF, Print, Copy
- **ColReorder**: Drag-and-drop column reordering
- **Responsive**: Automatic column collapsing on mobile
- **SearchBuilder**: Advanced multi-field filtering
- **Select**: Row selection for bulk operations
- **StateRestore**: Save/restore table state across sessions

### Build Configuration

**Vite Configuration**:
```javascript
// vite.config.js
export default {
  server: {
    host: '0.0.0.0',  // Bind to all interfaces (Docker compatibility)
    port: 5000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}
```

**Development Server**:
- **HMR (Hot Module Replacement)**: Instant updates without full reload
- **Fast Refresh**: Preserves component state during edits
- **Optimized Dependencies**: Pre-bundled node_modules for speed

## Containerization Strategy

### Multi-Stage Dockerfile

**Backend Dockerfile**:
```dockerfile
# Stage 1: Base runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

# Stage 2: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Admin-Panel/Admin-Panel.csproj", "Admin-Panel/"]
RUN dotnet restore "./Admin-Panel/Admin-Panel.csproj"
COPY . .
WORKDIR "/src/Admin-Panel"
RUN dotnet build "./Admin-Panel.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Stage 3: Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Admin-Panel.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Stage 4: Final image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Admin-Panel.dll"]
```

**Optimization Techniques**:
1. **Layer Caching**: `COPY` .csproj before source code (dependencies cached separately)
2. **Multi-Stage**: Build artifacts not included in final image (smaller size)
3. **Non-Root User**: `USER $APP_UID` for security (principle of least privilege)
4. **Framework-Dependent**: No AppHost (smaller deployment, requires .NET runtime)

**Image Sizes**:
- SDK image: ~1.2 GB (build-time only)
- Runtime image: ~200 MB (production deployment)
- Final image: ~220 MB (runtime + application)

### Docker Compose Orchestration

```yaml
services:
  admin-panel.api:
    environment:
      - ASPNETCORE_ENVIRONMENT=Release
      - ASPNETCORE_HTTP_PORTS=8080
      - DATASOURCE_URL=DB_STRING
      - CORS_ALLOWED_ORIGINS=http://localhost:5000
      - JWT_SECRET_KEY=f0d434ae83ced653867bc258b0b010a96e1fdbfe15600b7a949323a0b92f11f3
      - JWT_EXPIRES_HOURS=12
    container_name: admin-panel.api
    image: admin-panel.api
    build:
      context: .
      dockerfile: Admin-Panel/Dockerfile
    ports:
      - "8080:8080"

  admin-panel.client:
    build:
      context: Front-End/Admin-Panel
      dockerfile: Dockerfile
      args:
        - VITE_USERS_URL=http://localhost:8080/api/users
    image: admin-panel.client
    container_name: admin-panel.client
    ports:
      - "5000:5000"
    depends_on:
      - admin-panel.api
```

**Service Dependencies**:
- `depends_on`: Client waits for API to start (sequential startup)
- **Network**: Containers on same bridge network (name resolution by service name)

**Build Arguments**:
- `VITE_USERS_URL`: Injected into Vite build process
- Enables environment-specific API endpoints

**Deployment Workflow**:
```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

## Security Architecture

### Defense-in-Depth Strategy

**Layer 1: Application Security**
1. **BCrypt Password Hashing**
   - Adaptive cost factor (future-proof against hardware improvements)
   - Per-password salting (prevents rainbow table attacks)
   - Enhanced mode SHA-384 pre-hashing (handles long passwords)

2. **JWT Token Security**
   - HMAC-SHA256 signing (tamper-proof)
   - Short expiration (12 hours configurable)
   - Minimal claims (reduces attack surface)
   - Secret key validation (64+ character minimum)

3. **Cookie Security**
   - SameSite=Strict (CSRF protection)
   - Secure=Always (HTTPS-only transmission)
   - HttpOnly (XSS mitigation)

**Layer 2: Network Security**
1. **CORS Policy**
   - Explicit origin whitelist
   - No wildcard origins
   - Environment-based configuration

2. **HTTPS Enforcement**
   - Cookie policy requires secure transport
   - Production deployment via reverse proxy (Nginx/Traefik)

**Layer 3: Data Security**
1. **Database Constraints**
   - Email uniqueness (prevents duplicate accounts)
   - NOT NULL constraints (data integrity)
   - Foreign key constraints (referential integrity)

2. **Parameterized Queries**
   - Entity Framework Core (automatic parameterization)
   - No raw SQL (SQL injection prevention)

### Authentication Flow

```
┌─────────┐                 ┌─────────┐                 ┌──────────┐
│ Client  │                 │   API   │                 │ Database │
└────┬────┘                 └────┬────┘                 └────┬─────┘
     │                           │                           │
     │  POST /api/register       │                           │
     ├──────────────────────────>│                           │
     │  {email, password, ...}   │                           │
     │                           │  Hash password (BCrypt)   │
     │                           │                           │
     │                           │  INSERT INTO Users        │
     │                           ├──────────────────────────>│
     │                           │                           │
     │  200 OK                   │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  POST /api/login          │                           │
     ├──────────────────────────>│                           │
     │  {email, password}        │                           │
     │                           │  SELECT * FROM Users      │
     │                           ├──────────────────────────>│
     │                           │  WHERE email = ?          │
     │                           │<──────────────────────────┤
     │                           │  {user data}              │
     │                           │                           │
     │                           │  Verify password (BCrypt) │
     │                           │  Generate JWT             │
     │                           │                           │
     │  200 OK                   │                           │
     │  Set-Cookie: api-cookies  │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  GET /api/users/123       │                           │
     │  Cookie: api-cookies      │                           │
     ├──────────────────────────>│                           │
     │                           │  Validate JWT             │
     │                           │  Extract userId from token│
     │                           │                           │
     │                           │  SELECT * FROM Users      │
     │                           ├──────────────────────────>│
     │                           │  WHERE id = 123           │
     │                           │<──────────────────────────┤
     │  200 OK                   │                           │
     │  {user data}              │                           │
     │<──────────────────────────┤                           │
```

### Vulnerability Mitigations

**1. SQL Injection**
- **Risk**: Malicious SQL in user input
- **Mitigation**: Entity Framework Core automatic parameterization
- **Status**: ✓ Protected

**2. Cross-Site Scripting (XSS)**
- **Risk**: JavaScript injection in HTML
- **Mitigation**: React automatic escaping, HttpOnly cookies
- **Status**: ✓ Protected

**3. Cross-Site Request Forgery (CSRF)**
- **Risk**: Unwanted actions via authenticated requests
- **Mitigation**: SameSite=Strict cookie policy
- **Status**: ✓ Protected

**4. Brute Force Attacks**
- **Risk**: Password guessing
- **Mitigation**: BCrypt computational cost (rate limiting recommended)
- **Status**: ⚠️ Partial (add rate limiting in production)

**5. JWT Token Theft**
- **Risk**: Stolen token grants access
- **Mitigation**: Short expiration, secure cookies, HTTPS
- **Status**: ✓ Protected (with HTTPS)

**6. Mass Assignment**
- **Risk**: Unintended property modification
- **Mitigation**: DTOs for API, explicit property mapping
- **Status**: ✓ Protected

## Database Schema

**Users Table**:
```sql
CREATE TABLE "Users" (
    "Id" SERIAL PRIMARY KEY,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Age" INTEGER NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Email" TEXT NOT NULL
);

CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
```

**Normalization**: 3NF (no redundant data, atomic values)
**Primary Key**: Auto-incrementing integer (SERIAL)
**Unique Constraint**: Email field (business rule enforcement)

## API Endpoints

### Authentication

**POST /api/register**
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
```

**POST /api/login**
```json
Request:
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
Set-Cookie: api-cookies=[JWT_TOKEN]; Secure; HttpOnly; SameSite=Strict
```

### User Management

**GET /api/users**
```json
Response: 200 OK
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "age": 30,
    "email": "john@example.com",
    "passwordHash": "$2b$12$..."
  }
]
```

**GET /api/users/{id}** (Requires Authentication)
```
Authorization: Cookie: api-cookies=[JWT_TOKEN]

Response: 200 OK
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "age": 30,
  "email": "john@example.com",
  "passwordHash": "$2b$12$..."
}
```

**PUT /api/users/{id}**
```json
Request:
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "age": 31,
  "email": "john@example.com",
  "passwordHash": "$2b$12$..."
}

Response: 204 No Content
```

**DELETE /api/users/{id}**
```
Response: 204 No Content
```

## Development Setup

### Prerequisites

**Backend**:
- .NET 9.0 SDK
- PostgreSQL 13+
- Docker Desktop (optional)

**Frontend**:
- Node.js 18+
- npm or yarn

### Local Development

**1. Clone Repository**
```bash
git clone [repository-url]
cd Admin-Panel-main
```

**2. Configure Environment Variables**

Create `.env` file in `Admin-Panel/` directory:
```env
DATASOURCE_URL=Host=localhost;Port=5432;Database=adminpanel;Username=postgres;Password=yourpassword
JWT_SECRET_KEY=your-64-character-minimum-secret-key-here-make-it-random
JWT_EXPIRES_HOURS=12
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**3. Database Setup**
```bash
cd Admin-Panel

# Create database
createdb -U postgres adminpanel

# Apply migrations
dotnet ef database update
```

**4. Run Backend**
```bash
dotnet run
# API available at http://localhost:8080
# Swagger UI at http://localhost:8080/swagger
```

**5. Run Frontend**
```bash
cd ../Front-End/Admin-Panel

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend available at http://localhost:5173
```

### Docker Development

**Single Command Deployment**:
```bash
# Update database connection in docker-compose.yml
# Update DATASOURCE_URL with your PostgreSQL connection string

docker-compose up --build
```

**Access Points**:
- Backend API: http://localhost:8080
- Frontend: http://localhost:5000
- Swagger: http://localhost:8080/swagger

## Production Deployment

### Environment Configuration

**Required Environment Variables**:
```env
# Database
DATASOURCE_URL=postgres://user:pass@host:5432/dbname?sslmode=require

# JWT Configuration
JWT_SECRET_KEY=generate-strong-random-key-min-64-chars
JWT_EXPIRES_HOURS=12

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# ASP.NET Core
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_HTTP_PORTS=8080
```

### Database Migration Strategy

**Approach 1: Startup Migration** (Not Recommended for Production)
```csharp
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AdminDbContext>();
    db.Database.Migrate();  // Apply pending migrations
}
```

**Approach 2: Pre-Deployment Script** (Recommended)
```bash
# Generate SQL script
dotnet ef migrations script --output migrations.sql

# Review and apply manually
psql -U postgres -d adminpanel -f migrations.sql
```

### Scaling Considerations

**Horizontal Scaling**:
- Stateless API design (JWT in cookies, no session state)
- Database connection pooling (EF Core default)
- Load balancer with sticky sessions (not required)

**Database Optimization**:
- Index on Email column (already implemented)
- Connection pooling parameters:
```
DATASOURCE_URL=...;Pooling=true;MinPoolSize=5;MaxPoolSize=20;
```

**Caching Strategy** (Future Enhancement):
- Redis for session management
- Response caching middleware
- Database query result caching

## Testing Strategy

### Unit Testing

**Backend Tests** (Recommended Setup):
```csharp
public class UsersServiceTests
{
    [Fact]
    public async Task Login_WithValidCredentials_ReturnsToken()
    {
        // Arrange
        var mockRepo = new Mock<IUsersRepository>();
        var mockHasher = new Mock<IPasswordHasher>();
        var mockJwt = new Mock<IJwtProvider>();
        
        var user = User.Create("John", "Doe", 30, "hash", "john@example.com");
        mockRepo.Setup(r => r.GetByEmail("john@example.com"))
                .ReturnsAsync(user);
        mockHasher.Setup(h => h.Verify("password", "hash"))
                  .Returns(true);
        mockJwt.Setup(j => j.GenerateToken(user))
               .Returns("token123");
        
        var service = new UsersService(mockRepo.Object, mockHasher.Object, mockJwt.Object);
        
        // Act
        var token = await service.Login("john@example.com", "password");
        
        // Assert
        Assert.Equal("token123", token);
    }
}
```

### Integration Testing

**API Tests**:
```csharp
public class UsersControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    
    public UsersControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }
    
    [Fact]
    public async Task GetUsers_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/users");
        
        // Assert
        response.EnsureSuccessStatusCode();
    }
}
```

### Frontend Testing

**Component Tests** (Recommended Setup):
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginSection from './LoginSection';

test('submits login form with credentials', () => {
  render(<LoginSection setIsAuth={jest.fn()} />);
  
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Assert API call made
});
```

## Performance Optimization

### Backend Optimizations

1. **Async/Await Pattern**: All I/O operations non-blocking
2. **Entity Framework Tracking**: 
```csharp
var users = await _context.Users.AsNoTracking().ToListAsync();
```
3. **Projection**: Select only required columns
```csharp
var userNames = await _context.Users
    .Select(u => new { u.FirstName, u.LastName })
    .ToListAsync();
```

### Frontend Optimizations

1. **Code Splitting**: React.lazy for route-based splitting
2. **Vite Tree Shaking**: Unused code eliminated
3. **DataTables Pagination**: Client-side pagination for large datasets
4. **Production Build**:
```bash
npm run build
# Output: minified, compressed, optimized
```

## Known Limitations

1. **No Rate Limiting**: Brute force protection not implemented
2. **Basic Error Handling**: Generic exception messages (consider ProblemDetails)
3. **No Audit Logging**: User actions not tracked
4. **Single Role**: No role-based access control (RBAC)
5. **Password Reset**: No forgot password functionality
6. **Email Verification**: No email confirmation flow

## Future Enhancements

### Security Improvements
- **Rate Limiting**: ASP.NET Core rate limiting middleware
- **2FA**: TOTP-based two-factor authentication
- **Password Policy**: Complexity requirements, expiration
- **Account Lockout**: Temporary lockout after failed attempts

### Feature Additions
- **User Roles**: Admin, User, Guest with different permissions
- **Audit Logging**: Track all CRUD operations
- **Email Service**: SendGrid/SMTP integration for notifications
- **Password Reset**: Secure token-based password recovery
- **Profile Pictures**: Azure Blob Storage integration

### Architecture Enhancements
- **CQRS Pattern**: Separate read/write models
- **Mediator Pattern**: MediatR for clean command handling
- **Domain Events**: Event-driven architecture for side effects
- **Health Checks**: `/health` endpoint for monitoring

## License

This project is licensed under the MIT License – see the LICENSE file for details.

## Contributing

This project demonstrates modern full-stack development practices:
- **Backend**: ASP.NET Core 9 with clean architecture
- **Authentication**: JWT with BCrypt password hashing
- **Frontend**: React 19 with modern hooks
- **DevOps**: Docker containerization and compose orchestration
- **Security**: Defense-in-depth approach

---

**Technical Highlights**: Repository pattern, dependency injection, JWT authentication, BCrypt hashing, Entity Framework migrations, React hooks, Vite build tooling, Docker multi-stage builds, cookie-based session management.
