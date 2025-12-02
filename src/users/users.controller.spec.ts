import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SafeUserDto } from './dto/safe-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockSafeUser: SafeUserDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      mockUsersService.create.mockResolvedValue(mockSafeUser);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockSafeUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        mockSafeUser,
        { id: '456', username: 'user2', email: 'user2@example.com' },
      ];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single user by id', async () => {
      mockUsersService.findOne.mockResolvedValue(mockSafeUser);

      const result = await controller.findOne(mockSafeUser.id);

      expect(service.findOne).toHaveBeenCalledWith(mockSafeUser.id);
      expect(result).toEqual(mockSafeUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
      };

      const updatedUser = { ...mockSafeUser, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(mockSafeUser.id, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(
        mockSafeUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should update user password', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newPassword123',
      };

      mockUsersService.update.mockResolvedValue(mockSafeUser);

      const result = await controller.update(mockSafeUser.id, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(
        mockSafeUser.id,
        updateUserDto,
      );
      expect(result).toEqual(mockSafeUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockSafeUser.id);

      expect(service.remove).toHaveBeenCalledWith(mockSafeUser.id);
      expect(result).toBeUndefined();
    });
  });
});
