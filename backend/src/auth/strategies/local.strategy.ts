import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  private readonly logger = new Logger(LocalStrategy.name);

  async validate(username: string, password: string): Promise<any> {
    this.logger.log(`Validating user ${username}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.warn(`User ${username} not found`);
      throw new HttpException(
        'User not found or not approved',
        HttpStatus.NOT_FOUND,
      );
    }
    this.logger.log(`User ${username} found`);
    return user;
  }
}
