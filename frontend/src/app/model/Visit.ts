import { Sex } from "./enum/Sex";
import { VisitType } from "./enum/VisitType";
import { SingleDayAvailability } from "./SingleDayAvailability";

export interface Visit extends SingleDayAvailability {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    sex: Sex;
    type: VisitType;
    details: string;
}