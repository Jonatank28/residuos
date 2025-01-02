import { IConfiguracaoDestinador, IDadosDestinador } from "./dadosDestinador";
import { IDadosGerador } from "./dadosGerador";
import { IConfiguracaoTransportador, IDadosTransportador } from "./dadosTransportador";
import { ILogoEmpresa } from "./logoEmpresa";
import { IEstadoFisicoPortal, IFormaAcondicionamentoPortal, IFormaTratamentoPortal, IResiduoPortal, ISubGrupoPortal, IUnidadePortal } from "./portal";

export interface ISincronizacaoPortal {
  dadosGerador: IDadosGerador[];
  configuracaoPortalTransportador: IConfiguracaoTransportador[];
  dadosTransportador: IDadosTransportador[];
  formaTratamentoPortal: IFormaTratamentoPortal[];
  formaAcondicionamentoPortal: IFormaAcondicionamentoPortal[];
  subGrupoPortal: ISubGrupoPortal[];
  estadoFisicoPortal: IEstadoFisicoPortal[];
  unidadePortal: IUnidadePortal[];
  residuoPortal: IResiduoPortal[];
  configuracoesDestinador: IConfiguracaoDestinador[];
  dadosDestinador: IDadosDestinador[];
  logosEmpresas: ILogoEmpresa[];
}