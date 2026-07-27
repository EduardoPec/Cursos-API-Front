import { ReadInscricaoDto } from "../inscricao/ReadInscricaoDto";

export interface ReadEstudanteDto {
    id: number;
    nomeCompleto: string;
    email: string;
    dataCadastro: string;
    inscricoes: ReadInscricaoDto[]
}
