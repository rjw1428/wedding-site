import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  }
]

@NgModule({
  declarations: [
    FormComponent,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
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
