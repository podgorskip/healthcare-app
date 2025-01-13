import { ScheduledVisit } from "./ScheduledVisit";

export interface Review {
    id: string;
    score: number;
    comment: string;
    visit: ScheduledVisit;
    date: Date;
}