import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserIdentityInfo } from '../UserIdentityInfo';
import { Role } from '../../model/enum/Role';

export const AuthGuard: CanActivateFn = (route, state) => {
  const userIdentityInfo = inject(UserIdentityInfo);
  const router = inject(Router);

  const roles = route.data['roles'] as Role[];

  return userIdentityInfo.authenticatedUser$.pipe(
    map((user) => {
      if (user && roles.includes(user.role)) {
        return true; 
      } else {
        console.log('Access denied. Redirecting to login...');
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      }
    })
  );
};
