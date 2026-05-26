import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem(environment.tokenKey);

    if (token) {
        return true;
    }

    return router.createUrlTree(['/login']);
};