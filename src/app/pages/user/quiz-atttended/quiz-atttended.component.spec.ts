import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAtttendedComponent } from './quiz-atttended.component';

describe('QuizAtttendedComponent', () => {
  let component: QuizAtttendedComponent;
  let fixture: ComponentFixture<QuizAtttendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizAtttendedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAtttendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
