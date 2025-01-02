export interface IUsuario {
  codigo?: number;
  nome?: string;
  login?: string;
  cpf?: number;
  fotoBase64?: string;
  email?: string;
  telefone?: string;
  codigoDispositivo?: number,
  permiteCadastrarOrdemMobile?: boolean;
  dispositivoMovel?: boolean;
  numeroIMEI?: string;
}
