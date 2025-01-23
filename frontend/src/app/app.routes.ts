import { CartComponent } from './components/patient/cart/cart.component';
import { Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AvailabilityComponent } from './components/doctor/availability/availability.component';
import { PatientDashboardComponent } from './components/patient/patient-dashboard/patient-dashboard.component';
import { SchedulerComponent } from './components/patient/scheduler/scheduler.component';
import { SettingsComponent } from './components/admin/settings/settings.component';
import { RegistrationComponent } from './components/authentication/registration/registration.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { VisitHistoryComponent } from './components/patient/visit-history/visit-history.component';
import { UsersComponent } from './components/admin/users/users.component';
import { DoctorCreatorComponent } from './components/admin/doctor-creator/doctor-creator.component';
import { AuthGuard } from './authentication/guard/auth.guard';
import { Role } from './model/enum/Role';

export const routes: Routes = [
    { path: "calendar/:id/:schedule", component: CalendarComponent, canActivate: [AuthGuard], data: { roles: [Role.DOCTOR, Role.PATIENT]} },
    { path: "home", component: CalendarComponent },
    { path: "availability", component: AvailabilityComponent, canActivate: [AuthGuard], data: { roles: [Role.DOCTOR]} },
    { path: "patient-dashboard", component: PatientDashboardComponent, canActivate: [AuthGuard], data: { roles: [Role.PATIENT]} },
    { path: "schedule/:id", component: SchedulerComponent, canActivate: [AuthGuard], data: { roles: [Role.PATIENT]} },
    { path: "cart", component: CartComponent, canActivate: [AuthGuard], data: { roles: [Role.PATIENT]} },
    { path: "settings", component: SettingsComponent, canActivate: [AuthGuard], data: { roles: [Role.ADMIN]} },
    { path: "register", component: RegistrationComponent },
    { path: "login", component: LoginComponent },
    { path: "doctors", component: DoctorsComponent },
    { path: "visit-history", component: VisitHistoryComponent, canActivate: [AuthGuard], data: { roles: [Role.PATIENT]} },
    { path: "users", component: UsersComponent, canActivate: [AuthGuard], data: { roles: [Role.ADMIN]} },
    { path: "doctors/create", component: DoctorCreatorComponent, canActivate: [AuthGuard], data: { roles: [Role.ADMIN]} }
];
