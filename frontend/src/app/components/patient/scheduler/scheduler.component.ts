import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalendarComponent } from '../../calendar/calendar.component';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Sex } from '../../../model/enum/Sex';
import { VisitType } from '../../../model/enum/VisitType';
import { DateUtils } from '../../../utils/DateUtils';
import { AuthenticationService } from '../../../authentication/auth-service/authentication.service';
import { CartService } from '../../../services/cart/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { Item } from '../../../model/Item';
import { Doctor } from '../../../model/Doctor';
import { Subject, takeUntil } from 'rxjs';
import { Patient } from '../../../model/Patient';
import { PatientService } from '../../../services/patient/patient.service';
import { DoctorService } from '../../../services/doctor/doctor.service';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  providers: [AuthenticationService, CartService, PatientService, DoctorService],
  imports: [CalendarComponent, NgIf, NgStyle, FormsModule, NgFor],
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.css'
})
export class SchedulerComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  
  sex: Sex[] = Object.values(Sex);
  availableVisitTypes: VisitType[] = Object.values(VisitType);

  isPopupOpen = false; 
  
  @Input() id: string | null = null;
  patient!: Patient;
  doctor!: Doctor;

  item: Item = {
    id: '',
    date: [],
    details: '',
    type: null,
    price: 0,
    firstName: '',
    lastName: '',
    username: '',
    sex: Sex.MALE,
    age: 0,
    doctor: this.doctor
  }

  constructor(
    private UserIdentityInfo: UserIdentityInfo, 
    private cartService: CartService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    this.UserIdentityInfo.authenticatedUser$.subscribe({
      next: (user) => {
        if (user) {
          this.patientService.getPatientById(user.id).subscribe({
            next: (patient) => {
              this.patient = patient
            }, 
            error: (e) => {
              console.log(e)
            }
          })
        }
      }
    })

    const id: string = this.route.snapshot.params['id'];

    console.log('Param id: ', id);

    if (id) {
      this.doctorService.getDoctor(id).subscribe({
        next: (doctor) => {
          console.log(`Successfully fetched doctor, id=${id}`)
          this.doctor = doctor;
          this.id = id;
        }
      })
    } 
  }

  openPopup() {
    this.isPopupOpen = true;
  }

  closePopup() {
    this.isPopupOpen = false;
  }

  handleDateSelection(date: { day: Date, hour: number }[]) {
    this.item.date = date;
    this.closePopup(); 
  }

  sectionStyle = (value: any[]): any => {
    return {
      'color': value.length ? 'black' : 'rgb(190, 190, 190)',
    };
  };

  sectionBorderStyle = (value: any[]): any => {
    return {
      'border': value.length ? '1px solid rgb(45, 45, 45)' : '1px solid rgb(190, 190, 190)',
      'color': value.length ? 'rgb(45, 45, 45)' : 'rgb(190, 190, 190)'
    };
  };

  formatDate = (date: Date) => {
    return DateUtils.formatDayMonth(date);
  }

  formatHour = (hour: number): string => {
    return DateUtils.formatHour(hour);
  };

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.item.doctor = this.doctor;
      console.log(this.item)
      this.cartService.addItem(this.patient.cart?.id, this.item).subscribe({
        next: (response) => {
          console.log(`Response: ${response}`);
          this.router.navigate(['/cart']);
        }
      })
    } else {
      console.log('Form is invalid');
    }
  }

  formatSelectedDays = (): string => {
    return DateUtils.formatSelectedDays(this.item.date);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
