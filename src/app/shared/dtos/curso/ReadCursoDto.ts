import { ReadInscricaoDto } from "../inscricao/ReadInscricaoDto";

export interface ReadCursoDto {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
    cargaHoraria: number;
    professorId?: number | null;
    dataCriacao: string;
    inscricoes: ReadInscricaoDto[]
}
