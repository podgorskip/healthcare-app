import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VisitService } from '../../../services/visit/visit.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [NgFor, FormsModule],
  providers: [VisitService],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  defaultStarsState = Array(10).fill({ src: 'assets/star.png' });
  stars;
  selectedScore = 0;
  comment: string = '';

  @Input() id: string | null = null;

  constructor (private visitService: VisitService, private router: Router) { 
    this.stars = this.defaultStarsState;
  }

  selectStar(index: number) {
    this.selectedScore = index + 1;

    for (let i = 0; i < 10; i++) {
      this.stars[i] = { src: i < this.selectedScore ? 'assets/star-full.png' : 'assets/star.png' };
    }
  }

  submitRating = (): void => {
    if (this.selectedScore > 0 && this.comment.trim() && this.id) {
      const review = { score: this.selectedScore, comment: this.comment };
      this.visitService.addVisitReview(review, this.id).subscribe({
        next: (response) => {
          console.log(`Response: ${response}`);
          this.clear();
          this.router.navigate(['/doctors']);
        }
      })
    } else {
      alert('Please provide both a score and a comment.');
    }
  }

  private clear = (): void => {
    this.selectedScore = 0;
    this.comment = '';
    this.stars = this.defaultStarsState;
  }
}
