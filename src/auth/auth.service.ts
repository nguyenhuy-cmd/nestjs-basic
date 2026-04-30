import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

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

    async login(user: IUser) {
  const { _id, name, email, role } = user;
  const payload = {
    sub: "token login",
    iss: "from server",
    _id,
    name,
    email,
    role
  };
  return {
    access_token: this.jwtService.sign(payload),
    _id,
    name,
    email,
    role
  };
 }// tạo ra chuỗi jwt và trả về cho người dùng
  async register(registerDto: RegisterUserDto) {
    const newUser = await this.usersService.register(registerDto);

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
      
    };
  }
}
