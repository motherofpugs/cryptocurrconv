import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
  users!: userSignup[];

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.users = this.authService.users;
  }
  get username(): AbstractControl | null {
    return this.signupForm.get('username');
  }

  signUp(): void {
    const newUser: userSignup = this.signupForm.value;
    this.authService.onSignup(newUser);
    this.signupForm.reset();
    this.router.navigate(['/loginpage/login']);
  }
}
