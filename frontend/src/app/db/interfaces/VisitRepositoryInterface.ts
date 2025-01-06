import { ScheduledVisit } from '../../model/ScheduledVisit';

export interface VisitRepositoryInterface {
  listenToScheduledVisitUpdates(callback: (visits: ScheduledVisit[]) => void): void;
  removeScheduledVisit(id: string): Promise<void>;
  addScheduledVisit(visit: ScheduledVisit): Promise<string>;
  getScheduledVisitById(id: string): Promise<ScheduledVisit>;
  updateVisit(visit: ScheduledVisit): Promise<void>;
}
