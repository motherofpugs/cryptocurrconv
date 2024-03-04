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
      username: new FormControl('', [
        Validators.required,
        this.validateUsername,
      ]),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.users = this.authService.users;
  }

  validateUsername(control: AbstractControl): ValidationErrors | null {
    const username = control.value;
    const existingUser = this.users.find((user) => user.username === username);
    return existingUser ? { usernameTaken: true } : null;
  }
  signUp(): void {
    const newUser: userSignup = this.signupForm.value;
    this.authService.onSignup(newUser);
    this.signupForm.reset();
    this.router.navigate(['/loginpage/login']);
  }
}
