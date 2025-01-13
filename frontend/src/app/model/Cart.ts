import { Item } from "./Item";

export interface Cart {
    id: string;
    items?: Item[];
}