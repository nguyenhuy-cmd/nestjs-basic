import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}
    // username và pass là 2 tham số thư viện passport truyền vào

    async validateUser(username: string, password: string): Promise<any>{
        const user = await this.usersService.findOneByUsername(username);
        if(user){
        const isValid = this.usersService.isValidPassword(password, user.password)
        if(isValid === true){
            return user;
        }
    }
        return null;
    }// xác thực người dùng xem có đúng tài khoản và mật khẩu không

    async login(user: any) {
    const payload = { 
        username: user.email,
        sub: user._id
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
    }// tạo ra chuỗi jwt và trả về cho người dùng
}
