import * as bcrypt from "bcryptjs";
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import type { CreateUserDto, UpdateUserDto } from "./dto/create-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./interfaces/user.interface";

@Injectable()
export class UsersService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashed = await bcrypt.hash(createUserDto.password, 10);

      const newUser = {
        userName: createUserDto.userName,
        hashPassword: hashed,
      };

      return await this.userModel.create(newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Erro interno do servidor");
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      (updateUserDto as any).hashPassword = updateUserDto.password;
      delete (updateUserDto as any).password;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    return updatedUser;
  }

  async remove(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser)
      throw new NotFoundException(`Usuário com id ${id} não encontrado`);
    return { message: `Usuário ${id} removido com sucesso` };
  }
}
