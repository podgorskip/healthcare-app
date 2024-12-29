import { AvailabilityService } from './../../../services/availability/availability.service';
import { SingleDayAvailability } from './../../../model/SingleDayAvailability';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SingleSlotComponent } from '../single-slot/single-slot.component';
import { CircularSlotsComponent } from '../circular-slots/circular-slots.component';
import { CircularAvailability } from '../../../model/CircularAvailability';
import { Router } from '@angular/router';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, HttpClientModule, SingleSlotComponent, CircularSlotsComponent],
  providers: [AvailabilityService],
  animations: [
    trigger('sectionAnimation', [
      transition(':enter', [
        style({'opacity': 0, 'height': 0}),
        animate('1s ease-out', style({'height': 300, 'opacity': 1}))
      ]),
      transition('leave', [
        style({'opacity': 1, 'height': 300}),
        animate('1s ease-int', style({'height': 0, 'opacity': 0}))
      ])])
  ],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css'
})
export class AvailabilityComponent {
  selectedType: 'presence' | 'absence' | '' = '';
  selectedDateRangeType: string = '';
  singleDayAvailability: SingleDayAvailability = {'date': '', 'slots': []};
  circularAvailability: CircularAvailability = {
    dateRanges: [],
    hourRanges: [],
    weekdays: []
  }
  selectedDay: Date = new Date();

  constructor(
    private availabilityService: AvailabilityService,
    private router: Router
  ) { }

  onTypeChange = () => {
    console.log(this.selectedType);
  }

  onDateRangeChange = () => {
    console.log(this.selectedDateRangeType);
  }

  sectionStyle = (value: string): any => {
    return {
      'color': value ? 'black' : 'rgb(190, 190, 190)',
    };
  };

  sectionBorderStyle = (value: string): any => {
    return {
      'border': value ? '1px solid rgb(45, 45, 45)' : '1px solid rgb(190, 190, 190)',
      'color': value ? 'rgb(45, 45, 45)' : 'rgb(190, 190, 190)'
    };
  };

  handleSingleAvailabilityChange(singleDay: SingleDayAvailability): void {
    this.singleDayAvailability = singleDay;
  }

  submitSingleDayAvailability = (): void => {
    this.availabilityService.addAvailability([this.singleDayAvailability], this.selectedType);
    this.router.navigate(['/calendar/false']);
  }

  handleCircularAvailabilityChange = (circular: CircularAvailability): void => {
    this.circularAvailability = circular;
  }

  submitCircularAvailability = (): void => {
    let single: SingleDayAvailability[] = this.transformCircularAvailability(this.circularAvailability);
    this.availabilityService.addAvailability(single, this.selectedType);
    this.router.navigate(['/calendar/false']);
  }

  transformCircularAvailability(circularAvailability: CircularAvailability): SingleDayAvailability[] {
    const singleDayAvailabilities: SingleDayAvailability[] = [];
    
    if (!circularAvailability.dateRanges || circularAvailability.dateRanges.length === 0) {
        console.error('No date ranges available');
        return singleDayAvailabilities;
    }

    circularAvailability.dateRanges.forEach(dateRange => {
        let currentDate = new Date(dateRange.from);
        
        while (currentDate <= dateRange.to) {
            const dayName = currentDate.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();

            if (circularAvailability.weekdays.map(w => w.toLowerCase()).includes(dayName.toLowerCase())) {
                const singleDayAvailability: SingleDayAvailability = {
                    date: currentDate.toISOString().split('T')[0],
                    slots: [...circularAvailability.hourRanges] 
                };
                singleDayAvailabilities.push(singleDayAvailability);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return singleDayAvailabilities;
  }

}
