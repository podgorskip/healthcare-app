import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DateUtils } from '../../utils/DateUtils';
import { SingleDayAvailability } from '../../model/SingleDayAvailability';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ScheduledVisit } from '../../model/ScheduledVisit';
import { HttpClientModule } from '@angular/common/http';
import { DoctorService } from '../../services/doctor/doctor.service';
import { VisitService } from '../../services/visit/visit.service';
import { Doctor } from '../../model/Doctor';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, HttpClientModule],
  providers: [DoctorService, VisitService],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  @Input() shouldSchedule: string = '';
  @Input() doctor!: Doctor;

  @Output() dateSelected: EventEmitter<{day: Date, hour: number}[]> = new EventEmitter<{day: Date, hour: number}[]>();

  private currentWeek: Date[] = [];
  private hours = Array.from({ length: 48 }, (_, i) => i * 0.5);
  private startHour = this.getCurrentHour();

  private presence: SingleDayAvailability[] = [];
  private absence: SingleDayAvailability[] = [];

  private currentWeekPresence: SingleDayAvailability[] = [];
  private currentWeekAbsence: SingleDayAvailability[] = [];

  private selectedSlots: { day: Date, hour: number }[] = []; 

  private refreshInterval: any;
  
  visits: ScheduledVisit[] = [];
  slotInfoCache: Map<string, { className: string, canSchedule: boolean, visit?: ScheduledVisit }> = new Map();
  currentHoveredSlot: { day: Date, hour: number } | null = null;
  visitDetails?: ScheduledVisit;
  showDetails: boolean = false;

  getSlotInfo = (day: Date, hour: number): { className: string, canSchedule: boolean, visit?: ScheduledVisit } => {
    const key = `${day.toISOString()}-${hour}`;
    return this.slotInfoCache.get(key) || { className: '', canSchedule: false };
  }
  
  formatDate = (date: Date) => {
    return DateUtils.formatDayMonth(date);
  }

  formatHour = (hour: number): string => {
    return DateUtils.formatHour(hour);
  };

  constructor(
    private doctorService: DoctorService, 
    private route: ActivatedRoute,
    private visitService: VisitService,
    private cd: ChangeDetectorRef
  ) {
    this.currentWeek = DateUtils.getFollowingDays(new Date());
  }

  get getHours(): number[] {
    return this.hours; 
  }

  get getCurrentWeek(): Date[] {
    return this.currentWeek;
  }

  dayNames = (): string[] => {
    return DateUtils.getDayNames();
  };

  ngOnInit(): void {
    this.refreshInterval = setInterval(() => {
      this.cd.detectChanges();
    }, 5000);

    if (!this.shouldSchedule) {
      this.shouldSchedule = this.route.snapshot.params['schedule'] || '';
      const doctorId = this.route.snapshot.params['id'];
      this.doctorService.getDoctor(doctorId).subscribe({
        next: (doctor) => {
          this.doctor = doctor;

          const startOfWeek = new Date(this.currentWeek[0]);
          const endOfWeek = new Date(this.currentWeek[this.currentWeek.length - 1]);
      
          this.doctorService.getAvailability(this.doctor.id, 'PRESENCE').subscribe({
            next: (presence) => {
              this.doctor.presence = presence || [];
              this.currentWeekPresence = this.filterByDateRange(presence, startOfWeek, endOfWeek);
              console.log('Filtered presence:', this.currentWeekPresence);
            }
          })
      
          this.doctorService.getAvailability(this.doctor.id, 'ABSENCE').subscribe({
            next: (absence) => {
              this.doctor.absence = absence || [];
              this.currentWeekAbsence = this.filterByDateRange(absence, startOfWeek, endOfWeek);
              console.log('Filtered presence:', this.currentWeekPresence);
            }
          })
      
          this.visitService.getDoctorVisits(this.doctor.id).subscribe({
            next: (visits) => {
              this.visits = visits || [];
              console.log('Scheduled visits:', this.visits);
            }
          })
      
          this.cacheTooltips();
        }
      });
    }
  }
  
  private filterByDateRange(data: SingleDayAvailability[], startDate: Date, endDate: Date): SingleDayAvailability[] {
  
    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
  
    return data.filter(item => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0); 
  
      return itemDate >= startOfDay && itemDate <= endOfDay;
    });
  }
  
  ngAfterViewInit(): void {
    const currentHourIndex = this.hours.findIndex((hour) => hour >= this.startHour);
    const scrollPosition = currentHourIndex * 100; 
    this.scrollContainer.nativeElement.scrollLeft = scrollPosition;
  }

  private updateWeek(delta: number): void {
    const newWeekStart = new Date(this.currentWeek[0]);
    newWeekStart.setDate(newWeekStart.getDate() + delta);
    this.currentWeek = DateUtils.getFollowingDays(newWeekStart);

    console.log('Updated week: ', this.currentWeek);
  
    const startOfWeek = new Date(this.currentWeek[0]);
    const endOfWeek = new Date(this.currentWeek[this.currentWeek.length - 1]);
  
    this.currentWeekPresence = this.filterByDateRange(this.presence, startOfWeek, endOfWeek);
    this.currentWeekAbsence = this.filterByDateRange(this.absence, startOfWeek, endOfWeek);

    this.cacheTooltips();
  }
  
  goToPreviousWeek(): void {
    this.updateWeek(-7);
  }
  
  goToNextWeek(): void {
    this.updateWeek(7);
  }
  
  shouldScheduleCheck = (day: Date, hour: number): boolean => {
    const now = new Date();

    const targetHour = Math.floor(hour);
    const targetMinutes = (hour % 1) * 60;

    const targetDate = new Date(day);
    targetDate.setHours(targetHour, targetMinutes, 0, 0);

    return this.shouldSchedule === 'true' && targetDate > now;
  };

  getShouldSchedule = (): boolean => {
    return this.shouldSchedule === 'true';
  }

  selectSlot(day: Date, hour: number): void {
    if (!this.shouldScheduleCheck(day, hour)) return;

    const slotInfo = this.getSlotInfo(day, hour);

    if (!slotInfo.canSchedule) {
        return;
    }

    if (slotInfo.className === 'absence') {
      alert('Cannot schedule visit, doctor is absent.');
      return;
    }

    const slotIndex = this.selectedSlots.findIndex(
      slot => slot.day.getTime() === day.getTime() && slot.hour === hour
    );
  
    if (slotIndex !== -1) {
      this.selectedSlots.splice(slotIndex, 1);  
      this.validateSelectedSlots(); 
      return;
    }
  
    if (this.selectedSlots.length > 0) {
      const lastSelectedSlot = this.selectedSlots[this.selectedSlots.length - 1];
      const isSameDay = lastSelectedSlot.day.getTime() === day.getTime();
  
      const isAdjacent = Math.abs(lastSelectedSlot.hour - hour) === 0.5;
  
      if (!isSameDay || !isAdjacent) {
        alert('Slots must be adjacent and on the same day.');
        return;
      }
    }
  
    this.selectedSlots.push({ day, hour });
    this.validateSelectedSlots();  
  }
  
  validateSelectedSlots(): void {
    this.selectedSlots.sort((a, b) => {
      if (a.day.getTime() === b.day.getTime()) {
        return a.hour - b.hour;
      }
      return a.day.getTime() - b.day.getTime();
    });
  
    for (let i = 1; i < this.selectedSlots.length; i++) {
      const prevSlot = this.selectedSlots[i - 1];
      const currentSlot = this.selectedSlots[i];
  
      const isSameDay = prevSlot.day.getTime() === currentSlot.day.getTime();
      const isAdjacent = Math.abs(prevSlot.hour - currentSlot.hour) === 0.5;
  
      if (!isSameDay || !isAdjacent) {
        this.selectedSlots.pop();
        alert('Slots must be adjacent and on the same day.');
        break;
      }
    }
  }

  getHeaderClasses(day: Date): { [key: string]: boolean } {
    return {
      'cell': true,
      'today': this.isSameDay(day, new Date())
    }
  };

  getClasses(day: Date, hour: number): { [key: string]: boolean } {
    const slotInfo = this.getSlotInfo(day, hour); 
  
    return {
      [slotInfo.className]: true, 
      'selected': slotInfo.canSchedule && this.isSelected(day, hour) 
    };
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }
  
  confirmSelection = (): void => {
    if (this.selectedSlots) {
      this.dateSelected.emit(this.selectedSlots); 
    }
    this.selectedSlots = [];
  }

  getCurrentTimePosition(): number {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInHours = currentHours + currentMinutes / 60;

    const percentage = (currentTimeInHours / 24) * 100 + 0.3;
    return percentage;
  }

  isToday(day: Date): boolean {
    const today = new Date();
    return (
      day.getFullYear() === today.getFullYear() &&
      day.getMonth() === today.getMonth() &&
      day.getDate() === today.getDate()
    );
  }

  onMouseEnter(day: Date, hour: number): void {
    this.currentHoveredSlot = { day, hour };
    this.visitDetails = this.getSlotInfo(day, hour).visit;

    if (this.currentHoveredSlot?.day.getTime() === day.getTime() && this.currentHoveredSlot?.hour === hour && this.getSlotInfo(day, hour).visit && !this.getShouldSchedule()) {
      this.showDetails = true;
    }
  }
  
  onMouseLeave(): void {
    this.currentHoveredSlot = null;
    this.showDetails = false;
  }  

  private cacheTooltips(): void {
    this.slotInfoCache = new Map();

    this.getCurrentWeek.forEach((day) => {
      this.getHours.forEach((hour) => {
        const key = `${day.toISOString()}-${hour}`;
        this.slotInfoCache.set(key, this.retrieveSlotInfo(day, hour))
      });
    });
  }

  private isSelected = (day: Date, hour: number): boolean => {
    return this.selectedSlots.filter(s => s.day === day).some(s => s.hour === hour);
  }

  private retrieveSlotInfo(day: Date, hour: number): { className: string, canSchedule: boolean, visit?: ScheduledVisit } {
    if (this.isAbsent(day, hour)) {
      return { className: 'absence', canSchedule: false };
    } 

    let isScheduled: { isVisit: boolean, visit?: ScheduledVisit} = this.isScheduled(day, hour);
    
    if (isScheduled.isVisit) {
      const now = new Date();
    
      const isPastDay = day.getFullYear() < now.getFullYear() ||
        (day.getFullYear() === now.getFullYear() && day.getMonth() < now.getMonth()) ||
        (day.getFullYear() === now.getFullYear() && day.getMonth() === now.getMonth() && day.getDate() < now.getDate());
    
      const isPastHour = day.getFullYear() === now.getFullYear() &&
        day.getMonth() === now.getMonth() &&
        day.getDate() === now.getDate() &&
        (hour + 0.5) < now.getHours() + now.getMinutes() / 60;
    
      if (isPastDay || isPastHour) {
        return { className: 'past-scheduled', canSchedule: false, visit: isScheduled.visit };
      }
    
      return { className: 'scheduled', canSchedule: false, visit: isScheduled.visit };
    }
    
    if (this.isPresent(day, hour)) {
      const schedule: boolean = this.shouldScheduleCheck(day, hour);

      if (schedule) {
        return { className: 'presence', canSchedule: schedule};
      } else {
        return { className: 'presence-no-schedule', canSchedule: schedule};
      }
    }

    return { className: '', canSchedule: false };
  }

  private isAbsent = (day: Date, hour: number): boolean => {
    const formattedDate = day.toISOString().split('T')[0]; 
    return this.currentWeekAbsence?.some((entry) =>
      entry?.date === formattedDate &&
      entry?.slots?.some((slot) => this.isTimeInSlotAbsent(hour, slot))
    );
  };

  private isPresent = (day: Date, hour: number): boolean => {
    const formattedDate = day.toISOString().split('T')[0]; 
    return this.currentWeekPresence.some((entry) => {
      return entry.date === formattedDate &&
      entry.slots.some((slot) => this.isTimeInSlotPresent(hour, slot))
    });
  };

  private isScheduled = (day: Date, hour: number): { isVisit: boolean, visit?: ScheduledVisit } => {
    for (const visit of this.visits) {
      for (const visitDate of visit.date) {
        const isSameDate = visitDate.day.toISOString().split('T')[0] === day.toISOString().split('T')[0];
        const isSameHour = visitDate.hour === hour;
  
        if (isSameDate && isSameHour) {
          return { isVisit: true, visit };
        }
      }
    }
  
    return { isVisit: false };
  };
  
  private isTimeInSlotPresent = (hour: number, slot: { from: string; to: string }): boolean => {
    const slotStart = parseInt(slot.from.split(':')[0], 10);
    const slotEnd = parseInt(slot.to.split(':')[0], 10);
    return hour > slotStart && hour <= slotEnd; 
  };

  private isTimeInSlotAbsent = (hour: number, slot: { from: string; to: string }): boolean => {
    const slotStart = parseInt(slot.from.split(':')[0], 10);
    const slotEnd = parseInt(slot.to.split(':')[0], 10);
    return hour >= slotStart && hour < slotEnd; 
  };

  private getCurrentHour(): number {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    return minutes >= 30 ? hour + 0.5 : hour;
  }
}
