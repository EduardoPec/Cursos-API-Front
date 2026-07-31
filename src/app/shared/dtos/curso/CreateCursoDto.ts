export interface CreateCursoDto {
    titulo: string;
    descricao: string;
    categoria: string;
    cargaHoraria: number;
    professorId: number | null;
}
