import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms = require('ms'); // ms là thời gian tính bằng mili giây
import { Response } from 'express'; 

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
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

    async login(user: IUser, response: Response) {
  const { _id, name, email, role } = user;
  const payload = {
    sub: "token login",
    iss: "from server",
    _id,
    name,
    email,
    role
  };
  const refreshToken = this.createRefreshToken(payload);

// cập nhật người dùng với mã làm mới (refresh token)
  await this.usersService.updateUserToken(refreshToken, _id.toString()  );  

  // xét refresh token vào cookie
  response.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    // Ép kiểu (as any) cho tham số truyền VÀO hàm ms
    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as any) as any,

  })

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      _id,
    name,
    email,
    role
    } 
    
  };
 }// tạo ra chuỗi jwt và trả về cho người dùng
  async register(registerDto: RegisterUserDto) {
    const newUser = await this.usersService.register(registerDto);

    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
      
    };
  }

  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload,{
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: (ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as any ?? '1d') as unknown as number) / 1000,

    }
    );
    return refreshToken;
  }

  async processRefreshToken(refreshToken: string, response: Response) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      })
      const user = await this.usersService.findUserByToken(refreshToken);
      if(user){
        // update refresh token mới
          const { _id, name, email, role } = user;
  const payload = {
    sub: "token refresh",
    iss: "from server",
    _id,
    name,
    email,
    role
  };
  const refreshToken = this.createRefreshToken(payload);

// cập nhật người dùng với mã làm mới (refresh token)
  await this.usersService.updateUserToken(refreshToken, _id.toString()  );  

  // xét refresh token vào cookie
  response.clearCookie('refresh_token');// xóa cookie cũ
  response.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    // Ép kiểu (as any) cho tham số truyền VÀO hàm ms
    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE') as any) as any,

  })

  return {
    access_token: this.jwtService.sign(payload),
    user: {
      _id,
    name,
    email,
    role
    } 
    
  };
      }else{
        throw new BadRequestException('Refresh token đã hết hạn hoặc không hợp lệ, Vui lòng đăng nhập lại');
      }
    } catch (error) {
      throw new BadRequestException('Refresh token đã hết hạn hoặc không hợp lệ, Vui lòng đăng nhập lại');
    }
  }

  async logout(response: Response, user: IUser){
    await this.usersService.updateUserToken("", user._id.toString()  )
    response.clearCookie('refresh_token');
    return {
      message: 'Logout thành công'
    };
  }
}
