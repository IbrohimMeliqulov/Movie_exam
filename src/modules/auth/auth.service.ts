import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { checkPassword } from 'src/core/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService) { }

    async login(payload: LoginDto, req: Request) {
        const existUser = await this.prisma.users.findFirst({
            where: { username: payload.username }
        })

        if (!existUser) throw new BadRequestException("Username or password wrong")

        const comparePass = await checkPassword(payload.password, existUser.password)

        if (!comparePass) throw new BadRequestException("Username or password wrong")
        const accessToken = await this.jwtService.sign({ id: existUser.id, email: existUser.email, role: existUser.role })
        return {
            success: true,
            message: "You logged in successfully",
            accessToken
        }
    }
}
