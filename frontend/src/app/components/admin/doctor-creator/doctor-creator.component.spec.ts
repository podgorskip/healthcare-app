import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCreatorComponent } from './doctor-creator.component';

describe('DoctorCreatorComponent', () => {
  let component: DoctorCreatorComponent;
  let fixture: ComponentFixture<DoctorCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
