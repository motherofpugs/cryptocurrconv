import { Injectable } from '@angular/core';
import { userSignup } from '../models/userSignup.model';
import { userLogin } from '../models/userLogin.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: userSignup[] = [];
  loggedInUser = new BehaviorSubject<userSignup | null>(null);

  constructor() {
    const users = localStorage.getItem('users');
    this.users = users ? JSON.parse(users) : [];
    if (this.users) localStorage.setItem('users', JSON.stringify(this.users));
    const loggedUser = localStorage.getItem('loggedUser');
    this.loggedInUser.next(loggedUser ? JSON.parse(loggedUser) : null);
  }

  onSignup(newUser: userSignup) {
    const existingUser = this.users.find(
      (user) => user.username === newUser.username
    );
    if (existingUser) {
      console.log('Username is already taken');
      return;
    }
    newUser.saved = [];
    this.users.push(newUser);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  onLogin(signInUser: userLogin) {
    const users = localStorage.getItem('users');
    this.users = users ? JSON.parse(users) : [];
    const isUserExisting = this.users.find(
      (user) => user.username === signInUser.username
    );
    if (isUserExisting) {
      if (isUserExisting.password === signInUser.password) {
        localStorage.setItem('loggedUser', JSON.stringify(isUserExisting));
        this.loggedInUser.next(isUserExisting);
        console.log('Yaaay! You are in');
      } else {
        console.log('Invalid password');
      }
    } else {
      console.log('User not found');
    }
  }

  onLogout() {
    localStorage.removeItem('loggedUser');
    console.log('logged out');
    this.loggedInUser.next(null);
  }

  saveCrypto(crypto: string) {
    const loggedInUser = this.loggedInUser.getValue();
    if (loggedInUser) {
      if (!loggedInUser.saved) {
        loggedInUser.saved = [];
      }
      loggedInUser.saved.push(crypto);

      const userIndex = this.users.findIndex(
        (user) => user.username === loggedInUser?.username
      );
      if (userIndex !== -1) {
        this.users[userIndex] = loggedInUser;
        localStorage.setItem('users', JSON.stringify(this.users));
      }
      localStorage.setItem('loggedUser', JSON.stringify(loggedInUser));
      this.loggedInUser.next(loggedInUser);
    }
  }
  deleteCrypto(crypto: string) {
    const loggedInUser = this.loggedInUser.getValue();
    if (loggedInUser) {
      const index = loggedInUser.saved.indexOf(crypto);
      console.log(index);
      index === 0 && loggedInUser.saved.length < 1
        ? (loggedInUser.saved = [])
        : loggedInUser.saved.splice(index, 1);
      localStorage.setItem('loggedUser', JSON.stringify(loggedInUser));
      const userIndex = this.users.findIndex(
        (user) => user.username === loggedInUser?.username
      );
      if (userIndex !== -1) {
        this.users[userIndex] = loggedInUser;
        localStorage.setItem('users', JSON.stringify(this.users));
      }
      this.loggedInUser.next(loggedInUser);
    }
  }
}
