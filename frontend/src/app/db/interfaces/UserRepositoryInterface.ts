import { ScheduledVisit } from '../../model/ScheduledVisit';
import { User } from '../../model/User';

export interface UserRepositoryInterface {
  getScheduledVisits(userId: string): Promise<string[]>;
  listenToScheduledVisitUpdates(userId: string, callback: (visits: string[]) => void): void;
  addScheduledVisit(userId: string, visitId: string): Promise<void>;
  removeScheduledVisit(userId: string, visitId: string): Promise<void>;
  addUser(user: User): Promise<any>;
  removeFromCart(userId: string, visitId: string): Promise<void>;
  addToCart(userId: string, visit: ScheduledVisit): Promise<any>;
  listenToCartUpdates(userId: string, callback: (visits: ScheduledVisit[]) => void): void;
}
