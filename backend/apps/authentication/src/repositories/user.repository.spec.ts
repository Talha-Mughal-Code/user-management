import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { User, UserDocument, UserModel } from '@common/entities';
import { CreateUserDto } from '@common/dto';
import { ERROR_MESSAGES } from '@common/constants/error-messages';

describe('UserRepository', () => {
  let repository: UserRepository;
  let userModel: jest.Mocked<UserModel>;

  const mockUserDocument: Partial<UserDocument> = {
    _id: '507f1f77bcf86cd799439011' as any,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    comparePassword: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(true),
  };

  const mockSave = jest.fn().mockResolvedValue(mockUserDocument);
  
  const mockUserModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    ...mockUserDocument,
    save: mockSave,
  }));
  
  Object.assign(mockUserModel, {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockUserDocument]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUserDocument),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUserDocument),
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUserDocument),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create a new user successfully', async () => {
      const result = await repository.create(createUserDto);

      expect(mockUserModel).toHaveBeenCalledWith(createUserDto);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error if email already exists', async () => {
      mockSave.mockRejectedValueOnce({ code: 11000 });

      await expect(repository.create(createUserDto)).rejects.toThrow(ERROR_MESSAGES.EMAIL_EXISTS);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await repository.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('findById', () => {
    const userId = '507f1f77bcf86cd799439011';

    it('should return user by id', async () => {
      const result = await repository.findById(userId);

      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeDefined();
    });

    it('should return null if user not found', async () => {
      userModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as ReturnType<typeof userModel.findById>);

      const result = await repository.findById(userId);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';

    it('should return user by email', async () => {
      const result = await repository.findByEmail(email);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: email.toLowerCase() });
      expect(result).toBeDefined();
    });

    it('should return null if user not found', async () => {
      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as ReturnType<typeof userModel.findOne>);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('existsByEmail', () => {
    const email = 'test@example.com';

    it('should return true if user exists', async () => {
      userModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      } as unknown as ReturnType<typeof userModel.countDocuments>);

      const result = await repository.existsByEmail(email);

      expect(userModel.countDocuments).toHaveBeenCalledWith({ email: email.toLowerCase() });
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      userModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(0),
      } as unknown as ReturnType<typeof userModel.countDocuments>);

      const result = await repository.existsByEmail(email);

      expect(result).toBe(false);
    });
  });

  describe('deleteById', () => {
    const userId = '507f1f77bcf86cd799439011';

    it('should delete user by id', async () => {
      const result = await repository.deleteById(userId);

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(result).toBeDefined();
    });
  });
});

