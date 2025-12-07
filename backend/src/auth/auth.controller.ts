import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { LoginDto } from "./interfaces/auth.dto";
import { LoginPipe } from "./interfaces/auth.dto";
import { Public } from "./public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  async login(@Body(LoginPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto.userName, loginDto.password);
  }

  @Get("verify")
  async verifyToken(@Headers("authorization") authHeader: string) {
    if (!authHeader) {
      throw new UnauthorizedException("Token não fornecido");
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedException("Token não fornecido");
    }

    return this.authService.verifyTokenAndGetUser(token);
  }
}
