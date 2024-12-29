import { SingleDayAvailability } from "./SingleDayAvailability";

export interface PresenceAbsenceData extends SingleDayAvailability {
    type: 'presence' | 'absence';
}