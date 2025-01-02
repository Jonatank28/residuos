export interface IEquipamento {
  codigoOS?: number;
  codigoCliente?: number;
  codigoObra?: number;
  codigoContainer?: number;
  identificacao?: string;
  codigoMovimentacao?: number;
  naoGerarMovimentacao?: boolean;
  xPesoEResiduoImobilizado?: boolean;
  cubagem?: number;
  tara?: number;
  pesoBruto?: string;
  codigoImobilizadoGenerico?: number;
  descricaoContainer?: string;
  dataColocacao?: Date;
  dataRetirada?: Date;
  xEtapaPendente?: boolean;
}
