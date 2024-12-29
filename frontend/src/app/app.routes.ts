import { CartComponent } from './components/patient/cart/cart.component';
import { Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AvailabilityComponent } from './components/doctor/availability/availability.component';
import { PatientDashboardComponent } from './components/patient/patient-dashboard/patient-dashboard.component';
import { SchedulerComponent } from './components/patient/scheduler/scheduler.component';
import { SettingsComponent } from './components/admin/settings/settings.component';

export const routes: Routes = [
    { path: "calendar/:schedule", component: CalendarComponent },
    { path: "home", component: CalendarComponent },
    { path: "availability", component: AvailabilityComponent },
    { path: "patient-dashboard", component: PatientDashboardComponent },
    { path: "scheduler", component: SchedulerComponent },
    { path: "cart", component: CartComponent },
    { path: "settings", component: SettingsComponent }
];
