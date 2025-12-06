import { Document } from "mongoose";

export interface User extends Document {
  id: string;
  userName: string;
  hashPassword: string;
}
