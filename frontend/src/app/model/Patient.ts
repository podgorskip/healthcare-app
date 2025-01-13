import { Cart } from "./Cart";
import { User } from "./User";

export interface Patient {
    id: string;
    user: User;
    cart: Cart;
}