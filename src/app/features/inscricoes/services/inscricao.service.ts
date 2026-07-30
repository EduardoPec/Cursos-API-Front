import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '../../../core/config/api.config';
import { ReadInscricaoDto } from '../../../shared/dtos/inscricao/ReadInscricaoDto';
import { Observable } from 'rxjs';
import { CreateInscricaoDto } from '../../../shared/dtos/inscricao/CreateInscricaoDto';
import { Status } from '../../../shared/enums/Status.enum';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {

constructor() { }

  private readonly http = inject(HttpClient)
  private readonly url = `${API_CONFIG.baseUrl}/inscricao`

  listar(): Observable<ReadInscricaoDto[]> {
    return this.http.get<ReadInscricaoDto[]>(this.url, {
      headers: { 'Cache-Control': 'no-cache' }
    });
  }

  buscarPorEstudante(estudanteId: number): Observable<ReadInscricaoDto[]> {
    return this.http.get<ReadInscricaoDto[]>(`${this.url}/estudantes/${estudanteId}`);
  }

  buscarPorId(id: number): Observable<ReadInscricaoDto> {
    return this.http.get<ReadInscricaoDto>(`${this.url}/${id}`);
  }

  criar(dto: CreateInscricaoDto): Observable<ReadInscricaoDto> {
    return this.http.post<ReadInscricaoDto>(this.url, dto);
  }

  atualizarStatus(id: number, status: Status) {
    return this.http.patch<ReadInscricaoDto>(`${this.url}/${id}/status`, { status },
  );
}

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  } 
}
