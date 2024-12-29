import { VisitType } from "./enum/VisitType";

export interface ScheduledVisit {
    id: string;
    date: { day: Date, hour: number }[];
    type: VisitType | null;
    details: string;
    price: number
}