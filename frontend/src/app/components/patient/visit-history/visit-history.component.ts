import { DateUtils } from './../../../utils/DateUtils';
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient/patient.service';
import { VisitService } from '../../../services/visit/visit.service';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { Subject, takeUntil } from 'rxjs';
import { ScheduledVisit } from '../../../model/ScheduledVisit';
import { NgFor, NgIf } from '@angular/common';
import { ReviewComponent } from '../review/review.component';
import { User } from '../../../model/User';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visit-history',
  standalone: true,
  imports: [NgFor, ReviewComponent, NgIf, RouterLink],
  providers: [PatientService, VisitService],
  templateUrl: './visit-history.component.html',
  styleUrl: './visit-history.component.css'
})
export class VisitHistoryComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  DateUtils = DateUtils;
  visits: ScheduledVisit[] = [];
  selectedVisit: string | null = null;
  user?: User;

  constructor(
    private patientService: PatientService,
    private visitService: VisitService,
    private userIdentityInfo: UserIdentityInfo
  ) { }

  ngOnInit(): void {
    this.userIdentityInfo.authenticatedUser$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.patientService.getPatientById(user.id).subscribe({
            next: (patient) => {
              this.visitService.getPatientVisits(patient.id).subscribe({
                next: (visits) => {
                  visits.forEach(visit => {
                    if (visit.date && Array.isArray(visit.date)) {
                      visit.date = visit.date.map(dateItem => ({
                        day: new Date(dateItem.day),
                        hour: dateItem.hour,
                      }));
                    }
                  });
                  this.visits = visits.filter(visit => new Date(visit.date[0].day).getTime() < new Date().getTime());
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

  onReviewClick = (id: string): void => {
    this.selectedVisit = id;
  }

  isAlreadyReviewed = (visit: ScheduledVisit): boolean => {
    console.log(visit)
    return visit.reviewed;
  }

  isUserBanned = (): boolean => {
    return this.user?.banned ? this.user.banned : false;
  }

  get lastThreeVisits() {
    return this.visits.slice(-3).reverse();
  }
}
