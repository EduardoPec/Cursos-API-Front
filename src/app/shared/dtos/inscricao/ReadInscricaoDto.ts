import { Status } from "../../enums/Status.enum";

export interface ReadInscricaoDto {
    id: number;
    estudanteId: number;
    cursoId: number;
    status: Status;
    dataMatricula: string;
}
