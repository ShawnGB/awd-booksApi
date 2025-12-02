import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Books API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let createdBookId: string;
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
      username: 'bookuser',
      email: 'book@example.com',
      password: 'password123',
    };

    await request(app.getHttpServer()).post('/users').send(createUserDto);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'bookuser', password: 'password123' });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.query('DELETE FROM user WHERE email = ?', [
        'book@example.com',
      ]);
      await dataSource.destroy();
    }
    await app.close();
  });

  afterEach(async () => {
    if (dataSource && createdBookId) {
      await dataSource.query('DELETE FROM book WHERE id = ?', [createdBookId]);
      createdBookId = '';
    }
  });

  describe('POST /books', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createBookDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createBookDto.title);
      expect(response.body.author).toBe(createBookDto.author);
      expect(response.body.publishedYear).toBe(createBookDto.publishedYear);

      createdBookId = response.body.id;
    });

    it('should create a book with all required fields', async () => {
      const createBookDto = {
        title: 'Another Book',
        author: 'Another Author',
        publishedYear: 2024,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createBookDto)
        .expect(201);

      expect(response.body.title).toBe(createBookDto.title);
      expect(response.body.author).toBe(createBookDto.author);
      expect(response.body.publishedYear).toBe(createBookDto.publishedYear);

      createdBookId = response.body.id;
    });
  });

  describe('GET /books', () => {
    beforeEach(async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createBookDto);

      createdBookId = response.body.id;
    });

    it('should return all books', async () => {
      const response = await request(app.getHttpServer())
        .get('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('author');
      expect(response.body[0]).toHaveProperty('publishedYear');
    });
  });

  describe('GET /books/:id', () => {
    beforeEach(async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createBookDto);

      createdBookId = response.body.id;
    });

    it('should return a book by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/books/${createdBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', createdBookId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('author');
      expect(response.body).toHaveProperty('publishedYear');
    });

    it('should return 404 for non-existent book', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      await request(app.getHttpServer())
        .get(`/books/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /books/:id', () => {
    beforeEach(async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createBookDto);

      createdBookId = response.body.id;
    });

    it('should update a book title', async () => {
      const updateBookDto = {
        title: 'Updated Title',
      };

      const response = await request(app.getHttpServer())
        .put(`/books/${createdBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body.title).toBe(updateBookDto.title);
      expect(response.body.author).toBe('Test Author');
      expect(response.body.publishedYear).toBe(2023);
    });

    it('should update a book author', async () => {
      const updateBookDto = {
        author: 'Updated Author',
      };

      const response = await request(app.getHttpServer())
        .put(`/books/${createdBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body.author).toBe(updateBookDto.author);
      expect(response.body.title).toBe('Test Book');
    });

    it('should update a book published year', async () => {
      const updateBookDto = {
        publishedYear: 2025,
      };

      const response = await request(app.getHttpServer())
        .put(`/books/${createdBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body.publishedYear).toBe(updateBookDto.publishedYear);
      expect(response.body.title).toBe('Test Book');
      expect(response.body.author).toBe('Test Author');
    });

    it('should update multiple fields at once', async () => {
      const updateBookDto = {
        title: 'Completely Updated',
        author: 'New Author',
        publishedYear: 2026,
      };

      const response = await request(app.getHttpServer())
        .put(`/books/${createdBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateBookDto)
        .expect(200);

      expect(response.body.title).toBe(updateBookDto.title);
      expect(response.body.author).toBe(updateBookDto.author);
      expect(response.body.publishedYear).toBe(updateBookDto.publishedYear);
    });

    it('should return 404 for non-existent book', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      const updateBookDto = {
        title: 'Updated Title',
      };

      await request(app.getHttpServer())
        .put(`/books/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateBookDto)
        .expect(404);
    });
  });

  describe('DELETE /books/:id', () => {
    beforeEach(async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023,
      };

      const response = await request(app.getHttpServer())
        .post('/books')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createBookDto);

      createdBookId = response.body.id;
    });

    it('should delete a book', async () => {
      await request(app.getHttpServer())
        .delete(`/books/${createdBookId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      createdBookId = '';

      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      await request(app.getHttpServer())
        .get(`/books/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent book', async () => {
      const fakeId = '123e4567-e89b-12d3-a456-426614174999';
      await request(app.getHttpServer())
        .delete(`/books/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
