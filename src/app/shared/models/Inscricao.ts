import { Status } from "../enums/Status.enum";
import { Curso } from "./Curso";
import { Estudante } from "./Estudante";

export interface Inscricao {
    id: number;
    estudanteId: number;
    cursoId: number;
    status: Status;
    dataMatricula: string;

    estudante?: Estudante;
    curso?: Curso;
}
