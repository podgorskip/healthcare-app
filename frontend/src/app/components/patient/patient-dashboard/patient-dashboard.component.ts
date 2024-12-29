import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScheduledVisit } from '../../../model/ScheduledVisit';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../../../services/user/user.service';
import { ScheduledVisitService } from '../../../services/scheduled-visit/scheduled-visit.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { User } from '../../../model/User';
import { DateUtils } from '../../../utils/DateUtils';;
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule],
  providers: [UserService, ScheduledVisitService],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  scheduledVisits: ScheduledVisit[] = [];
  user: User;

  constructor(
    private scheduledVisitService: ScheduledVisitService,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.user = authenticationService.getAuthenticatedUser;
  }

  formatDates = (dates: { day: Date, hour: number }[]): string => {
    return DateUtils.formatSelectedDays(dates);
  }

  cancelVisit = (visit: ScheduledVisit): void => {
    console.log(`.cancelVisit - invoked, visit id=${visit.id}`);

    const userChoice = confirm("Are you sure you want to cancel the visit?");

    if (!userChoice) return;

    this.userService.removeVisit(this.user.id, visit.id)
      .then(() => {
        this.scheduledVisitService.removeVisit(visit.id);
        console.log(`Successfully deleted visit`)
      })
  }

  ngOnInit(): void {
    this.userService.scheduledVisits$.subscribe({
      next: async (ids) => {
        try {
          console.log(ids);
          this.scheduledVisits = await Promise.all(
            ids.map(async (id) => {
              let visit = await this.scheduledVisitService.getById(id);
              if (visit.date && Array.isArray(visit.date)) {
                visit.date = visit.date.map((dateItem) => {
                  return {
                    day: new Date(dateItem.day),  
                    hour: dateItem.hour            
                  };
                });
              }
  
              return visit;  
            })
          );
        } catch (err) {
          console.log('Failed to fetch scheduled visits: ', err);
        }
      },
      error: (err) => {
        console.log('Error in scheduled visits subscription: ', err);
      },
    });
  
    this.userService.startListeningScheduledVisits(this.user.id);
  }  
}
