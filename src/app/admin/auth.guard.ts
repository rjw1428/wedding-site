import { Injectable, NgZone, Optional } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'any'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private ngZone: NgZone
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    
    return new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged(user => {
        const isLoggedIn = !!user
        if (!isLoggedIn) this.ngZone.run(() => this.router.navigate(['/admin']))
        resolve(isLoggedIn)
      })
    })
  }
}
