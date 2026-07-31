import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { LoginResponse } from '../../shared/dtos/auth/LoginResponse';

interface JwtPayload {
  exp?: number;
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  unique_name?: string;
}

export interface CadastroUsuario {
  nomeCompleto: string;
  username: string;
  email: string;
  password: string;
  rePassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'coursehub_token';
  private readonly tokenState = signal<string | null>(this.lerTokenValido());

  readonly token = this.tokenState.asReadonly();

  readonly payload = computed(() =>
    this.decodificar(this.tokenState())
  );

  readonly autenticado = computed(() => {
    const token = this.tokenState();
    const payload = this.payload();

    if (!token || !payload) {
      return false;
    }

    return !payload.exp || payload.exp * 1000 > Date.now();
  });

  readonly usuario = computed(() => {
    const payload = this.payload();

    return (
      payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      ?? payload?.unique_name
      ?? ''
    );
  });

  readonly roles = computed(() => {
    const payload = this.payload();

    const role =
      payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      ?? payload?.role
      ?? [];

    return Array.isArray(role) ? role : [role];
  });

  login(username: string, password: string) {
    return this.http
      .post<LoginResponse>(
        `${API_CONFIG.baseUrl}/Usuario/login`,
        { username, password }
      )
      .pipe(
        tap(response => {
          this.salvarToken(response.accessToken);
        })
      );
  }

  cadastrar(dto: CadastroUsuario) {
    return this.http.post<void>(
      `${API_CONFIG.baseUrl}/Usuario/cadastro`,
      dto
    );
  }

  logout(): void {
    this.tokenState.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  }

  possuiRole(...roles: string[]): boolean {
    return roles.some(role =>
      this.roles().includes(role.toUpperCase())
    );
  }

  private salvarToken(token: string): void {
    this.tokenState.set(token);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, token);
    }
  }

  private lerTokenValido(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const token = localStorage.getItem(this.storageKey);
    const payload = this.decodificar(token);

    if (!token || !payload || (payload.exp !== undefined && payload.exp * 1000 <= Date.now())) {
      localStorage.removeItem(this.storageKey);
      return null;
    }

    return token;
  }

  private decodificar(token: string | null): JwtPayload | null {
    if (!token) {
      return null;
    }

    try {
      const partes = token.split('.');

      if (partes.length !== 3) {
        return null;
      }

      const base64 = partes[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const base64ComPadding =
        base64.padEnd(
          base64.length + (4 - base64.length % 4) % 4,
          '='
        );

      const json = decodeURIComponent(
        atob(base64ComPadding)
          .split('')
          .map(char =>
            `%${char
              .charCodeAt(0)
              .toString(16)
              .padStart(2, '0')}`
          )
          .join('')
      );

      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
