# 📚 Book Library API (awd-books-api)

A RESTful API built with NestJS for managing a book library with user authentication and authorization.

## 🚀 Project Overview

This project is a learning exercise in fullstack development at neue fische, demonstrating:
- RESTful API design following OpenAPI specifications
- NestJS framework architecture and best practices
- TypeORM with SQLite database
- JWT-based authentication and authorization
- Input validation and security hardening
- Comprehensive testing strategies

### 🌐 Base URL

All endpoints are accessible under:

```
http://localhost:3000/api
```

## ✨ Features

### Implemented ✅
- **Book Management**: Complete CRUD operations for books
- **User Management**: User registration and profile management
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Authorization**: Global JWT guard with public route exceptions
- **Validation**: Request validation using class-validator
- **Error Handling**: Proper HTTP status codes and error messages
- **Security**: Password hashing, input validation, whitelist validation

### In Progress 🚧
- **Testing**: Unit and E2E tests (scaffolded, needs implementation)
- **Documentation**: OpenAPI/Swagger documentation

### Planned 📋
- Database migrations
- API documentation (Swagger)
- Comprehensive test coverage

See [TASKS.md](./TASKS.md) for the complete task list.

## 📋 API Endpoints

### Public Endpoints (No Authentication Required)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/api/users` | Register a new user | `username`, `email`, `password` |
| `POST` | `/api/auth/login` | Login and receive JWT token | `username`, `password` |

### Protected Endpoints (Require Bearer Token)

All endpoints below require the `Authorization: Bearer <token>` header.

#### Books Management

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/books` | Get all books | - |
| `POST` | `/api/books` | Create a new book | `title`, `author`, `publishedYear` |
| `GET` | `/api/books/:id` | Get a specific book | - |
| `PUT` | `/api/books/:id` | Update a book | `title`, `author`, `publishedYear` |
| `DELETE` | `/api/books/:id` | Delete a book | - |

#### User Management

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/api/users` | Get all users | - |
| `GET` | `/api/users/:id` | Get a specific user | - |
| `PUT` | `/api/users/:id` | Update a user | `username`, `email`, `password` (optional) |
| `DELETE` | `/api/users/:id` | Delete a user | - |

## 📊 Data Models

### Book

```typescript
{
  id: string;              // UUID, auto-generated
  title: string;           // Required
  author: string;          // Required
  publishedYear: number;   // Required, 1000-current year+1
}
```

### User (Response)

```typescript
{
  id: string;              // UUID, auto-generated
  username: string;        // Required
  email: string;           // Required
  // password is never returned in responses
}
```

### User (Registration/Update)

```typescript
{
  username: string;        // Required
  email: string;           // Required
  password: string;        // Required, hashed with bcrypt (10 rounds)
}
```

### Authentication Response

```typescript
{
  access_token: string;    // JWT token
}
```

## 🔐 Authentication

This API uses JWT (JSON Web Tokens) for authentication.

### How to Authenticate

1. **Register a user** (if you don't have one):
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{
       "username": "johndoe",
       "email": "john@example.com",
       "password": "securePassword123"
     }'
   ```

2. **Login to get a token**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "johndoe",
       "password": "securePassword123"
     }'
   ```

   Response:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

3. **Use the token for protected routes**:
   ```bash
   curl -X GET http://localhost:3000/api/books \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd awd-books-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The SQLite database will be created automatically on first run.

### Running the Application

#### Development Mode (with hot reload)
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

#### Debug Mode
```bash
npm run start:debug
```

The API will be available at `http://localhost:3000/api`

## 🚀 Deployment

This application is configured for continuous deployment on Render.

- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions
- **Auto-Deploy**: Configured via `render.yaml` - pushes to `main` branch trigger automatic deployments
- **Production Database**: PostgreSQL (SQLite for local development only)
- **Docker**: Uses multi-stage build for optimized production image

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:cov
```

### Run E2E Tests
```bash
npm run test:e2e
```

**Note:** Test implementation is in progress. See [TASKS.md](./TASKS.md) for testing tasks.

## 🏗️ Project Structure

```
src/
├── app.module.ts           # Root module
├── main.ts                 # Application entry point
├── database/               # Database configuration
│   ├── database.module.ts
│   └── database.providers.ts
├── auth/                   # Authentication module
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── jwt-auth.guard.ts
│   ├── strategies/
│   └── decorators/
├── users/                  # User management
│   ├── users.module.ts
│   ├── users.service.ts
│   ├── users.controller.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       └── safe-user.dto.ts
└── books/                  # Book management
    ├── books.module.ts
    ├── books.service.ts
    ├── books.controller.ts
    ├── entities/
    │   └── book.entity.ts
    └── dto/
        ├── create-book.dto.ts
        └── update-book.dto.ts
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the application |
| `npm run start:dev` | Start with hot reload |
| `npm run start:debug` | Start with debugger |
| `npm run start:prod` | Start production build |
| `npm run build` | Build the project |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Lint and fix with ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests |

## 📝 HTTP Status Codes

| Code | Description | When |
|------|-------------|------|
| `200 OK` | Success | GET, PUT requests |
| `201 Created` | Resource created | POST requests |
| `204 No Content` | Success, no content | DELETE requests |
| `400 Bad Request` | Invalid input | Validation errors |
| `401 Unauthorized` | Authentication failed | Invalid/missing token, wrong credentials |
| `404 Not Found` | Resource not found | Invalid ID |

## 🛡️ Security Features

- **Password Hashing**: All passwords hashed with bcrypt (10 salt rounds)
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Request validation using class-validator
- **Whitelist Validation**: Strips unknown properties from requests
- **Password Exclusion**: Passwords never returned in API responses
- **Global Guards**: Default JWT protection on all routes (except @Public())

## 🔄 Database

- **Type**: PostgreSQL (production), SQLite (development/testing)
- **ORM**: TypeORM
- **Location**: `books-api.sqlite` (local development only)
- **Auto-sync**: Enabled in development, disabled in production

### Entities

- **User**: id (uuid), username, email, password (hashed)
- **Book**: id (uuid), title, author, publishedYear

## 📚 Technology Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: SQLite with TypeORM 0.3.x
- **Authentication**: JWT, Passport, bcrypt
- **Validation**: class-validator, class-transformer
- **Testing**: Jest 30.x, Supertest
- **Code Quality**: ESLint, Prettier

## 🤝 Contributing

This is a learning project. Contributions are welcome!

## 📄 License

UNLICENSED

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [OpenAPI Specification](./TASKS.md#openapi-specification-compliance)

---

**Project Status**: 🚧 In Development - See [TASKS.md](./TASKS.md) for current progress and upcoming tasks.
