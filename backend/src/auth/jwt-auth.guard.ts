import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Permite rotas de login (ajuste conforme suas rotas públicas)
    if (request.url === "/auth/login" && request.method === "POST") {
      return true;
    }

    if (!authHeader) {
      throw new UnauthorizedException("Token não fornecido");
    }

    // Verifica se o header tem o formato correto
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException(
        "Formato de token inválido. Use: Bearer <token>"
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const secret = process.env.JWT_SECRET || "secret";

    try {
      const payload = jwt.verify(token, secret);
      request.user = payload;
      return true;
    } catch (error) {
      console.error("Erro JWT:", error.message);

      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token expirado");
      } else if (error.name === "JsonWebTokenError") {
        throw new UnauthorizedException("Token inválido");
      } else {
        throw new UnauthorizedException("Erro na autenticação");
      }
    }
  }
}
