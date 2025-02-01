import { Controller, Delete, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
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
