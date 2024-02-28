import { Injectable, OnInit } from '@angular/core';
import { userSignup } from '../models/userSignup.model';
import { userLogin } from '../models/userLogin.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: userSignup[] = [];
  loggedInUser?: userSignup;

  constructor() {
    const users = localStorage.getItem('users');
    this.users = users ? JSON.parse(users) : [];
    const loggedUser = localStorage.getItem('loggedUser');
    this.loggedInUser = loggedUser ? JSON.parse(loggedUser) : null;
  }

  onSignup(newUser: userSignup) {
    const existingUser = this.users.find(
      (user) => user.username === newUser.username
    );
    if (existingUser) {
      console.log('Username is already taken');
      return;
    }
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  onLogin(existingUser: userLogin) {
    const users = localStorage.getItem('users');
    this.users = users ? JSON.parse(users) : [];
    const isUserExisting = this.users.find(
      (user) => user.username === existingUser.username
    );
    if (isUserExisting) {
      if (isUserExisting.password === existingUser.password) {
        localStorage.setItem('loggedUser', JSON.stringify(isUserExisting));
        this.loggedInUser = isUserExisting;
        console.log('yaaay');
      } else {
        console.log('invalid password');
      }
    } else {
      console.log('user not found');
    }
  }

  onLogout() {
    localStorage.removeItem('loggedUser');
    console.log('logged out');
    this.loggedInUser = undefined;
  }
}
