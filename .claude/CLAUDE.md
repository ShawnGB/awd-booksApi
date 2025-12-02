# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS REST API for managing books and users with JWT authentication. The API serves as a fullstack development learning project at neue fische, demonstrating book collection management with user authentication.

**Base URL:** `http://localhost:3000/api`

## Development Commands

### Running the Application
- `npm run start:dev` - Run development server with hot reload
- `npm run start:debug` - Run with debugging enabled
- `npm run start` - Run without watch mode
- `npm run start:prod` - Run production build

### Building and Formatting
- `npm run build` - Compile TypeScript to JavaScript (output in `dist/`)
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint and auto-fix with ESLint

### Testing
- `npm test` - Run all unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage report
- `npm run test:debug` - Run tests with Node debugger
- `npm run test:e2e` - Run end-to-end tests

## Architecture

### Technology Stack
- **Framework:** NestJS 11.x
- **Database:** SQLite with TypeORM
- **Authentication:** bcrypt for password hashing (JWT implementation pending)
- **Validation:** class-validator and class-transformer

### Module Structure

The application follows NestJS modular architecture with a provider pattern for database access:

1. **DatabaseModule** (`src/database/`)
   - Provides centralized `DATA_SOURCE` using TypeORM
   - SQLite database file: `books-api.sqlite` (root directory)
   - Auto-synchronization enabled (`synchronize: true`)
   - Entity discovery via glob pattern: `**/*.entity{.ts,.js}`

2. **UsersModule** (`src/users/`)
   - CRUD operations for user management
   - User entity with UUID primary keys
   - Password hashing with bcrypt (currently missing salt rounds parameter)
   - Repository pattern via `USER_REPOSITORY` provider

3. **AppModule** (`src/app.module.ts`)
   - Root module importing DatabaseModule and UsersModule
   - Books module not yet implemented

### Database Architecture

**Provider Pattern:**
- Central DataSource injected as `DATA_SOURCE` token
- Feature modules create repository providers that inject `DATA_SOURCE`
- Example: `USER_REPOSITORY` uses `datasource.getRepository(User)`

**Current Entities:**
- `User`: id (uuid), username, email, password

### API Endpoints (Per README)

**Public Endpoints:**
- `POST /users` - User registration
- `POST /auth` - User login (returns Bearer token) - **Not yet implemented**

**Protected Endpoints (require Bearer token):**
- Books: `GET /books`, `POST /books`, `GET /books/:id`, `PUT /books/:id`, `DELETE /books/:id` - **Not yet implemented**
- Users: `GET /users`, `GET /users/:id`, `PUT /users/:id`, `DELETE /users/:id` - **Partially implemented**

### Data Models

**User/UserInput:**
- `id`: string (UUID, auto-generated)
- `username`: string (required)
- `email`: string (required)
- `password`: string (required, hashed with bcrypt)

**Book/BookInput:** (Not yet implemented)
- `id`: string
- `title`: string (required)
- `author`: string (required)
- `publishedYear`: integer (required)

## Code Conventions

### Commit Messages
Use conventional commit format as specified in global config:
```
type(scope): description

Examples:
feat(auth): add JWT authentication
fix(users): correct password hashing salt rounds
refactor(database): simplify provider configuration
```

### Code Style
- Single quotes for strings
- Trailing commas in multi-line structures
- TypeScript with decorators enabled
- Module resolution: `nodenext`

## Important Implementation Notes

1. **Security Issues:**
   - `bcrypt.hash()` called without salt rounds parameter (line 18 in users.service.ts) - should be `bcrypt.hash(password, 10)`
   - Passwords stored but no authentication/JWT implementation yet
   - No input validation DTOs implemented yet

2. **Incomplete Features:**
   - Books module/entity/controller not yet created
   - Auth module and JWT strategy missing
   - Most user service methods return placeholder strings
   - No global API prefix configured (README shows `/api` prefix)
   - No global validation pipe configured

3. **Database:**
   - SQLite file created in root directory
   - `synchronize: true` is enabled (development only - disable in production)
   - Entity files must match `**/*.entity{.ts,.js}` pattern

4. **Module Pattern:**
   - Each feature module imports DatabaseModule
   - Create `[Feature]Providers` array with repository provider
   - Inject `DATA_SOURCE` to create repositories
   - Use `@Inject('FEATURE_REPOSITORY')` in services
