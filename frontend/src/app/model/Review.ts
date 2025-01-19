import { ScheduledVisit } from "./ScheduledVisit";
import { Comment } from "./Comment";

export interface Review {
    id: string;
    score: number;
    comment: string;
    visit: ScheduledVisit;
    date: Date;
    comments?: Comment[];
}