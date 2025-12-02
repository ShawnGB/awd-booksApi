# Testing Guide

## Recommended Test Strategy

### 1. E2E Tests (Priority)
Test real HTTP requests through the entire stack.

**File:** `test/users.e2e-spec.ts`

**Test cases:**
- POST /users - create user (success + validation errors)
- GET /users - list all users
- GET /users/:id - get single user (success + 404)
- PUT /users/:id - update user
- DELETE /users/:id - delete user
- Verify passwords never returned in responses

**Setup:**
```typescript
let app: INestApplication;

beforeAll(async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = module.createNestApplication();
  await app.init();
});

// Use supertest for requests
request(app.getHttpServer())
  .post('/users')
  .send({ username: 'test', email: 'test@test.com', password: 'pass' })
  .expect(201)
```

**Tip:** Clean database between tests or use `:memory:` SQLite

---

### 2. Unit Tests (UsersService)

**File:** `src/users/users.service.spec.ts`

**Mock the repository:**
```typescript
const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Provide it
{
  provide: getRepositoryToken(User),
  useValue: mockRepository,
}
```

**Test cases:**
- create() - hashes password, saves user, excludes password from result
- findAll() - returns users without passwords
- findOne() - returns user OR throws NotFoundException
- update() - updates user, hashes password if provided
- remove() - deletes user OR throws NotFoundException
- findByUsername() - returns user with password (for auth)

**Mock bcrypt:**
```typescript
jest.mock('bcrypt');
(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
```

---

## Run Tests

```bash
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage report
```

---

## What NOT to Test

- Controller tests (covered by E2E)
- DTOs (just data classes)
- Framework code (NestJS decorators, etc.)
