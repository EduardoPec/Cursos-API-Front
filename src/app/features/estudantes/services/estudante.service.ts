import { inject, Injectable } from '@angular/core';
import { ReadEstudanteDto } from '../../../shared/dtos/estudante/ReadEstudanteDto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../../core/config/api.config';
import { CreateEstudanteDto } from '../../../shared/dtos/estudante/CreateEstudanteDto';
import { UpdateEstudanteDto } from '../../../shared/dtos/estudante/UpdateEstudanteDto';

@Injectable({
  providedIn: 'root'
})
export class EstudanteService {

constructor() { }

  private readonly http = inject(HttpClient)
  private readonly url = `${API_CONFIG.baseUrl}/estudante`

  listar(): Observable<ReadEstudanteDto[]> {
    return this.http.get<ReadEstudanteDto[]>(this.url, {
      headers: { 'Cache-Control': 'no-cache' }
    });
  }

  buscarPorId(id: number): Observable<ReadEstudanteDto> {
    return this.http.get<ReadEstudanteDto>(`${this.url}/${id}`);
  }

  criar(dto: CreateEstudanteDto): Observable<ReadEstudanteDto> {
    return this.http.post<ReadEstudanteDto>(this.url, dto);
  }

  atualizar(id: number, dto: UpdateEstudanteDto): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  } 
}
