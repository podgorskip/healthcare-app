import { SingleDayAvailability } from './../../model/SingleDayAvailability';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AvailabilityRepositoryInterface } from '../../db/interfaces/AvailabilityRepositoryInterface';
import { AvailabilityRepositoryFactory } from '../../db/factories/AvailabilityRepositoryFactory';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private availabilityRepository: AvailabilityRepositoryInterface;
  private presenceSubject = new BehaviorSubject<SingleDayAvailability[]>([]);
  private absenceSubject = new BehaviorSubject<SingleDayAvailability[]>([]);

  public presence$ = this.presenceSubject.asObservable(); 
  public absence$ = this.absenceSubject.asObservable(); 

  constructor(availabilityRepository: AvailabilityRepositoryFactory) { 
    this.availabilityRepository = availabilityRepository.getRepository();
  }

  load = (): void => {
    this.availabilityRepository.getAvailability('presence')
      .then((presence: SingleDayAvailability[]) => {
        this.presenceSubject.next(presence);
      })
      .catch(error => {
        console.log('Error while fetching presence: ', error);
      })

      this.availabilityRepository.getAvailability('absence')
        .then((absence: SingleDayAvailability[]) => this.absenceSubject.next(absence))
        .catch(error => {
          console.log('Error while fetching absence: ', error);
        })
  };

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
    this.checkAndAddAvailability(availabilities, type);
  };

  private checkAndAddAvailability = (availabilities: SingleDayAvailability[], type: string): void => {
    this.availabilityRepository.addAvailability(availabilities, type)
        .then(() => {
          if ([].length > 0) {
            console.log('These availability slots were not added due to overlap:', []);
          } else {
            console.log('Availability successfully added');
          }
        })
        .catch((error) => {
          console.error('Error updating availability in Firebase:', error);
        });
    // this.availabilityRepository.getAvailability(type).then((existingAvailability: any[]) => {
    //   let notAdded: any[] = [];
    //   let updatedAvailability = [...existingAvailability];

    //   // availabilities.forEach((avail) => {
    //   //   const existingDay = updatedAvailability.find((day) => day.date === avail.date);

    //   //   if (existingDay) {
    //   //     const overlappingSlots = this.checkOverlappingSlots(existingDay.slots, avail.slots);
    //   //     if (overlappingSlots.length === 0) {
    //   //       existingDay.slots.push(...avail.slots);  // Add slots if no overlap
    //   //     } else {
    //   //       notAdded.push({ date: avail.date, slots: overlappingSlots });
    //   //     }
    //   //   } else {
    //   //     updatedAvailability.push({ date: avail.date, slots: avail.slots }); // Add new day if not already present
    //   //   }
    //   // });

    //   this.availabilityRepository.addAvailability(updatedAvailability, type)
    //     .then(() => {
    //       if (notAdded.length > 0) {
    //         console.log('These availability slots were not added due to overlap:', notAdded);
    //       } else {
    //         console.log('Availability successfully added');
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('Error updating availability in Firebase:', error);
    //     });
    // });
  };

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
