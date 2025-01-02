export interface IFormaTratamentoPortal {
  codigoFormaTratamento?: number;
  codigoEstado?: number;
  codigoFormaTratamentoSite?: number;
  descricaoFormaTratamentoSite?: string;
}

export interface IFormaAcondicionamentoPortal {
  codigoAcondicionamentoMTR?: number;
  codigoEstado?: number;
  codigoAcondicionamentoSite?: number;
  descricaoAcondicionamentoSite?: string;
}

export interface ISubGrupoPortal {
  codigoSubGrupo?: number;
  codigoEstado?: number;
  codigoClasseSite?: number;
  descricaoClasseSite?: string;
}

export interface IEstadoFisicoPortal {
  codigoEstadoFisico?: number;
  codigoEstado?: number;
  codigoEstadoFisicoSite?: number;
  descricaoEstadoFisicoSite?: string;
}

export interface IUnidadePortal {
  codigoUnidade?: number;
  codigoUnidadeSite?: number;
  descricaoUnidadeSite?: string;
  codigoEstado?: number;
}

export interface IResiduoPortal {
  codigoEstado?: number;
  codigoResiduoSite?: string;
  descricaoResiduoSite?: string;
  codigoMaterial?: number;
}
