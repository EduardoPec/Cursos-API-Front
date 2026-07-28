import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

interface JwtPayload {
  exp?: number;
  role?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  unique_name?: string;
}

export interface CadastroUsuario {
  username: string;
  email: string;
  password: string;
  rePassword: string;
  role: 'ESTUDANTE';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'coursehub_token';
  private readonly tokenState = signal<string | null>(this.lerToken());

  readonly token = this.tokenState.asReadonly();
  readonly payload = computed(() => this.decodificar(this.tokenState()));
  readonly autenticado = computed(() => {
    const payload = this.payload();
    return !!this.tokenState() && (!payload?.exp || payload.exp * 1000 > Date.now());
  });
  readonly usuario = computed(() => {
    const payload = this.payload();
    return payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? payload?.unique_name ?? '';
  });
  readonly roles = computed(() => {
    const payload = this.payload();
    const role = payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? payload?.role ?? [];
    return Array.isArray(role) ? role : [role];
  });

  login(username: string, password: string) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/Usuario/login`,
      { username, password },
      { responseType: 'text' }
    ).pipe(tap(token => this.salvarToken(token)));
  }

  cadastrar(dto: CadastroUsuario) {
    return this.http.post<void>(`${API_CONFIG.baseUrl}/Usuario/cadastro`, dto);
  }

  logout(): void {
    this.tokenState.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.storageKey);
    }
  }

  possuiRole(...roles: string[]): boolean {
    return roles.some(role => this.roles().includes(role));
  }

  private salvarToken(token: string): void {
    const tokenLimpo = token.replace(/^"|"$/g, '');
    this.tokenState.set(tokenLimpo);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, tokenLimpo);
    }
  }

  private lerToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.storageKey)
      : null;
  }

  private decodificar(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(
        atob(base64).split('').map(char =>
          `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`
        ).join('')
      ));
    } catch {
      return null;
    }
  }
}
