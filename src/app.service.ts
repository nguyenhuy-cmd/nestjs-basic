import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {

    // sau này  chúng ta phải model: code
    return 'Hỏi Huy nhé!';
  }
}
