import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error   = '';

  constructor(
    private fb:      FormBuilder,
    private auth:    AuthService,
    private router:  Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    const { username, password } = this.form.value;
    this.auth.login(username, password).subscribe({
      next: res => {
        this.loading = false;
        const home = res.role === 'Admin' ? '/admin/dashboard' : '/shop/catalog';
        this.router.navigate([home]);
      },
      error: () => {
        this.loading = false;
        this.error   = 'Identifiants incorrects. Veuillez réessayer.';
      }
    });
  }
}
