import { Controller, Get, Post, Render, UseGuards, Request, Body } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';


@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Public()// Không cần token
  // Guard local để xác thực tài khoản đăng nhập 
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  @ResponseMessage("Đăng ký tài khoản thành công")
  handleRegister(@Body() registerDto: RegisterUserDto){
    return this.authService.register(registerDto);
  }
}
