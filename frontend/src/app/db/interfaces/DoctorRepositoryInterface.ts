import { Observable } from "rxjs";
import { Doctor } from "../../model/Doctor";
import { ScheduledVisit } from "../../model/ScheduledVisit";
import { SingleDayAvailability } from "../../model/SingleDayAvailability";

export interface DoctorRepositoryInterface {
    addDoctor(doctor: Doctor): Observable<any>;
    
    getDoctors(): Observable<Doctor[]>;

    getDoctorById(id: string): Observable<Doctor>;

    removeDoctor(id: string): Observable<any>;

    getDoctorVisits(id: string): Observable<ScheduledVisit[]>;

    getDoctorAvailability(id: string, type: string): Observable<SingleDayAvailability[]>;

    addDoctorAvailability(id: string, availabilities: SingleDayAvailability[], type: string): Observable<any>;

    startListeningAvailabilityChange(id: string, type: string): Observable<SingleDayAvailability[]>;

    startListeningVisitChange(id: string): Observable<ScheduledVisit[]>;
}