export interface IContainer {
  codigoOS?: number;
  codigoCliente?: number;
  codigoContainer?: number;
  codigoMovimentacao?: number;
  descricaoContainer?: string;
  dataColocacao?: Date;
  dataRetirada?: Date;
  xEtapaPendente?: boolean;
}
