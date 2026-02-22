import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

// Validateur personnalisé : les deux mots de passe doivent correspondre
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pwd  = group.get('password')?.value;
  const conf = group.get('confirmPassword')?.value;
  return pwd === conf ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error   = '';

  constructor(
    private fb:     FormBuilder,
    private auth:   AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName:       ['', [Validators.required, Validators.minLength(2)]],
      lastName:        ['', [Validators.required, Validators.minLength(2)]],
      username:        ['', [Validators.required, Validators.minLength(3)]],
      password:        ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';

    const { firstName, lastName, username, password, confirmPassword } = this.form.value;
    this.auth.register(firstName, lastName, username, password, confirmPassword).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/shop/catalog']);
      },
      error: err => {
        this.loading = false;
        this.error = err.status === 409
          ? 'Ce nom d\'utilisateur est déjà pris.'
          : err.error?.message ?? 'Une erreur est survenue.';
      }
    });
  }
}
