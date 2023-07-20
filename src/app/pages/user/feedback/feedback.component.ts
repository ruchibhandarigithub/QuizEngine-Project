import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { QuizService } from 'src/app/services/quiz.service';
import { QuizResultService } from 'src/app/services/quiz-result.service';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  questionData: any;
  userQuizResults: any[] = [];
  userPerformance: number = 0;
  analysis: string = '';
  hasAttendedOnlyOneQuiz: boolean = false;
  user:any;
  username:any;
  spinner: any;
  noQuizResults: any;
  @ViewChild('spinnerTemplate') spinnerTemplate: TemplateRef<any>;
  @ViewChild('noQuizResultsTemplate') noQuizResultsTemplate: TemplateRef<any>;

  constructor(
    private quizService: QuizService,
    private quizResultService: QuizResultService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.questionData = this.quizService.getQuestionsData();
    console.log(this.questionData);
    this.spinner = this.spinnerTemplate;
    this.noQuizResults = this.noQuizResultsTemplate;

    // Get the user's quiz results and analyze the performance
    this.getUserQuizResults();
  }

  getUserQuizResults(): void {
    this.loginService.getCurrentUser().subscribe(
      (user: any) => {
        this.user = user;
        this.username = this.user.username;
        console.log(this.user);
        console.log(this.username);
  
        // Move the call to getQuizResultsByUser() inside the subscription block
        this.quizResultService.getQuizResultsByUser(this.username).subscribe(
          (results: any[]) => {
///
            this.userQuizResults = results;
            this.calculatePerformance();
          },
          (error) => {
            console.error('Error fetching user quiz results:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching user quiz results:', error);
      }
    );
  }

  calculatePerformance(): void {
    console.log(this.userQuizResults);
    if (!this.userQuizResults || this.userQuizResults.length === 0) {
      this.userPerformance = 0;
      return;
    }

    let totalMarksObtained = 0;
    let totalMarksPossible = 0;

    this.userQuizResults.forEach((result) => {
      totalMarksObtained += result.marksObtained;
      totalMarksPossible += result.totalMarks;
    });

    this.userPerformance = (totalMarksObtained / totalMarksPossible) * 100;

    // Check if the user has attended only one quiz
    console.log(this.userPerformance);
    this.hasAttendedOnlyOneQuiz = this.userQuizResults.length === 1;
    this.analysis = this.analyzePerformance();
    console.log(this.analysis);

  }

  analyzePerformance(): string {
    const latestResult = this.userQuizResults[this.userQuizResults.length - 1];

    if (!latestResult) {
      return 'No quiz results found';
    }

    const latestMarksObtained = latestResult.marksObtained;
    const secondLatestResult = this.userQuizResults[this.userQuizResults.length - 2];

    if (secondLatestResult && latestMarksObtained > secondLatestResult.marksObtained) {
      return 'Great performance in the latest quiz Keep it Up !!';
    } else if(this.userQuizResults.length===1 ){
          return "First Quizz Keep it Up !!"
    }
    else {
      return 'You have not performed well in this Quiz Your score is less than the previous  quiz have attended You have to work hard';
    }
  }
}
