import { DateUtils } from './../../../utils/DateUtils';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ReviewService } from '../../../services/review/review.service';
import { Review } from '../../../model/Review';
import { NgFor, NgIf } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [NgFor, CommentComponent, NgIf],
  providers: [ReviewService],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit, OnChanges {
  DateUtils = DateUtils;
  selectedReview: Review | null = null; 
  reviews: Review[] = [];

  @Input() doctorId!: string;

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    if (this.doctorId) {
      this.fetchReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctorId'] && changes['doctorId'].currentValue) {
      this.fetchReviews();
    }
  }

  fetchReviews(): void {
    this.reviewService.getDoctorReviews(this.doctorId).subscribe({
      next: (reviews) => {
        console.log(`Retrieved reviews: ${reviews.forEach(r => console.log(r))}`);
        this.reviews = reviews;
      }
    });
  }

  getStars(score: number): any[] {
    return new Array(score); 
  }

  openCommentPopup(review: Review): void {
    this.selectedReview = review;
  }

  closePopup(): void {
    this.selectedReview = null;
  }
}
