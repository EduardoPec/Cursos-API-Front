import { Inscricao } from "./Inscricao";

export interface Estudante {
    id: number;
    nomeCompleto: string;
    email: string;
    dataCadatro: string;

    inscricoes?: Inscricao[];
}
