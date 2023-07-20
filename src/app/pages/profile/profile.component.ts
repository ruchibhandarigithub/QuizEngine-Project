import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user :any;
  constructor(private login: LoginService) {}

  ngOnInit(): void {
    this.loadUser();
     
  }
  loadUser() {
    // Fetch the user data
    this.login.getCurrentUser().subscribe(
      (user: any) => {
        console.log('User data:', user);
        this.user=user;
        
      },

      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
}
}

