import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScheduledVisit } from '../../../model/ScheduledVisit';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../../model/User';
import { DateUtils } from '../../../utils/DateUtils';
import { HttpClientModule } from '@angular/common/http';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { PatientService } from '../../../services/patient/patient.service';
import { VisitService } from '../../../services/visit/visit.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule],
  providers: [PatientService, VisitService],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  
  visits: ScheduledVisit[] = [];
  cancelledVisits: ScheduledVisit[] = [];
  authenticatedUser!: User;

  constructor(
    private patientService: PatientService,
    private visitService: VisitService,
    private userIdentityInfo: UserIdentityInfo
  ) { }

  formatDates = (dates: { day: Date, hour: number }[]): string => {
    return DateUtils.formatSelectedDays(dates);
  }

  cancelVisit = (visit: ScheduledVisit): void => {
    console.log(`.cancelVisit - invoked, visit id=${visit.id}`);

    const userChoice = confirm("Are you sure you want to cancel the visit?");

    if (!userChoice) return;

    this.visitService.removeVisit(visit.id).subscribe({
      next: (response) => {
        console.log(`Successfully cancelled visit`);
        this.visits = this.visits.filter(v => v.id !== visit.id);
      },
      error: (err) => console.error("Error cancelling visit:", err),
    });
  }

  ngOnInit(): void {
    this.userIdentityInfo.authenticatedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (user) => {
        if (user) {
          this.authenticatedUser = user;
          this.patientService.getPatientById(this.authenticatedUser.id).subscribe({
            next: (patient) => {
              this.visitService.getPatientVisits(patient.id).subscribe({
                next: (visits) => {
                  console.log('Scheduled visits:', visits);
                  visits.forEach(visit => {
                    if (visit.date && Array.isArray(visit.date)) {
                      visit.date = visit.date.map(dateItem => ({
                        day: new Date(dateItem.day),
                        hour: dateItem.hour,
                      }));
                    }
                  });
                  this.cancelledVisits = visits.filter(visit =>
                    visit.cancelled && new Date(visit.date[0].day).toISOString().split('T')[0] >= new Date().toISOString().split('T')[0]
                  );
                  this.visits = visits.filter(visit => !visit.cancelled);
                },
                error: (err) => {
                  console.log('Error retrieving patient visits:', err);
                },
              });
            }
          })
        }
      },
      error: (err) => console.error('Error with user info:', err)
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
