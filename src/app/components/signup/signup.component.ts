import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { userSignup } from 'src/app/models/userSignup.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  signUp(): void {
    const newUser = this.signupForm.value;
    this.authService.onSignup(newUser);
    this.signupForm.reset();
    this.router.navigate(['/loginpage/login']);
  }
}
