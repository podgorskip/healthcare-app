import { User } from "./User";

export interface Comment {
    id: string;
    comment: string;
    user: User;
    date: Date
}