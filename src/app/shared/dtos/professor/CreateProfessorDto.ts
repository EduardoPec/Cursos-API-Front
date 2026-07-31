export interface CreateProfessorDto {
  nomeCompleto: string;
  username: string;
  email: string;
  password: string;
  especialidade: string | null;
  biografia: string | null;
}
