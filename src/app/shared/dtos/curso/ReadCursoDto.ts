import { ReadInscricaoDto } from "../inscricao/ReadInscricaoDto";

export interface ReadCursoDto {
    id: number;
    titulo: string;
    descricao: string;
    categoria: string;
    cargaHoraria: number;
    dataCriacao: string;
    inscricoes: ReadInscricaoDto[]
}
