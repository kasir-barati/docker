import { ApiProperty } from '@nestjs/swagger';

export class CreatedUserDto {
  @ApiProperty({
    type: String,
    example: 'd4ad3aa7-bc0a-48d2-b3b3-b8e9469ef02c',
    required: true,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'asd@asd.com',
    required: true,
  })
  email: string;
}
