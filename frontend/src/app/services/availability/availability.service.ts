import { SingleDayAvailability } from './../../model/SingleDayAvailability';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AvailabilityRepositoryInterface } from '../../db/interfaces/AvailabilityRepositoryInterface';
import { AvailabilityRepositoryFactory } from '../../db/factories/AvailabilityRepositoryFactory';
import { ScheduledVisitService } from '../scheduled-visit/scheduled-visit.service';
import { ScheduledVisit } from '../../model/ScheduledVisit';
import { TimeSlot } from '../../model/TimeSlot';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private availabilityRepository: AvailabilityRepositoryInterface;
  private presenceSubject = new BehaviorSubject<SingleDayAvailability[]>([]);
  private absenceSubject = new BehaviorSubject<SingleDayAvailability[]>([]);

  public presence$ = this.presenceSubject.asObservable(); 
  public absence$ = this.absenceSubject.asObservable(); 

  constructor(
    availabilityRepository: AvailabilityRepositoryFactory,
    private scheduledVisitService: ScheduledVisitService
  ) { 
    this.availabilityRepository = availabilityRepository.getRepository();
  }

  startListeningToAvailability = () => {
    this.availabilityRepository.listenToAvailability('presence', (presence: SingleDayAvailability[]) => {
      this.presenceSubject.next(presence);
    });

    this.availabilityRepository.listenToAvailability('absence', (absence: SingleDayAvailability[]) => {
      this.absenceSubject.next(absence);
    });
  }

  getFollowingDays = (date: Date): Date[] => {
    const weekDates: Date[] = [];

    for (let i = 0; i < 7; i++) {
        const weekDate = new Date(date); 
        weekDate.setDate(date.getDate() + i);
        weekDates.push(weekDate);
    }

    return weekDates;
  };

  getDayNames = (): string[] => {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  } 

  generateRange = (start: number, end: number, step: number): number[] => {
    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(parseFloat(i.toFixed(1)));
    }
    return result;
  }

  addAvailability = (availabilities: SingleDayAvailability[], type: 'presence' | 'absence' | '') => {
    this.checkForVisits(availabilities, type);
  };

  private checkForVisits = (availabilities: SingleDayAvailability[], type: string): void => {
    if (type === 'absence') {
      this.scheduledVisitService.startListeningToScheduledVisits();
      this.scheduledVisitService.scheduledVisits$.subscribe({
        next: (visits: ScheduledVisit[]) => {
          console.log(visits)
          this.checkAndAddAbsence(availabilities, visits, type);
        }
      });
    } else {
      this.checkAndAddPresence(availabilities, type);
    }
  };

  private checkAndAddAbsence = (availabilities: SingleDayAvailability[], visits: ScheduledVisit[], type: string) => {
    this.availabilityRepository.getAvailability(type).then((existingAvailability: any[]) => {
      let updatedAvailability = [...existingAvailability];
      let conflictingVisitsLog: any[] = [];
  
      availabilities.forEach((avail) => {
        const existingDay = updatedAvailability.find((day) => day.date === avail.date);
  
        if (existingDay) {
          const newSlots = avail.slots.filter((newSlot) => {
            return !existingDay.slots.some((existingSlot: TimeSlot) => this.isSlotEqual(existingSlot, newSlot));
          });
  
          if (newSlots.length > 0) {
            existingDay.slots.push(...newSlots);
          }
        } else {
          updatedAvailability.push({ date: avail.date, slots: avail.slots });
        }
  
        const conflictingVisits = this.checkConflictingVisits(avail.date, avail.slots, visits);
  
        if (conflictingVisits.length > 0) {
          conflictingVisitsLog.push({ date: avail.date, slots: avail.slots, conflictingVisits });
          console.log('Conflicts detected with the following visits:', conflictingVisitsLog);
  
          this.cancelConflictingVisits(conflictingVisits).then(() => {
            this.availabilityRepository.addAvailability(updatedAvailability, type)
              .then(() => {
                console.log('Availability successfully added');
              })
              .catch((error) => {
                console.error('Error updating availability:', error);
              });
          });
        }
      });
    });
  };

  private isSlotEqual(slot1: TimeSlot, slot2: TimeSlot): boolean {
    return slot1.from === slot2.from && slot1.to === slot2.to;
  }
  
  
  private checkConflictingVisits(date: string, slots: TimeSlot[], visits: ScheduledVisit[]): ScheduledVisit[] {
    const conflictingVisits: ScheduledVisit[] = [];
    console.log(`Checking conflicts for date: ${date} with slots:`, slots);
  
    visits.forEach((visit) => {
      console.log(`Analyzing visit:`, visit);
  
      visit.date.forEach((visitDate) => {
        const visitDateString = visitDate.day.toISOString().split('T')[0];
        console.log(`Comparing visit date ${visitDateString} with availability date ${date}`);
  
        if (visitDateString === date) { // Match date
          slots.forEach((slot) => {
            const slotStart = this.convertTimeToDecimal(slot.from);
            const slotEnd = this.convertTimeToDecimal(slot.to);
            console.log(`Checking slot from ${slot.from} (${slotStart}) to ${slot.to} (${slotEnd}) against visit hour ${visitDate.hour}`);
  
            if (visitDate.hour >= slotStart && visitDate.hour < slotEnd) { // Check overlap
              console.log(`Conflict detected: Visit overlaps with slot.`);
              conflictingVisits.push(visit);
            }
          });
        }
      });
    });
  
    console.log(`Conflicting visits for date ${date}:`, conflictingVisits);
    return conflictingVisits;
  }
  
  private convertTimeToDecimal(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }
  
  async cancelConflictingVisits(conflictingVisits: ScheduledVisit[]): Promise<void> {
    try {
      const updatePromises = conflictingVisits.map(async (visit) => {
        visit.cancelled = true; 
        await this.scheduledVisitService.updateVisit(visit); 
        console.log(`Successfully cancelled visit, id=${visit.id}`);
      });
  
      await Promise.all(updatePromises); 
      console.log('All conflicting visits cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel one or more visits', err);
      throw err; 
    }
  }

  private checkAndAddPresence = (availabilities: SingleDayAvailability[], type: string) => {
    this.availabilityRepository.getAvailability(type).then((existingAvailability: any[]) => {
      let notAdded: any[] = [];
      let updatedAvailability = [...existingAvailability];

      availabilities.forEach((avail) => {
        const existingDay = updatedAvailability.find((day) => day.date === avail.date);

        if (existingDay) {
          const overlappingSlots = this.checkOverlappingSlots(existingDay.slots, avail.slots);
          if (overlappingSlots.length === 0) {
            existingDay.slots.push(...avail.slots);  
          } else {
            notAdded.push({ date: avail.date, slots: overlappingSlots });
          }
        } else {
          updatedAvailability.push({ date: avail.date, slots: avail.slots }); 
        }
      });

      this.availabilityRepository.addAvailability(updatedAvailability, type)
        .then(() => {
          if (notAdded.length > 0) {
            console.log('These availability slots were not added due to overlap:', notAdded);
          } else {
            console.log('Availability successfully added');
          }
        })
        .catch((error) => {
          console.error('Error updating availability:', error);
        });
    });
  }

  private checkOverlappingSlots(existingSlots: any[], newSlots: any[]): any[] {
    const overlapping: any[] = [];
    newSlots.forEach((newSlot) => {
      existingSlots.forEach((existingSlot) => {
        if (this.isOverlapping(newSlot, existingSlot)) {
          overlapping.push(newSlot);
        }
      });
    });
    return overlapping;
  }

  private isOverlapping(slot1: any, slot2: any): boolean {
    const start1 = this.parseTime(slot1.from);
    const end1 = this.parseTime(slot1.to);
    const start2 = this.parseTime(slot2.from);
    const end2 = this.parseTime(slot2.to);

    return start1 < end2 && end1 > start2;
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
