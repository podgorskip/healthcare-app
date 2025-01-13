import { Doctor } from "./Doctor";
import { Sex } from "./enum/Sex";
import { VisitType } from "./enum/VisitType";
import { Patient } from "./Patient";

export interface ScheduledVisit {
    id: string;
    date: { day: Date, hour: number }[];
    type: VisitType | null;
    firstName: string;
    lastName: string;
    username: string;
    sex: Sex;
    age: number;
    details: string;
    price: number;
    cancelled: boolean;
    doctor?: Doctor;
    patient?: Patient;
}