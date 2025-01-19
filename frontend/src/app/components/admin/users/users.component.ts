import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../model/User';
import { Subject, takeUntil } from 'rxjs';
import { NgFor } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgFor],
  providers: [UserService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  users?: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.users$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (users) => {
        this.users = users;
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  banIcon = (banned: boolean | undefined): string => {
    if (banned) return 'assets/locked.png';
    else return 'assets/unlocked.png';
  }

  toggleUserBan = (id: string): void => {
    const userIndex = this.users?.findIndex((user) => user.id === id);
    if (userIndex !== undefined && userIndex >= 0) {
      const user = this.users![userIndex];
      const updatedUser = { ...user, banned: !user.banned };
      this.users = [
        ...this.users!.slice(0, userIndex),
        updatedUser,
        ...this.users!.slice(userIndex + 1),
      ];

      this.userService.toggleUserBan(id).subscribe({
        next: (response) => {
          console.log(`Server response: ${response}`);
        },
        error: (error) => {
          console.error('Error toggling user ban:', error);
          this.users![userIndex] = user;
        },
      });
    }
  };
}
