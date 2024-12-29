import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { AvailabilityService } from '../../services/availability/availability.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DateUtils } from '../../utils/DateUtils';
import { SingleDayAvailability } from '../../model/SingleDayAvailability';
import { ActivatedRoute } from '@angular/router';
import { ScheduledVisitService } from '../../services/scheduled-visit/scheduled-visit.service';
import { ScheduledVisit } from '../../model/ScheduledVisit';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, HttpClientModule],
  providers: [AvailabilityService, ScheduledVisitService],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @Input() shouldSchedule: string = '';
  @Output() dateSelected: EventEmitter<{day: Date, hour: number}[]> = new EventEmitter<{day: Date, hour: number}[]>();

  private currentWeek: Date[] = [];
  private hours = Array.from({ length: 48 }, (_, i) => i * 0.5);
  private startHour = this.getCurrentHour();

  private presence: SingleDayAvailability[] = [];
  private absence: SingleDayAvailability[] = [];

  private currentWeekPresence: SingleDayAvailability[] = [];
  private currentWeekAbsence: SingleDayAvailability[] = [];

  private selectedSlots: { day: Date, hour: number }[] = []; 

  scheduledVisits: ScheduledVisit[] = [];
  
  formatDate = (date: Date) => {
    return DateUtils.formatDayMonth(date);
  }

  formatHour = (hour: number): string => {
    return DateUtils.formatHour(hour);
  };

  constructor(
    private availabilityService: AvailabilityService, 
    private route: ActivatedRoute,
    private scheduledVisitService: ScheduledVisitService
  ) {
    this.currentWeek = this.availabilityService.getFollowingDays(new Date());
  }

  get getHours(): number[] {
    return this.hours; 
  }

  get getCurrentWeek(): Date[] {
    return this.currentWeek;
  }

  dayNames = (): string[] => {
    return this.availabilityService.getDayNames();
  };

  ngOnInit(): void {
    this.availabilityService.load();

    this.availabilityService.presence$.subscribe({
      next: (presence) => {
        this.presence = presence;
        this.currentWeekPresence = this.presence.filter((p) => {
          const presenceDate = new Date(p.date);
          return presenceDate >= new Date(this.currentWeek[0]) && presenceDate <= new Date(this.currentWeek[this.currentWeek.length - 1]);
        });
      },
      error: (err) => console.log('Failed to fetch presence list: ', err),
    });
  
    this.availabilityService.absence$.subscribe({
      next: (absence) => {
        this.absence = absence;
        this.currentWeekAbsence = this.absence.filter((a) => {
          const absenceDate = new Date(a.date);
          return absenceDate >= new Date(this.currentWeek[0]) && absenceDate <= new Date(this.currentWeek[this.currentWeek.length - 1]);
        })
      },
      error: (err) => console.log('Failed to fetch absence list: ', err)
    });

    if (!this.shouldSchedule) {
      this.route.paramMap.subscribe(params => {
        this.shouldSchedule = params.get('month') || '';
      });
    }

    this.scheduledVisitService.scheduledVisits$.subscribe({
      next: (data) => {
        this.scheduledVisits = data;
        console.log('Scheduled visits in calendar: ', this.scheduledVisits);
      },
      error: (err) => console.log('Failed to fetch scheduled visits, ', err)
    });

    this.scheduledVisitService.startListeningToScheduledVisits();
  }

  ngAfterViewInit(): void {
    const currentHourIndex = this.hours.findIndex((hour) => hour >= this.startHour);
    const scrollPosition = currentHourIndex * 100; 
    this.scrollContainer.nativeElement.scrollLeft = scrollPosition;
  }

  goToPreviousWeek(): void {
    const previousWeekStart = new Date(this.currentWeek[0]);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    this.currentWeek = this.availabilityService.getFollowingDays(previousWeekStart);

    const firstDay = new Date(this.currentWeek[0]);
    const lastDay = new Date(this.currentWeek[this.currentWeek.length - 1]);

    this.currentWeekPresence = this.presence.filter((p) => {
      const presenceDate = new Date(p.date);
      return presenceDate >= firstDay && presenceDate <= lastDay;
    });

    this.currentWeekAbsence = this.absence.filter((a) => {
      const absenceDate = new Date(a.date);
      return absenceDate >= firstDay && absenceDate <= lastDay;
    })
  }

  goToNextWeek(): void {
    const nextWeekStart = new Date(this.currentWeek[0]);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    this.currentWeek = this.availabilityService.getFollowingDays(nextWeekStart);

    const firstDay = new Date(this.currentWeek[0]);
    const lastDay = new Date(this.currentWeek[this.currentWeek.length - 1]);

    this.currentWeekPresence = this.presence.filter((p) => {
      const presenceDate = new Date(p.date);
      return presenceDate >= firstDay && presenceDate <= lastDay;
    });

    this.currentWeekAbsence = this.absence.filter((a) => {
      const absenceDate = new Date(a.date);
      return absenceDate >= firstDay && absenceDate <= lastDay;
    })
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

    const slotStyle = this.getSlotStyle(day, hour);

    if (!slotStyle.canSchedule) {
        return;
    }

    if (this.isAbsent(day, hour)) {
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

  isSelected = (day: Date, hour: number): boolean => {
    return this.selectedSlots.filter(s => s.day === day).some(s => s.hour === hour);
  }

  getSlotStyle(day: Date, hour: number): { className: string, canSchedule: boolean } {
    if (this.isAbsent(day, hour - 0.5)) {
      return { className: 'absence', canSchedule: false };
    } else if (this.isScheduled(day, hour)) {
      return { className: 'scheduled', canSchedule: false };
    } else if (this.isPresent(day, hour - 0.5)) {
      return { className: 'presence', canSchedule: this.shouldScheduleCheck(day, hour - 0.5)};
    } else {
      return { className: '', canSchedule: false };
    }
  }

  getClasses(day: Date, hour: number): { [key: string]: boolean } {
    const slotStyle = this.getSlotStyle(day, hour); 
  
    return {
      [slotStyle.className]: true, 
      'selected': slotStyle.canSchedule && this.isSelected(day, hour), 
    };
  }
  
  confirmSelection = (): void => {
    if (this.selectedSlots) {
      this.dateSelected.emit(this.selectedSlots); 
    }
    this.selectedSlots = [];
  }

  private isAbsent = (day: Date, hour: number): boolean => {
    const formattedDate = day.toISOString().split('T')[0]; 
    return this.currentWeekAbsence?.some((entry) =>
      entry?.date === formattedDate &&
      entry?.slots?.some((slot) => this.isTimeInSlot(hour, slot))
    );
  };

  private isPresent = (day: Date, hour: number): boolean => {
    const formattedDate = day.toISOString().split('T')[0]; 
    return this.currentWeekPresence.some((entry) => {
      return entry.date === formattedDate &&
      entry.slots.some((slot) => this.isTimeInSlot(hour, slot))
    });
  };

  private isScheduled = (day: Date, hour: number): boolean => {
    return this.scheduledVisits.some((visit) => {
      return visit.date.some((visitDate) => {
        const formattedDate = visitDate.day.toISOString().split('T')[0];
        return formattedDate === day.toISOString().split('T')[0] && visitDate.hour === hour;
      });
    });
  };

  private isTimeInSlot = (hour: number, slot: { from: string; to: string }): boolean => {
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
