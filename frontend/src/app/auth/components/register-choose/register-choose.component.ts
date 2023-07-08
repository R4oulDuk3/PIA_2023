import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-choose',
  templateUrl: './register-choose.component.html',
  styleUrls: ['./register-choose.component.scss'],
})
export class RegisterChooseComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToClientRegistration(): void {
    this.router.navigate(['auth/register/client']);
  }

  goToAgencyRegistration(): void {
    this.router.navigate(['auth/register/agency']);
  }
}
