import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DbService {
  private readonly logger = new Logger(DbService.name);

  // Injetando o objeto Connection do Mongoose para monitorar o status
  constructor(@InjectConnection() private connection: Connection) {
    this.connection.on('connected', () => {
      this.logger.log('✅ Conexão com MongoDB Atlas estabelecida com sucesso!');
    });
    this.connection.on('error', (err) => {
      this.logger.error('❌ Erro de conexão com MongoDB Atlas:', err);
    });
    this.connection.on('disconnected', () => {
      this.logger.warn('⚠️ Conexão com MongoDB Atlas perdida.');
    });
  }

  // Exemplo de método que expõe o status da conexão, se necessário
  getConnectionStatus(): string {
    return this.connection.readyState === 1
      ? 'Connected'
      : 'Disconnected or connecting';
  }
}
