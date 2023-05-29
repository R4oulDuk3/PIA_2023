import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: string  = "";
  password: string = "";
  isLoading: boolean = false;
  error: string = "";

  constructor(private snackBar: MatSnackBar) { }
  ngOnInit(): void {
  }

  login() {
    this.isLoading = true;

    // Simulating login process
    setTimeout(() => {
      this.isLoading = false;
      if (this.username === 'admin' && this.password === 'password') {
        // Login successful
        // Redirect or perform necessary actions
      } else {
        // Login failed
        this.error = 'Invalid username or password';
        this.snackBar.open(this.error, 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    }, 2000);
  }
}
