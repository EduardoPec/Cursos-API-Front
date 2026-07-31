import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { CreateProfessorDto } from '../../../shared/dtos/professor/CreateProfessorDto';
import { ReadProfessorDto } from '../../../shared/dtos/professor/ReadProfessorDto';
import { UpdateProfessorDto } from '../../../shared/dtos/professor/UpdateProfessorDto';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_CONFIG.baseUrl}/Professor`;

  listar(): Observable<ReadProfessorDto[]> {
    return this.http.get<ReadProfessorDto[]>(this.url, {
      headers: { 'Cache-Control': 'no-cache' },
    });
  }

  buscarPorId(id: number): Observable<ReadProfessorDto> {
    return this.http.get<ReadProfessorDto>(`${this.url}/${id}`);
  }

  criar(dto: CreateProfessorDto): Observable<ReadProfessorDto> {
    return this.http.post<ReadProfessorDto>(this.url, dto);
  }

  atualizar(id: number, dto: UpdateProfessorDto): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
