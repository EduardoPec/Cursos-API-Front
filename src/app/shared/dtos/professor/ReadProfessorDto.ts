export interface ReadProfessorDto {
  id: number;
  usuarioId: string;
  nomeCompleto: string;
  username: string;
  email: string;
  especialidade: string | null;
  biografia: string | null;
  dataCadastro: string;
}
