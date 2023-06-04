import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}
