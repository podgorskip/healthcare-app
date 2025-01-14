import { Observable } from "rxjs";
import { Item } from "../../model/Item";
import { Cart } from "../../model/Cart";

export interface CartRepositoryInterface {
    addItem(id: string, item: Item): Observable<Cart>;
    
    removeItem(id: string): Observable<Cart>;

    getCart(id: string): Observable<Cart>;
}