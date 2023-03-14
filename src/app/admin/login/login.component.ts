import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Auth, browserLocalPersistence, setPersistence } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from '@firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required)
  })
  constructor(
    private router: Router,
    private auth: Auth
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    const email = this.form.get('email')!.value || ''
    const password = this.form.get('password')!.value || ''
    signInWithEmailAndPassword(this.auth, email, password)
      .then(res => {
        this.auth.setPersistence(browserLocalPersistence).then((res) => {
          this.router.navigate(['/admin', 'dashboard'])
        })
      })
      .catch(err => {
        console.log(err)
      })
  }
}
