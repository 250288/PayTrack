import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByPhone(dto.phoneNumber);
    if (existing) {
      throw new ConflictException('An account with this phone number already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      phoneNumber: dto.phoneNumber,
      passwordHash,
      fullName: dto.fullName,
    });

    // TODO: trigger SMS OTP here (e.g. via Eskiz.uz) before setting phoneVerified = true.
    // Skipping for MVP scaffold -- wire this in before any real signups.

    return this.issueTokens(user.id, user.phoneNumber);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByPhone(dto.phoneNumber);
    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    return this.issueTokens(user.id, user.phoneNumber);
  }

  private issueTokens(userId: string, phoneNumber: string) {
    const payload = { sub: userId, phoneNumber };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }
}
