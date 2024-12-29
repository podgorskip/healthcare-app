import { TimeSlot } from "./TimeSlot";

export interface SingleDayAvailability {
    date: string;
    slots: TimeSlot[];
}