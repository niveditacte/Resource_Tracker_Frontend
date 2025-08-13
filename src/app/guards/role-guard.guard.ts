import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // read required roles from route config
  const requiredRoles: string[] | null = route.data['role'] as string[];
  const userRole: string | null = authService.getUserRole();

  if (!requiredRoles || !userRole) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles.includes(userRole)) {
    return true;
  }

  // role does not match, redirect
  router.navigate(['/unauthorized']);
  return false;
};
