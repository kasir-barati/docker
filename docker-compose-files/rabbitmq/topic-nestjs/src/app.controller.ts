import { Controller, Delete, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreatedUserDto } from './dtos/created-user.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiCreatedResponse({
    type: CreatedUserDto,
  })
  @Post()
  createUser() {
    return this.appService.createUser();
  }

  @ApiOkResponse({
    type: null,
  })
  @Delete()
  deleteUser() {
    return this.appService.deleteUser();
  }
}
