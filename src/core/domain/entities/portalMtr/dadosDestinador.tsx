export interface IConfiguracaoDestinador {
  codigoDestinador?: number;
  codigoEstado?: number;
  codigoUnidade?: number;
  responsavelRecebimento?: string;
  cargoResponsavelRecebimento?: string;
}

export interface IDadosDestinador {
  codigoDestinador?: number;
  nomeDestinador?: string;
  cpfcnpj?: string;
  rua?: string;
  numero?: number;
  bairro?: string;
  municipio?: string;
  estado?: string;
  telefone?: string;
  celular?: string;
}