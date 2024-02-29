import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { userSignup } from 'src/app/models/userSignup.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  loggedUser!: userSignup | undefined;

  ngOnInit(): void {
    this.loggedUser = this.authService.loggedInUser;
  }

  constructor(private authService: AuthService, private router: Router) {}
  logout() {
    this.authService.onLogout();
    this.router.navigate(['loginpage/login']);
  }
}
