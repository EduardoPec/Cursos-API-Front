import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { Observable } from 'rxjs';
import { ReadCursoDto } from '../../../shared/dtos/curso/ReadCursoDto';
import { CreateCursoDto } from '../../../shared/dtos/curso/CreateCursoDto';
import { UpdateCursoDto } from '../../../shared/dtos/curso/UpdateCursoDto';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

constructor() { }

  private readonly http = inject(HttpClient)
  private readonly url = `${API_CONFIG.baseUrl}/curso`

  listar(): Observable<ReadCursoDto[]> {
    return this.http.get<ReadCursoDto[]>(this.url, {
      headers: { 'Cache-Control': 'no-cache' }
    });
  }

  buscarPorId(id: number): Observable<ReadCursoDto> {
    return this.http.get<ReadCursoDto>(`${this.url}/${id}`);
  }

  criar(dto: CreateCursoDto): Observable<ReadCursoDto> {
    return this.http.post<ReadCursoDto>(this.url, dto);
  }

  atualizar(id: number, dto: UpdateCursoDto): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
