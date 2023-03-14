import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LetModule } from '@ngrx/component';
import { SummaryComponent } from './search/summary/summary.component';
import { SummaryPipe } from './search/summary/summary.pipe';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  }
]

@NgModule({
  declarations: [
    SearchComponent,
    SummaryComponent,
    SummaryPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    LetModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => {
      const fs = getFirestore()
      if ( !environment.production )
        connectFirestoreEmulator( fs, 'localhost' , 8080 );
      return fs;
    }),
  ],
})
export class RsvpModule { }
