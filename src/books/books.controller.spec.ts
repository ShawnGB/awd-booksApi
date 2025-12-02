import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook: Book = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Book',
    author: 'Test Author',
    publishedYear: 2023,
  };

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023,
      };

      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(service.create).toHaveBeenCalledWith(createBookDto);
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
      mockBooksService.findAll.mockResolvedValue(books);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(books);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no books exist', async () => {
      mockBooksService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single book by id', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(mockBook.id);

      expect(service.findOne).toHaveBeenCalledWith(mockBook.id);
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: UpdateBookDto = {
        title: 'Updated Title',
      };

      const updatedBook = { ...mockBook, ...updateBookDto };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(mockBook.id, updateBookDto);

      expect(service.update).toHaveBeenCalledWith(mockBook.id, updateBookDto);
      expect(result).toEqual(updatedBook);
    });

    it('should update book author', async () => {
      const updateBookDto: UpdateBookDto = {
        author: 'New Author',
      };

      const updatedBook = { ...mockBook, author: 'New Author' };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(mockBook.id, updateBookDto);

      expect(service.update).toHaveBeenCalledWith(mockBook.id, updateBookDto);
      expect(result.author).toBe('New Author');
    });

    it('should update book published year', async () => {
      const updateBookDto: UpdateBookDto = {
        publishedYear: 2025,
      };

      const updatedBook = { ...mockBook, publishedYear: 2025 };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(mockBook.id, updateBookDto);

      expect(service.update).toHaveBeenCalledWith(mockBook.id, updateBookDto);
      expect(result.publishedYear).toBe(2025);
    });
  });

  describe('remove', () => {
    it('should delete a book', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockBook.id);

      expect(service.remove).toHaveBeenCalledWith(mockBook.id);
      expect(result).toBeUndefined();
    });
  });
});
