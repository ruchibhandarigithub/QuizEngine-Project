import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';
import { QuizService } from 'src/app/services/quiz.service';
import { LoginService } from 'src/app/services/login.service';
import { QuizResultService } from 'src/app/services/quiz-result.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent implements OnInit {
  qid;
  questions;
  marksGot = 0;
  correctAnswers = 0;
  attempted = 0;
  isSubmit = false;
  timer: any;
  user;
  quiz;
  name:String;
  quizId:any;

  constructor(
    private locationSt: LocationStrategy,
    private _route: ActivatedRoute,
    private _question: QuestionService,
    private _quiz: QuizService,
    private router: Router,
    private _login: LoginService,
    private _quizResultService:QuizResultService
  ) {}

  ngOnInit(): void {
    this.preventBackButton();
    this.qid = this._route.snapshot.params.qid;
    console.log(this.qid);
    this.loadUserAndQuizData();
    this.loadQuestions();
  }

  loadUserAndQuizData() {
    // Fetch the user data
    this._login.getCurrentUser().subscribe(
      (user: any) => {
        console.log('User data:', user);
        this.user=user;
        this.name =this.user.username;
      },

      (error) => {
        console.error('Error fetching user data:', error);
      }
    );

    // Fetch the quiz data
    this._quiz.getQuiz(this.qid).subscribe(
      (quiz: any) => {
        console.log('Quiz data:', quiz);
        this.quiz = quiz;
        this.quizId = this.qid;
      },
      (error) => {
        console.error('Error fetching quiz data:', error);
      }
    );
  }

  loadQuestions() {
    this._question.getQuestionsOfQuizForTest(this.qid).subscribe(
      (data: any) => {
        this.questions = data;
        console.log(data);

        this.timer = this.questions.length * 2 * 60;

        this.startTimer();
      },
      (error) => {
        console.log(error);
        Swal.fire('Error', 'Error in loading questions of quiz', 'error');
      }
    );
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationSt.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  submitQuiz() {
    Swal.fire({
      title: 'Do you want to submit the quiz?',
      showCancelButton: true,
      confirmButtonText: `Submit`,
      icon: 'info',
    }).then((e) => {
      if (e.isConfirmed) {
        this.evalQuiz();
      }
    });
  }

  startTimer() {
    let t = window.setInterval(() => {
      //code
      if (this.timer <= 0) {
        this.evalQuiz();
        clearInterval(t);
      } else {
        this.timer--;
      }
    }, 1000);
  }

  navigateToFeedback() {
    this._quiz.setQuestionsData(this.questions);
    this.router.navigate(['/feedback']);
  }

  getFormattedTime() {
    let mm = Math.floor(this.timer / 60);
    let ss = this.timer - mm * 60;
    return `${mm} min : ${ss} sec`;
  }

  evalQuiz() {
    // Check if user data is available
    if (!this.user || !this.user.username) {
      console.error('User data is not available');
      return;
    }

    //calculation
    //call to sever  to check questions
    this._question.evalQuiz(this.questions).subscribe(
      (data: any) => {
        console.log(data);
        this.marksGot = data.marksGot;
        this.correctAnswers = data.correctAnswers;
        this.attempted = data.attempted;
        this.isSubmit = true;
        this.storeQuizResult();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  storeQuizResult() {
    // Prepare the quiz result data to be sent to the backend
    const quizResultData = {
      username: this.name, // Provide the username
      quizId: this.quizId, // Provide the quiz ID
      marksObtained: this.marksGot,
      totalMarks: this.quiz.maxMarks, // Assuming the quiz is the same for all questions
    };
    console.log(quizResultData);

    this._quizResultService.addQuizResult(quizResultData).subscribe(
      (response) => {
        console.log('Quiz result stored successfully:', response);
        // You can handle the response or show some success message here
      },
      (error) => {
        console.error('Error storing quiz result:', error);
        // You can handle the error or show some error message here
      }
    );
  }
}
