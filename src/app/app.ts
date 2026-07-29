import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cursos-web');
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
