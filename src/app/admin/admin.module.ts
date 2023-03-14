import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BooleanPipe } from './dashboard/boolean.pipe'
import { browserLocalPersistence, connectAuthEmulator, initializeAuth, provideAuth } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  }
]

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    BooleanPipe
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => {
      const auth = initializeAuth(getApp(), {
        persistence: [
          browserLocalPersistence
        ]
      })
      if (!environment.production)
        connectAuthEmulator(auth, 'http://localhost:9099');
      return auth
    }),
    provideFirestore(() => {
      const fs = getFirestore()
      if (!environment.production)
        connectFirestoreEmulator(fs, 'localhost', 8080);
      return fs;
    }),
  ]
})
export class AdminModule { }
