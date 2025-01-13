import { SingleDayAvailability } from "./SingleDayAvailability";
import { User } from "./User";

export interface Doctor {
    id: string;
    phoneNo?: string;
    user: User;
    presence: SingleDayAvailability[];
    absence: SingleDayAvailability[];
}