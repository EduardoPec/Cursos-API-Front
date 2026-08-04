import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, timeout } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();
  if (!token || !request.url.startsWith('/api') || request.url.includes('/Usuario/')) {
    return next(request).pipe(timeout(10000));
  }
  const requisicaoAutenticada = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(requisicaoAutenticada).pipe(
    timeout(10000),
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401) {
        auth.logout();
        router.navigate(['/login'], {
          queryParams: { sessaoExpirada: true }
        });
      }
      return throwError(() => erro);
    })
  );
};
