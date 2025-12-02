import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Users API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let createdUserId: string;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);

    const createUserDto = {
      username: 'authuser',
      email: 'auth@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer()).post('/users').send(createUserDto);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'authuser', password: 'password123' });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.query('DELETE FROM user WHERE email = ?', [
        'auth@example.com',
      ]);
      await dataSource.destroy();
    }
    await app.close();
  });

  afterEach(async () => {
    if (dataSource && createdUserId) {
      await dataSource.query('DELETE FROM user WHERE id = ?', [createdUserId]);
      createdUserId = '';
    }
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const timestamp = Date.now();
      const createUserDto = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(createUserDto.username);
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body).not.toHaveProperty('password');

      createdUserId = response.body.id;
    });

    it('should not return password in response', async () => {
      const timestamp = Date.now();
      const createUserDto = {
        username: `testuser2${timestamp}`,
        email: `test2${timestamp}@example.com`,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).not.toHaveProperty('password');
      createdUserId = response.body.id;
    });
  });

  describe('GET /users', () => {
    beforeEach(async () => {
      const timestamp = Date.now();
      const createUserDto = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      createdUserId = response.body.id;
    });

    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).not.toHaveProperty('password');
    });
  });

  describe('GET /users/:id', () => {
    beforeEach(async () => {
      const timestamp = Date.now();
      const createUserDto = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      createdUserId = response.body.id;
    });

    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdUserId);
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('email');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      await request(app.getHttpServer())
        .get(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /users/:id', () => {
    beforeEach(async () => {
      const timestamp = Date.now();
      const createUserDto = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      createdUserId = response.body.id;
    });

    it('should update a user', async () => {
      const updateUserDto = {
        username: 'updateduser',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body.username).toBe(updateUserDto.username);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should update user email', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body.email).toBe(updateUserDto.email);
    });

    it('should update user password', async () => {
      const updateUserDto = {
        password: 'newpassword123',
      };

      const response = await request(app.getHttpServer())
        .put(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      const updateUserDto = {
        username: 'updateduser',
      };

      await request(app.getHttpServer())
        .put(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateUserDto)
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    beforeEach(async () => {
      const timestamp = Date.now();
      const createUserDto = {
        username: `testuser${timestamp}`,
        email: `test${timestamp}@example.com`,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      createdUserId = response.body.id;
    });

    it('should delete a user', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${createdUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      createdUserId = '';

      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      await request(app.getHttpServer())
        .get(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      await request(app.getHttpServer())
        .delete(`/users/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
