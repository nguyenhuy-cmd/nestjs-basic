import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

// Tác dụng của decorator này là để đánh dấu cho controller biết rằng controller này không cần phải check quyền
// Tức là controller này có thể truy cập công khai và không cần token
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';
// Tạo một decorator để truyền message vào metadata của handler (controller method)
export const ResponseMessage = (message: string) =>
      SetMetadata(RESPONSE_MESSAGE, message);

// Tạo một decorator để lấy thông tin user từ request
// Tương tự như @Req() nhưng ngắn gọn hơn
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);