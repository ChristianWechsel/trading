import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { User } from '../src/users/user.entity';

describe('Auth Integration (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    dataSource = app.get(DataSource);
    // Set DB to SQLite in-memory for tests
    await dataSource.destroy();
    dataSource.setOptions({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [User],
    });
    await dataSource.initialize();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register and login a user', async () => {
    // Registration
    const registerRes = await request(app.getHttpServer())
      .post('/users')
      .send({ username: 'testuser', password: 'testpw' })
      .expect(201);
    expect(registerRes.body).toHaveProperty('id');

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpw' })
      .expect(201);
    expect(loginRes.body).toHaveProperty('access_token');
  });

  it('should not login with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrong' })
      .expect(401);
  });
});
