# 📋 Project Task List

## Core API Implementation

### Database & Architecture
- [x] Set up NestJS project structure
- [x] Configure TypeORM with SQLite
- [x] Create database module with provider pattern
- [x] Set up entity auto-discovery
- [x] Configure global API prefix (`/api`)
- [x] Configure global validation pipes

### Books Module (Core Feature)
- [x] Create Book entity with TypeORM
- [x] Create CreateBookDto with validation
- [x] Create UpdateBookDto
- [x] Implement BooksService (CRUD operations)
- [x] Implement BooksController
- [x] Add error handling (NotFoundException)
- [x] Register Books module in AppModule

### Users Module (Bonus Feature)
- [x] Create User entity with UUID primary keys
- [x] Create CreateUserDto with validation
- [x] Create UpdateUserDto
- [x] Create SafeUserDto (exclude password from responses)
- [x] Implement UsersService with password hashing
- [x] Implement UsersController
- [x] Add error handling for user operations
- [x] Implement `findByUsername` for authentication
- [x] Register Users module in AppModule

### Authentication & Authorization (Bonus Feature)
- [x] Install JWT and Passport dependencies
- [x] Create Auth module
- [x] Implement local strategy (username/password)
- [x] Implement JWT strategy
- [x] Create AuthService with login method
- [x] Create AuthController with login endpoint
- [x] Create JWT AuthGuard
- [x] Create @Public() decorator for public routes
- [x] Apply global JWT guard with public route exceptions
- [x] Secure all Books endpoints with JWT
- [x] Secure protected Users endpoints with JWT
- [x] Keep user registration endpoint public

### Security Hardening
- [x] Fix bcrypt salt rounds (use 10 rounds)
- [x] Add input validation with class-validator
- [x] Implement DTO validation
- [x] Add whitelist and forbidNonWhitelisted to validation pipe
- [x] Remove password from user responses

## Testing

### Unit Tests
- [ ] Write comprehensive UsersService tests
  - [ ] Test create user with password hashing
  - [ ] Test findAll (with password exclusion)
  - [ ] Test findOne (success and not found)
  - [ ] Test findByUsername
  - [ ] Test update user
  - [ ] Test update user password
  - [ ] Test remove user
- [ ] Write comprehensive UsersController tests
  - [ ] Mock UsersService
  - [ ] Test all CRUD endpoints
  - [ ] Test error handling
- [ ] Write comprehensive BooksService tests
  - [ ] Test create book
  - [ ] Test findAll
  - [ ] Test findOne (success and not found)
  - [ ] Test update book
  - [ ] Test remove book
- [ ] Write comprehensive BooksController tests
  - [ ] Mock BooksService
  - [ ] Test all CRUD endpoints
  - [ ] Test error handling
- [ ] Write AuthService tests
  - [ ] Test user validation
  - [ ] Test JWT token generation
- [ ] Write AuthController tests
  - [ ] Test login success
  - [ ] Test login failure
- [ ] Achieve >80% code coverage

### E2E Tests
- [ ] Set up test database configuration
- [ ] Write Books endpoint E2E tests
  - [ ] Test GET /api/books (with auth)
  - [ ] Test POST /api/books (with auth)
  - [ ] Test GET /api/books/:id (with auth)
  - [ ] Test PUT /api/books/:id (with auth)
  - [ ] Test DELETE /api/books/:id (with auth)
  - [ ] Test 401 responses without auth
- [ ] Write Users endpoint E2E tests
  - [ ] Test POST /api/users (public registration)
  - [ ] Test GET /api/users (with auth)
  - [ ] Test GET /api/users/:id (with auth)
  - [ ] Test PUT /api/users/:id (with auth)
  - [ ] Test DELETE /api/users/:id (with auth)
- [ ] Write Auth endpoint E2E tests
  - [ ] Test POST /api/auth/login (success)
  - [ ] Test POST /api/auth/login (invalid credentials)
  - [ ] Test protected routes with valid token
  - [ ] Test protected routes with invalid token

## Documentation

### API Documentation
- [ ] Install @nestjs/swagger
- [ ] Configure Swagger module in main.ts
- [ ] Add API metadata (title, description, version)
- [ ] Add @ApiTags() decorators to controllers
- [ ] Add @ApiOperation() to all endpoints
- [ ] Add @ApiResponse() decorators
- [ ] Add @ApiProperty() to all DTOs
- [ ] Add @ApiBearerAuth() to protected endpoints
- [ ] Document authentication flow
- [ ] Add example requests/responses
- [ ] Make Swagger UI available at /api/docs

### Code Documentation
- [ ] Add JSDoc comments to services
- [ ] Add JSDoc comments to controllers
- [ ] Add JSDoc comments to complex methods
- [ ] Document DTO properties
- [ ] Add README for each module explaining its purpose
- [ ] Document environment variables

### Project Documentation
- [ ] Update main README with complete setup instructions
- [ ] Add installation guide
- [ ] Add development guide
- [ ] Add testing guide
- [ ] Add deployment guide
- [ ] Document all environment variables
- [ ] Add architecture diagram
- [ ] Add API usage examples with curl/Postman

## Configuration & DevOps

### Environment Configuration
- [ ] Create .env.example file
- [ ] Install @nestjs/config
- [ ] Set up ConfigModule
- [ ] Move database config to .env
- [ ] Move JWT secret to .env
- [ ] Move JWT expiration to .env
- [ ] Move port configuration to .env
- [ ] Document all environment variables

### Database
- [ ] Add database migrations support
- [ ] Create initial migration
- [ ] Disable synchronize in production
- [ ] Add database seeding scripts
- [ ] Create seed data for development

### Code Quality
- [ ] Ensure all ESLint rules pass
- [ ] Ensure all Prettier formatting passes
- [ ] Set up pre-commit hooks (optional)
- [ ] Add npm script for linting
- [ ] Add npm script for formatting

## Nice to Have / Future Enhancements

- [ ] Add user roles (admin, user)
- [ ] Add pagination for GET /books and GET /users
- [ ] Add filtering and sorting
- [ ] Add refresh token functionality
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add CORS configuration
- [ ] Add helmet for security headers
- [ ] Add compression middleware
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Production deployment guide

## OpenAPI Specification Compliance

### Deviations from Spec
- [ ] Fix auth endpoint: Spec shows `/auth` but implemented as `/auth/login`
- [ ] Ensure all response codes match spec (200, 201, 204, 401, 404)
- [ ] Verify all required fields match spec
- [ ] Ensure DELETE returns 204 No Content (currently may return 200)
