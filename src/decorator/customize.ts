import { SetMetadata } from "@nestjs/common";

// Tác dụng của decorator này là để đánh dấu cho controller biết rằng controller này không cần phải check quyền
// Tức là controller này có thể truy cập công khai và không cần token
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);