import { Types } from "mongoose";

// tạo interface để trả về trong hàm login
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
}