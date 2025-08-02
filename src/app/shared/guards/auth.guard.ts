import { inject } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(Auth);

  return new Observable<boolean>((observer) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          observer.next(true);
        } else {
          router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
      },
      (error) => {
        console.error(error);
        router.navigate(['/login']);
        observer.next(false);
        observer.complete();
      },
    );
    return unsubscribe;
  });
};
