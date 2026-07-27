import { Status } from "../../enums/Status.enum";

export interface CreateInscricaoDto {
    estudanteId: number;
    cursoId: number;
    status: Status;
}
