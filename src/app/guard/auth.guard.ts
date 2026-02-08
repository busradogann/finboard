import { CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = (_childRoute, state) => {
  const router = inject(Router);

  const auth = localStorage.getItem('auth');

  if (auth) return true;

  return router.createUrlTree(['/auth/login'], {
    queryParams: { redirect: state.url },
  });
};
