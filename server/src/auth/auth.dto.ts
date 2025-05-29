import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @MinLength(4, { message: 'Username must be at least 4 characters long.' })
  @MaxLength(32, { message: 'Username must be at most 32 characters long.' })
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message:
      'Username may only contain letters, numbers, underscores, dots, and hyphens.',
  })
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(64, { message: 'Password must be at most 64 characters long.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character.',
    },
  )
  password: string;
}
