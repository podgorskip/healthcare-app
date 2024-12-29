import { Component, EventEmitter, Output } from '@angular/core';
import { TimeSlot } from '../../../model/TimeSlot';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SingleDayAvailability } from '../../../model/SingleDayAvailability';
import { DateUtils } from '../../../utils/DateUtils';

@Component({
  selector: 'app-single-slot',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './single-slot.component.html',
  styleUrls: ['./single-slot.component.css']
})
export class SingleSlotComponent {
  @Output() timeSlotsChange = new EventEmitter<SingleDayAvailability>();

  timeSlots: TimeSlot[] = [];
  date: string = '';
  from: string = '';
  to: string = '';

  getHours = (): TimeSlot[] => {
    return this.timeSlots;
  }

  addHour = (): void => {
    if (!this.from || !this.to) {
      alert('Hours cannot be empty');
      return;
    }

    const newFrom = this.parseTime(this.from);
    const newTo = this.parseTime(this.to);

    if (newFrom >= newTo) {
      alert('Start time must be earlier than end time');
      return;
    }

    if (this.isOverlapping(newFrom, newTo)) {
      alert('The time slot overlaps with an existing one');
      return;
    }

    this.timeSlots.push({
      id: this.timeSlots.length + 1,
      from: this.from,
      to: this.to,
    });

    this.from = '';
    this.to = '';

    this.timeSlotsChange.emit({
      "date": this.date,
      "slots": this.timeSlots
    });
  }

  clearForm = (): void => {
    this.date = '';
    this.from = '';
    this.to = '';
  }

  removeHour = (id: number): void => {
    this.timeSlots = this.timeSlots.filter(slot => slot.id !== id);
    this.timeSlotsChange.emit({
      "date": this.date,
      "slots": this.timeSlots
    });
  }

  getMinDate(): string {
   return DateUtils.minDate();
  }

  private isOverlapping(from: number, to: number): boolean {
    for (const slot of this.timeSlots) {
      const existingFrom = this.parseTime(slot.from);
      const existingTo = this.parseTime(slot.to);
  
      if (
        (from >= existingFrom && from < existingTo) || 
        (to > existingFrom && to <= existingTo) ||
        (from <= existingFrom && to >= existingTo) 
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
