import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from './helper';

@Injectable({
  providedIn: 'root',
})
export class QuizResultService {
  constructor(private http: HttpClient) {}

  // Add Quiz Result
  public addQuizResult(quizResultDto) {
    return this.http.post(`${baseUrl}/quiz-result/`, quizResultDto);
  }

  // Get Quiz Results By User
  public getQuizResultsByUser(username) {
    return this.http.get(`${baseUrl}/quiz-result/username?username=${username}`);
  }
}
