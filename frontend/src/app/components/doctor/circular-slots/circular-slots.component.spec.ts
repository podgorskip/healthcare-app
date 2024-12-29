import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularSlotsComponent } from './circular-slots.component';

describe('CircularSlotsComponent', () => {
  let component: CircularSlotsComponent;
  let fixture: ComponentFixture<CircularSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularSlotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CircularSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
