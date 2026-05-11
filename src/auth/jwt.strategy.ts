import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Ambil token dari header "Authorization: Bearer <TOKEN>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_SIMRS_2024', // Harus sama dengan di AuthModule
    });
  }

  async validate(payload: any) {
  // Pastikan payload.sub (ID Pasien/User) dikembalikan
  return { 
    sub: payload.sub, 
    username: payload.username, 
    role: payload.role 
  };
  }
}
