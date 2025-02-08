import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../model/User';
import { Subject, takeUntil } from 'rxjs';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgFor, FormsModule],
  providers: [UserService],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users; 
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  banIcon = (banned: boolean | undefined): string => {
    return banned ? 'assets/locked.png' : 'assets/unlocked.png';
  }

  toggleUserBan = (id: string): void => {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex >= 0) {
      const user = this.users[userIndex];
      const updatedUser = { ...user, banned: !user.banned };
      this.users = [
        ...this.users.slice(0, userIndex),
        updatedUser,
        ...this.users.slice(userIndex + 1),
      ];
      this.filterUsers(); 

      this.userService.toggleUserBan(id).subscribe({
        next: (response) => {
          console.log(`Server response: ${response}`);
        },
        error: (error) => {
          console.error('Error toggling user ban:', error);
          this.users[userIndex] = user; 
        }
      });
    }
  };

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchesSearch = `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return matchesSearch;
    });
  }
}
