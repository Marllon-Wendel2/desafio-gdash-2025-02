import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { LoginDto } from "./interfaces/auth.dto";
import { LoginPipe } from "./interfaces/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body(LoginPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto.userName, loginDto.password);
  }
}
