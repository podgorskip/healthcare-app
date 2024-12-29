import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { AvailabilityService } from '../../../services/availability/availability.service';
import { DateRange } from '../../../model/DateRange';
import { TimeSlot } from '../../../model/TimeSlot';
import { FormsModule } from '@angular/forms';
import { CircularAvailability } from '../../../model/CircularAvailability';
import { DateUtils } from '../../../utils/DateUtils';

@Component({
  selector: 'app-circular-slots',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf],
  providers: [AvailabilityService],
  templateUrl: './circular-slots.component.html',
  styleUrl: './circular-slots.component.css'
})
export class CircularSlotsComponent {
  weekdays: string[] = [];
  selectedWeekdays: boolean[] = new Array(this.weekdays.length).fill(false);
  selectedWeekdaysNames: string[] = [];
  selectedDateRanges: DateRange[] = [];
  selectedHourRanges: TimeSlot[] = [];

  dateFrom: string = '';
  dateTo: string = '';
  hourFrom: string = '';
  hourTo: string = '';

  @Output() circularChange: EventEmitter<CircularAvailability> = new EventEmitter<CircularAvailability>();

  constructor(private availabilityService: AvailabilityService) {
    this.weekdays = this.weekDays();
  }

  addDateRange = () => {
    const newRange = {
      'id': this.selectedDateRanges.length + 1,
      'from': new Date(this.dateFrom),
      'to': new Date(this.dateTo)
    };

    if (!this.dateFrom || !this.dateTo) {
      alert('Dates cannot be empty.');
      return;
    }

    if (newRange.from > newRange.to) {
      alert('Date from must be before the date to.');
      return;
    }

    if (this.checkDateRangesIntersection(newRange)) {
      alert('The date range intersects with an existing one.');
      return;
    }
  
    this.selectedDateRanges.push(newRange);
    this.circularChange.emit({
      'weekdays': this.selectedWeekdaysNames,
      'dateRanges': this.selectedDateRanges,
      'hourRanges': this.selectedHourRanges
    });
  }

  dateRangeString = (from: Date, to: Date): string => {
    return DateUtils.formatDateRange(from, to);
  }

  removeDateRange = (id: number) => {
    this.selectedDateRanges = this.selectedDateRanges.filter(range => range.id != id);
  }

  getMinDate = (): string => {
    return DateUtils.minDate();
  }

  addHoursRange = () => {
    const hoursRange = {
      'id': this.selectedHourRanges.length + 1,
      'from': this.hourFrom,
      'to': this.hourTo
    };

    if (!this.hourFrom || !this.hourTo) {
      alert('Hours cannot be empty.');
      return;
    }

    if (this.parseTime(hoursRange.from) >= this.parseTime(hoursRange.to)) {
      alert('Hour from must be before the hour to.');
      return;
    }

    if (this.checkTimeRangesIntersection(hoursRange)) {
      alert('The time range intersects with an existing range.');
      return;
    }

    this.selectedHourRanges.push(hoursRange);
    this.circularChange.emit({
      'weekdays': this.selectedWeekdaysNames,
      'dateRanges': this.selectedDateRanges,
      'hourRanges': this.selectedHourRanges
    });
  }

  removeHoursRange = (id: number) => {
    this.selectedHourRanges = this.selectedHourRanges.filter(range => range.id != id);
  }

  weekdayChange = (): void => {
    this.selectedWeekdaysNames = this.getSelectedWeekdays();
    this.circularChange.emit({
      'weekdays': this.selectedWeekdaysNames,
      'dateRanges': this.selectedDateRanges,
      'hourRanges': this.selectedHourRanges
    });
  }

  getSelectedWeekdays(): string[] {
    return this.weekdays.filter((_, index) => this.selectedWeekdays[index]);
  }
  
  weekDays = (): string[] => {
    return this.availabilityService.getDayNames();
  }

  private checkDateRangesIntersection(newRange: { from: Date, to: Date }): boolean {
    for (const existingRange of this.selectedDateRanges) {
      const existingFrom = existingRange.from;
      const existingTo = existingRange.to;
  
      if (
        (newRange.from >= existingFrom && newRange.from < existingTo) ||
        (newRange.to > existingFrom && newRange.to <= existingTo) ||
        (newRange.from <= existingFrom && newRange.to >= existingTo)
      ) {
        return true; 
      }
    }
    return false;
  }

  private checkTimeRangesIntersection(newRange: { from: string, to: string }): boolean {
    const newFrom = this.parseTime(newRange.from);
    const newTo = this.parseTime(newRange.to);
  
    for (const existingRange of this.selectedHourRanges) {
      const existingFrom = this.parseTime(existingRange.from);
      const existingTo = this.parseTime(existingRange.to);
  
      if (
        (newFrom >= existingFrom && newFrom < existingTo) || 
        (newTo > existingFrom && newTo <= existingTo) ||    
        (newFrom <= existingFrom && newTo >= existingTo)    
      ) {
        return true; 
      }
    }
    return false;
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
