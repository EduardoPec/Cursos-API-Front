import { Inscricao } from "./Inscricao";

export interface Curso {
    id: number,
    nome: string;
    descricao: string;
    categoria: string;
    cargaHoraria: number;
    dataCriacao: string;
    
    inscricoes?: Inscricao[];
}
