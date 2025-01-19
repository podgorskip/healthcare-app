import { Observable } from 'rxjs';
import { User } from '../../model/User';

export interface UserRepositoryInterface {
  getUsers(): Observable<User[]>;
  
  toggleUserBan(id: string): Observable<any>;
}
