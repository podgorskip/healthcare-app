import { Authorization } from './../../../authentication/AuthorizationService';
import { DateUtils } from './../../../utils/DateUtils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReviewService } from '../../../services/review/review.service';
import { UserIdentityInfo } from '../../../authentication/UserIdentityInfo';
import { User } from '../../../model/User';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Review } from '../../../model/Review';
import { Comment } from '../../../model/Comment';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [NgFor, CommonModule, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input() review: Review | null = null; 
  @Output() closePopup = new EventEmitter<void>();

  newComment: string = ''; 
  authenticatedUser?: User;
  DateUtils = DateUtils;
  Authorization = Authorization;

  constructor(private reviewService: ReviewService, private userIdentityInfo: UserIdentityInfo) {}

  addComment(): void {
    if (this.newComment.trim() && this.authenticatedUser && !this.authenticatedUser.banned && this.review?.id) {
      this.reviewService.addReviewComment(this.review.id, {
        comment: this.newComment,
        user: this.authenticatedUser?.id,
      }).subscribe({
        next: () => {
          if (this.authenticatedUser && this.review) {
            const comment: Comment = {
              id: '',
              comment: this.newComment,
              date: new Date(),
              user: this.authenticatedUser
            }

            if (this.review.comments) {
              this.review.comments.push(comment);
            } else {
              this.review.comments = [comment];
            }
          }
          this.newComment = ''; 
        },
        error: (error) => {
          console.error('Error adding comment:', error);
        }
      });
    }
  }

  removeComment = (id: string): void => {
    this.reviewService.removeReviewComment(id).subscribe({
      next: (response) => {
        console.log(`Response: ${response}`);
        if (this.review) {
          this.review.comments = this.review.comments?.filter(comment => comment.id !== id);
        }
      }
    })
  }

  close(): void {
    this.closePopup.emit();
  }

  ngOnInit(): void {
    this.userIdentityInfo.authenticatedUser$.subscribe({
      next: (user) => {
        if (user) {
          this.authenticatedUser = user;
        }
      }
    })
  }

  letters = (firstName: string, lastName: string): string => {
    return ((firstName.charAt(0) + lastName.charAt(0)) as string).toUpperCase();
  }

  isUserBanned = (): boolean => {
    return this.authenticatedUser?.banned ? this.authenticatedUser.banned : false;
  }
}
