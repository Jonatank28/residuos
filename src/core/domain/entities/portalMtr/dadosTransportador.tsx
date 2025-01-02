export interface IConfiguracaoTransportador {
  codigo?: number;
  codigoEstado?: number;
  codigoUnidade?: number;
}

export interface IDadosTransportador {
  codigoTransportador?: number;
  razaoSocial?: string;
  cpfcnpj?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  telefone?: string;
  celular?: string;
  motorista?: string;
  cargoMotorista?: string;
}