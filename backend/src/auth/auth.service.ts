import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import type { User } from "src/users/interfaces/user.interface";

@Injectable()
export class AuthService {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userModel.findOne({ userName }).exec();
    if (!user) throw new UnauthorizedException("Usuário ou senha inválidos");

    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordValid)
      throw new UnauthorizedException("Usuário ou senha inválidos");

    return user;
  }

  async login(userName: string, password: string) {
    console.log(userName);
    console.log(password);
    const user = await this.validateUser(userName, password);
    console.log("user", user);

    const payload = { sub: user._id, userName: user.userName };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    return { accessToken: token };
  }
}
