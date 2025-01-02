export interface IImobilizado {
  codigo?: number;
  codigoContrato?: number;
  descricao?: string;
  unidade?: string;
  quantidade?: number;
  valorUnitario?: number;
  subgrupo?: string;
  identificacao?: string;
  dataSaida?: Date;
  movimentado?: boolean;
  xExigeInteiro?: boolean;
  naoGerarMovimentacao?: boolean;
  xPesoEResiduoImobilizado?: boolean;
  cubagem?: number;
  tara?: number;
  codigoImobilizadoGenerico?: number;
  codigoIbama?: string;
  codigoEstadoFisico?: number;
  codigoSubGrupo?: number;
  codigoUnidade?: number;
  codigoAcondicionamento?: number;
  codigoFormaTratamento?: number;
  pesoLiquido?: number;
}
