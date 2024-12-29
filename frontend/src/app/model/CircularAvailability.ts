import { DateRange } from "./DateRange";
import { TimeSlot } from "./TimeSlot";

export interface CircularAvailability {
    weekdays: string[];
    dateRanges: DateRange[];
    hourRanges: TimeSlot[];
}