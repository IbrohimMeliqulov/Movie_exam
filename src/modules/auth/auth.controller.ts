import { Body, Controller, Post, Req } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    login(
        @Body() payload: LoginDto,
        @Req() req: Request
    ) {
        return this.authService.login(payload, req)
    }
}
