import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AuthDto } from './auth.dto';

describe('AuthDto Validation', () => {
  it('should fail if username is missing', async () => {
    const dto = plainToInstance(AuthDto, { password: 'pw' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if password is too short', async () => {
    const dto = plainToInstance(AuthDto, { username: 'user', password: '1' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should succeed with valid data', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'user',
      password: 'Test1234!', // gültiges Passwort: min. 8 Zeichen, Groß-, Kleinbuchstabe, Zahl, Sonderzeichen
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if username is too short', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'a',
      password: 'Test1234!',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if username is too long', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'a'.repeat(33),
      password: 'Test1234!',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if username contains invalid characters', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'user!@#',
      password: 'Test1234!',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if password is missing uppercase', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'user',
      password: 'test1234!',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if password is missing lowercase', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'user',
      password: 'TEST1234!',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if password is missing number', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'user',
      password: 'TestTest!',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if password is missing special character', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'user',
      password: 'Test12345',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if password is too long', async () => {
    const dto = plainToInstance(AuthDto, {
      username: 'user',
      password: 'A1!a'.repeat(20),
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
