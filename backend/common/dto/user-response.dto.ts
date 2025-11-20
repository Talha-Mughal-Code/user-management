import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '507f1f77bcf86cd799439011',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-15T12:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
