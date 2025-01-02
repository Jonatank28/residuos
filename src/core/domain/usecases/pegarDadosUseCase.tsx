import Constants from 'expo-constants';
import { ApiException, ApiUnknownException, ILocalStorageConnection, statusCode } from 'vision-common';
import { $REST_VERSION_KEY, $SETTINGS_KEY, $VEICLE_KEY, $VERSION_BLOCK_KEY } from '../../constants';
import { setCliente } from '../entities/cliente';
import { setObra } from '../entities/obra';
import { setOrder } from '../entities/order';
import { IRegiao } from '../entities/regiao';
import { ISincronizao } from '../entities/sincronizacao';
import BadRequestException from '../exceptions/badRequestException';
import DifferentMobileException from '../exceptions/differentMobileException';
import { IAutenticacaoRepositorio } from '../repositories/autenticacaoRepositorio';

export interface IPegarDadosParams {
  regioes: IRegiao[];
  placa: string;
  placaID: number;
}

export default class PegarDadosUseCase {
  constructor(
    private readonly iAutenticacaoRepositorio: IAutenticacaoRepositorio,
    private readonly iLocalStorage: ILocalStorageConnection,
  ) { }

  async execute(params: IPegarDadosParams): Promise<ISincronizao | Error> {
    try {
      let newRegioes: string = '';

      if (params.regioes && params.regioes.length > 0) {
        params.regioes.forEach((regiao: IRegiao) => {
          newRegioes += `&codigosRegioes=${regiao.codigo}`;
        });
      }

      const response = await this.iAutenticacaoRepositorio.pegarDados(newRegioes, params.placa, params.placaID);

      if (!response || response.request?.status === 0) return ApiException(response);

      switch (response.status) {
        case statusCode.OK: {
          const sincronizacao: ISincronizao = {
            clientes: [],
            balancas: [],
            obrasClientes: [],
            equipamentosClientes: [],
            equipamentosPendentesLiberacao: [],
            equipamentosContratos: [],
            coletasAgendadas: [],
            imobilizados: [],
            motivos: [],
            estadosMTR: [],
            residuos: [],
            residuosBase: [],
            residuosContrato: [],
            rotasColetasAgendadas: [],
            dadosPortalMtr: {
              configuracaoPortalTransportador: [],
              dadosGerador: [],
              dadosTransportador: [],
              estadoFisicoPortal: [],
              formaAcondicionamentoPortal: [],
              formaTratamentoPortal: [],
              residuoPortal: [],
              subGrupoPortal: [],
              unidadePortal: [],
              configuracoesDestinador: [],
              dadosDestinador: [],
              logosEmpresas: [],

            },
            veiculo: {},
            imobilizadosGenericosContratos: [],
          };

          if (!response?.data) return sincronizacao;

          const responseData = JSON.parse(response.data);

          if (responseData.clientes?.length > 0) {
            for await (const cliente of responseData.clientes) {
              sincronizacao?.clientes?.push(setCliente(cliente));
            }
          }

          if (responseData.rotasColetas?.length > 0) {
            sincronizacao.rotasColetasAgendadas = responseData.rotasColetas;
          }

          if (responseData.coletas?.length > 0) {
            for await (const order of responseData.coletas) {
              sincronizacao?.coletasAgendadas?.push(setOrder(order));
            }
          }

          if (responseData.balancas?.length > 0) {
            sincronizacao.balancas = responseData.balancas;
          }

          if (responseData.obrasClientes?.length > 0) {
            for await (const obra of responseData.obrasClientes) {
              sincronizacao?.obrasClientes?.push(setObra(obra));
            }
          }

          if (responseData.equipamentosContratos?.length > 0) {
            sincronizacao.equipamentosContratos = responseData.equipamentosContratos;
          }

          if (responseData.equipamentosPendentesLiberacao?.length > 0) {
            sincronizacao.equipamentosPendentesLiberacao = responseData.equipamentosPendentesLiberacao;
          }

          if (responseData.imobilizadosGenericosContratos?.length > 0) {
            sincronizacao.imobilizadosGenericosContratos = responseData.imobilizadosGenericosContratos;
          }

          if (responseData.equipamentosClientes?.length > 0) {
            sincronizacao.equipamentosClientes = responseData.equipamentosClientes;
          }

          if (responseData.motivos?.length > 0) {
            sincronizacao.motivos = responseData.motivos;
          }

          if (responseData.imobilizados?.length > 0) {
            sincronizacao.imobilizados = responseData.imobilizados;
          }

          if (responseData.residuos?.length > 0) {
            sincronizacao.residuos = responseData.residuos;
          }

          if (responseData.residuosContrato?.length > 0) {
            sincronizacao.residuosContrato = responseData.residuosContrato;
          }

          if (responseData.residuosBase?.length > 0) {
            sincronizacao.residuosBase = responseData.residuosBase;
          }

          if (responseData.estadosMTR?.length > 0) {
            sincronizacao.estadosMTR = responseData.estadosMTR;
          }

          if (responseData.veiculo && responseData.veiculo?.codigo)
            await this.iLocalStorage.setStorageDataObject($VEICLE_KEY, responseData.veiculo);

          if (responseData.versaoRest?.length > 0) {
            await this.iLocalStorage.setStorageDataString($REST_VERSION_KEY, responseData.versaoRest);
          }

          if (responseData.configuracoes) {
            await this.iLocalStorage.setStorageDataObject($SETTINGS_KEY, responseData.configuracoes);

            await this.iLocalStorage.setStorageDataString(
              $VERSION_BLOCK_KEY,
              responseData.configuracoes?.obrigarAtualizarSincronizacao &&
                responseData.versaoRest !== Constants?.manifest?.version
                ? 'BLOQUEAR'
                : '',
            );
          }

          //DADOS PORTAL MTR
          if (responseData.dadosPortalMtr) {
            sincronizacao.dadosPortalMtr = {
              configuracaoPortalTransportador: responseData.dadosPortalMtr?.configuracaoPortalTransportador ?? [],
              dadosGerador: responseData.dadosPortalMtr?.dadosGerador ?? [],
              dadosTransportador: responseData.dadosPortalMtr?.dadosTransportador ?? [],
              estadoFisicoPortal: responseData.dadosPortalMtr?.estadoFisicoPortal ?? [],
              formaAcondicionamentoPortal: responseData.dadosPortalMtr?.formaAcondicionamentoPortal ?? [],
              formaTratamentoPortal: responseData.dadosPortalMtr?.formaTratamentoPortal ?? [],
              residuoPortal: responseData.dadosPortalMtr?.residuoPortal ?? [],
              subGrupoPortal: responseData.dadosPortalMtr?.subGrupoPortal ?? [],
              unidadePortal: responseData.dadosPortalMtr?.unidadePortal ?? [],
              configuracoesDestinador: responseData.dadosPortalMtr?.configuracoesDestinador ?? [],
              dadosDestinador: responseData.dadosPortalMtr?.dadosDestinador ?? [],
              logosEmpresas: responseData.dadosPortalMtr?.logosEmpresas ?? [],
            };
          }

          return sincronizacao;
        }
        case statusCode.BAD_REQUEST:
          return BadRequestException();
        case statusCode.FORBIDDEN:
          return DifferentMobileException();
        default:
          return ApiUnknownException(response);
      }
    } catch (e) {
      return ApiException(e);
    }
  }
}
