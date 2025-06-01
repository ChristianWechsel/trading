import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

type MockRepository<T = any> = {
  findOne: jest.Mock<any, any>;
  create: jest.Mock<any, any>;
  save: jest.Mock<any, any>;
};

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository;

  beforeEach(async () => {
    usersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password and create user', async () => {
    const username = 'test';
    const password = 'secret';
    usersRepository.create.mockReturnValue({ username, password });
    usersRepository.save.mockResolvedValue({ id: 1, username });
    const result = await service.create(username, password);
    expect(usersRepository.create).toHaveBeenCalled();
    expect(usersRepository.save).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
  });

  it('should create admin user if not exists', async () => {
    usersRepository.findOne.mockResolvedValue(null);
    usersRepository.create.mockReturnValue({
      username: 'admin',
      password: 'pw',
    });
    usersRepository.save.mockResolvedValue({ id: 1, username: 'admin' });
    const result = await service.createAdminUserIfNotExists();
    expect(result).toHaveProperty('username', 'admin');
  });

  it('should not create admin user if exists', async () => {
    usersRepository.findOne.mockResolvedValue({ username: 'admin' });
    const result = await service.createAdminUserIfNotExists();
    expect(result).toBeNull();
  });
});
