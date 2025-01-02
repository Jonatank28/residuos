
export enum EnumTipoConexaoBalanca {
  TCP_CLIENT = 0,
  BLUETOOTH = 1
}

export enum EnumBalancas {
  WT3000iR = 0
}

export interface IBalanca {
  codigo?: number;
  codigoBalancaController?: number;
  descricaoBalanca?: string;
  tipoBalanca?: EnumBalancas;
  tipoConexao?: EnumTipoConexaoBalanca;
  tcpIP?: string;
  tcpPorta?: number;
  bluetoothMacAddress?: string;
}

export interface IRetornoBalanca {
  estabilidade?: string;
  tipoPeso?: string;
  prefix?: string;
  valor?: string;
  unidade?: string;
  terminacao?: string;
}