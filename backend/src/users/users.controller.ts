import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import type { CreateUserDto, UpdateUserDto } from "./dto/create-user.dto";
import { CreateUserPipe, UpdateUserPipe } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(CreateUserPipe) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body(UpdateUserPipe) updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
