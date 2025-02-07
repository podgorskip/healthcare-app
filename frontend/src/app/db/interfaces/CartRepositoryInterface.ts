import { Observable } from "rxjs";
import { Item } from "../../model/Item";
import { Cart } from "../../model/Cart";

export interface CartRepositoryInterface {
    addItem(id: string, item: Item): Observable<Cart>;
    
    removeItem(id: string): Observable<any>;

    getCart(id: string): Observable<Item[]>;

    startListeningCartUpdate(id: string): Observable<Item[]>;
}