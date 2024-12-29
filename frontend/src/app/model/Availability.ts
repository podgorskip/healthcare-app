import { TimeSlot } from "./TimeSlot";

export interface Availability {
    id: number;
    date: Date;
    slots: TimeSlot[];
}