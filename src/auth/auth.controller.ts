import { Controller, Get, Post, Render, UseGuards, Body, Res, Req } from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Public()// Không cần token
  // Guard local để xác thực tài khoản đăng nhập 
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("Đăng nhập tài khoản thành công")
  handleLogin(
  @Req() req, 
  @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  //@UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  @ResponseMessage("Đăng ký tài khoản thành công")
  handleRegister(@Body() registerDto: RegisterUserDto){
    return this.authService.register(registerDto);
  }

  @Get('/account')
  account(@User() user: IUser){
    return {user};
  } 

  @Public()
  @ResponseMessage("Get User by refresh token")
  @Get("/refresh")
  handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response){
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processRefreshToken(refreshToken, response);
  }

  @ResponseMessage('Logout User')
  @Post('/logout')
  handleLogout(
    @Res({passthrough: true}) response: Response,
    @User() user: IUser 
  ){
      return this.authService.logout(response, user);
  }
}
