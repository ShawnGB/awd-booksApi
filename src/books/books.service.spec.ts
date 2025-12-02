import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  const mockBook: Book = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Book',
    author: 'Test Author',
    publishedYear: 2023,
  };

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023,
      };

      mockRepository.save.mockResolvedValue(mockBook);

      const result = await service.create(createBookDto);

      expect(mockRepository.save).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [
        mockBook,
        {
          id: '456',
          title: 'Another Book',
          author: 'Another Author',
          publishedYear: 2024,
        },
      ];
      mockRepository.find.mockResolvedValue(books);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(books);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array if no books exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findOne(mockBook.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockBook.id },
      });
      expect(result).toEqual(mockBook);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        'Book with ID nonexistent-id not found',
      );
    });
  });

  describe('update', () => {
    it('should update a book and return updated data', async () => {
      const updateBookDto = {
        title: 'Updated Title',
        author: 'Updated Author',
      };

      const updatedBook = { ...mockBook, ...updateBookDto };
      mockRepository.findOne.mockResolvedValueOnce(mockBook);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(updatedBook);

      const result = await service.update(mockBook.id, updateBookDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockBook.id },
      });
      expect(mockRepository.update).toHaveBeenCalledWith(mockBook.id, {
        ...updateBookDto,
      });
      expect(result).toEqual(updatedBook);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('nonexistent-id', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('nonexistent-id', { title: 'Updated' }),
      ).rejects.toThrow('Book with ID nonexistent-id not found');
    });

    it('should throw NotFoundException if book not found after update', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockBook);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.update(mockBook.id, { title: 'Updated' }),
      ).rejects.toThrow(
        'Book with ID ' + mockBook.id + ' not found after update',
      );
    });

    it('should update only publishedYear', async () => {
      const updateBookDto = {
        publishedYear: 2025,
      };

      const updatedBook = { ...mockBook, publishedYear: 2025 };
      mockRepository.findOne.mockResolvedValueOnce(mockBook);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValueOnce(updatedBook);

      const result = await service.update(mockBook.id, updateBookDto);

      expect(result.publishedYear).toBe(2025);
      expect(result.title).toBe(mockBook.title);
      expect(result.author).toBe(mockBook.author);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockBook.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockBook.id },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith(mockBook.id);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        'Book with ID nonexistent-id not found',
      );
    });
  });
});
