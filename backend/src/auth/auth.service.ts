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
    const user = await this.validateUser(userName, password);

    // Converter ObjectId para string
    const userId = user._id.toString();

    const payload = {
      sub: userId,
      userName: user.userName,
    };

    const secret = process.env.JWT_SECRET || "secret";

    const token = jwt.sign(payload, secret, {
      expiresIn: "1h",
    });

    return {
      accessToken: token,
      user: {
        id: userId,
        userName: user.userName,
      },
    };
  }

  // Método para verificar um token (útil para debug)
  verifyToken(token: string) {
    try {
      const secret = process.env.JWT_SECRET || "secret";
      return jwt.verify(token, secret);
    } catch (error) {
      throw new UnauthorizedException("Token inválido");
    }
  }
}
