import { Sex } from "./enum/Sex";
import { ScheduledVisit } from "./ScheduledVisit";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    sex: Sex;
    age: number;
    scheduledVisits: string[];
}