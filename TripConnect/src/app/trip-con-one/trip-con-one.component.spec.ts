import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripConOneComponent } from './trip-con-one.component';

describe('TripConOneComponent', () => {
  let component: TripConOneComponent;
  let fixture: ComponentFixture<TripConOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripConOneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripConOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
