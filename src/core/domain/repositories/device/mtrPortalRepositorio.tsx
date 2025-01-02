import { ISQLRows } from "vision-common";
import { IDestinadorAuxiliar, IGeradorAuxiliar, IResiduoAuxiliar, ITransportadorAuxiliar } from "../../entities/portalMtr/mtrAuxiliar";

export interface IDeviceMtrPortalRepositorio {
  criarTabelaConfiguracaoTransportador: () => Promise<void>;

  criarTabelaDadosDestinador: () => Promise<void>;

  criarTabelaConfiguracaoDestinador: () => Promise<void>;

  criarTabelaDadosGeradorMtrSinir: () => Promise<void>;

  criarTabelaDadosTransportadorMtrSinir: () => Promise<void>;

  criarTabelaEstadosFisicosPortal: () => Promise<void>;

  criarTabelaFormasAcondicionamentoPortal: () => Promise<void>;

  criarTabelaFormasTratamentoPortal: () => Promise<void>;

  criarTabelaResiduosPortal: () => Promise<void>;

  criarTabelaSubGruposPortal: () => Promise<void>;

  criarTabelaUnidadesPortal: () => Promise<void>;

  criarTabelaLogosEmpresas: () => Promise<void>;

  deletarDadosPortal: () => Promise<void>;

  pegarDadosGeradorMtr: (params: { codigoOS: number, clienteID: number, estadoID: number, obraID?: number }) => Promise<IGeradorAuxiliar>;

  pegarDadosGeradorNovaColetaMtr: (params: { codigoVinculo: number | string, clienteID: number, estadoID: number, obraID?: number }) => Promise<IGeradorAuxiliar>;

  pegarDadosTransportador: (estadoID: number) => Promise<ITransportadorAuxiliar>;

  pegarDadosDestinador: (destinadorID: number, estadoID: number) => Promise<IDestinadorAuxiliar>;

  pegarResiduosPortal: (codigoVinculo: number | string, estadoID: number) => Promise<ISQLRows<IResiduoAuxiliar>>;

  pegarLogoEmpresa: (empresaID: number) => Promise<string>;

  inserirUnidadePortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirSubGrupoPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirResiduosPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirLogosEmpresasPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirFormasTratamentoPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirAcondicionamentoPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirEstadosFisicosPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirDadosTransportadorPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirDadosDestinadorPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirGeradorPortalSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirConfiguracoesTransportadorSincronizacao: (sql: string) => Promise<ISQLRows<void>>;

  inserirConfiguracoesDestinadorSincronizacao: (sql: string) => Promise<ISQLRows<void>>;
}