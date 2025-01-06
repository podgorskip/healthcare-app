import { SingleDayAvailability } from '../../model/SingleDayAvailability';

export interface AvailabilityRepositoryInterface {
  getAvailability(type: string): Promise<SingleDayAvailability[]>;
  addAvailability(availabilities: SingleDayAvailability[], type: string): Promise<any>;
  listenToAvailability(type: string, callback: (visits: SingleDayAvailability[]) => void): void;
}
