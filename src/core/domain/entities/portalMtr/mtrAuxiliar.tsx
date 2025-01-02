export interface IGeradorAuxiliar {
  codigoUnidade?: number;
  nomeCliente?: string;
  cpfcnpj?: string;
  rua?: string;
  bairro?: string;
  numero?: number;
  municipio?: string;
  estado?: string;
  telefone?: string;
  celular?: string;
  nomeResponsavel?: string;
  funcaoResponsavel?: string;
  dataColeta?: Date;
  assinaturaBase64?: string;
}

export interface ITransportadorAuxiliar {
  nomeTransportador?: string;
  cpfcnpj?: string;
  rua?: string;
  bairro?: string;
  numero?: number;
  municipio?: string;
  estado?: string;
  telefone?: string;
  celular?: string;
  motorista?: string;
  codigoUnidade?: number;
}

export interface IDestinadorAuxiliar {
  codigoUnidade?: number;
  NomeDestinador?: string;
  cpfcnpj?: string;
  numero?: number;
  bairro?: string;
  rua?: string;
  municipio?: string;
  estado?: string;
  telefone?: string;
  celular?: string;
  responsavel?: string;
  cargoResponsavel?: string;
}

export interface IResiduoAuxiliar {
  codigoResiduoSite?: string;
  descricaoResiduoSite?: string;
  estadoFisicoSite?: number;
  classeSite?: string;
  acondicionamento?: string;
  quantidade?: number;
  unidade?: string;
  tecnologia?: string;
}

export interface IMtrAuxiliar {
  dadosGerador?: IGeradorAuxiliar;
  dadosTransportador?: ITransportadorAuxiliar;
  dadosDestinador?: IDestinadorAuxiliar;
  residuos?: IResiduoAuxiliar[];
  logoEmpresa?: string;
}