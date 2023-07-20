import { Component, OnInit } from '@angular/core';
import { QuizResultService } from 'src/app/services/quiz-result.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-quiz-atttended',
  templateUrl: './quiz-atttended.component.html',
  styleUrls: ['./quiz-atttended.component.css']
})
export class QuizAtttendedComponent implements OnInit {

  quizResults: any[] = [];
  user: any;
  username: any;
 
  constructor(
    private quizResultService: QuizResultService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.getUserQuizResults();
  }

  getUserQuizResults(): void {
    this.loginService.getCurrentUser().subscribe(
      (user: any) => {
        this.user = user;
        this.username = this.user.username;

        // Move the call to getQuizResultsByUser() inside the subscription block
        this.quizResultService.getQuizResultsByUser(this.username).subscribe(
          (results: any[]) => {
            this.quizResults = results;
           
          
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
  getPerformanceMessage(marksObtained: number, totalMarks: number): string {
    const percentage = (marksObtained / totalMarks) * 100;

    if (percentage >= 90) {
      return 'Performance is Excellent';
    } else if (percentage >= 80) {
      return 'Performance is Good';
    } else if (percentage >= 70) {
      return 'Performance is Average';
    } else if (percentage >= 60) {
      return 'Performance is Not Satisfactory';
    } else {
      return 'Performance is Not Good';
    }
  }

}
