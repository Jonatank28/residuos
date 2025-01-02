import { ApiException, IPaginationParams, IPaginationResponse } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IResiduo } from '../../../entities/residuo';
import { IDeviceResiduoRepositorio } from '../../../repositories/device/residuoRepositorio';

export interface IPegarTodosResiduosParams {
  pagination: IPaginationParams;
  contratoID: number;
  clienteID: number;
  imobilizadoGenerico: boolean;
}

export default class PegarTodosResiduosUseCase
  implements UseCase<IPegarTodosResiduosParams, IPaginationResponse<IResiduo> | Error>
{
  constructor(private readonly iResiduoRepositorio: IDeviceResiduoRepositorio) {}

  async execute(params: IPegarTodosResiduosParams): Promise<IPaginationResponse<IResiduo> | Error> {
    try {
      let items: IResiduo[] = [];
      let totalPaginas = 0;
      let residuosList: IResiduo[] = [];
      let responseServico: IResiduo[] = [];

      const totalLinhas = await this.iResiduoRepositorio.pegarTotalLinhasResiduos();

      const response = await this.iResiduoRepositorio.pegarResiduosSemVinculo(params.pagination);
      const responseResiduosBase = await this.iResiduoRepositorio.pegarResiduosBase(); // PEGAR TODA A TABELA RESIDUOS_BASE
      const residuosServicosCliente = await this.iResiduoRepositorio.pegarResiduosContratoServico(params.clienteID); // PEGAR RESIDUOS TABELA RESIDUOS_CONTRATO // FILTRO CLIENTE E X_RESIDUO = 0

      if (totalLinhas && totalLinhas !== 0 && response.length > 0) {
        totalPaginas = Math.ceil(totalLinhas / params.pagination.amount);
        items = response._array;
      } else {
        // SOMENTE TABELA RESIDUOS CONTRATO
        if (params.contratoID && params.contratoID !== 0) {
          const responseResiduosComContratoOrSemContrato = await this.iResiduoRepositorio.pegarResiduosPeloContratoOrSemContrato(
            params.clienteID,
            params.contratoID,
          ); // VEM DA TABELA // FILTRAR POR CODIGO_CLIENTE E X_RESIDUO = 1 // CONTRATOID OR IS NULL

          if (responseResiduosComContratoOrSemContrato.length > 0) {
            residuosList = responseResiduosComContratoOrSemContrato._array;
          }

          const responseResiduosComContratoServido = await this.iResiduoRepositorio.pegarResiduosComContratoServico(
            params.clienteID,
            params.contratoID,
          ); // VEM DA TABELA // FILTRAR POR CODIGO_CLIENTE E X_RESIDUO = 0 // CONTRATOID

          if (responseResiduosComContratoServido.length > 0) {
            responseServico = responseResiduosComContratoServido._array;
          }
        } else {
          const responseResiduosSemContratoPorCliente = await this.iResiduoRepositorio.pegarResiduosSemContratoPorClienteServico(
            params.clienteID,
          ); // VEM DA TABELA // FILTRAR POR CODIGO_CLIENTE E X_RESIDUO // CONTRATOID IS NULL

          if (responseResiduosSemContratoPorCliente.length > 0) {
            residuosList = responseResiduosSemContratoPorCliente._array;
          }
        }

        // TABELA RESIDUOS_BASE
        if (params.contratoID && params.contratoID !== 0 && responseResiduosBase.length > 0) {
          // FILTRA OS RESÍDUOS PELO SERVIÇO DO CONTRATO
          responseServico.forEach(residuoServico => {
            responseResiduosBase._array.forEach(residuoBase => {
              if (residuoServico.codigoServico === residuoBase.codigoServico) {
                residuosList.push(residuoBase);
              }
            });
          });
        }

        // FILTRA OS RESÍDUOS PELO SERVIÇO DO CLIENTE
        if (responseResiduosBase.length > 0 && residuosServicosCliente.length > 0) {
          residuosServicosCliente._array.forEach(residuoServicoCliente => {
            responseResiduosBase._array.forEach(residuoBase => {
              if (residuoServicoCliente.codigoServico === residuoBase.codigoServico) {
                residuosList.push(residuoBase);
              }
            });
          });
        }

        // REMOVE OS RESÍDUOS DUPLICADOS
        var semReplicados: IResiduo[] = [
          ...residuosList.reduce((map, residuo) => map.set(residuo.codigo, residuo), new Map()).values(),
        ];

        // REMOVE RESIDUOS/IMOBILIZADOS GENÉRICOS
        semReplicados = semReplicados.filter(_residuo => !_residuo.xImobilizadoGenerico || _residuo.xImobilizadoGenerico === null);

        let countPesquisa = 0;
        for (let i = countPesquisa; i < semReplicados.length; i += 1) {
          if (semReplicados && semReplicados[i] && semReplicados[i]?.codigo) {
            semReplicados[i].xExigeInteiro = !!semReplicados[i].xExigeInteiro;
            semReplicados[i].excesso = !!semReplicados[i].excesso;
            semReplicados[i].naoConforme = !!semReplicados[i].naoConforme;

            if (params.pagination.search && params.pagination.search.length > 0) {
              if (semReplicados[i].codigo === Number(params.pagination.search)) {
                items.push(semReplicados[i]);
              } else if (
                // @ts-ignore
                semReplicados[i].descricao.toLocaleLowerCase().search(params.pagination.search.toLocaleLowerCase()) > -1
              ) {
                items.push(semReplicados[i]);
              }
            } else {
              items.push(semReplicados[i]);
            }
          }
          countPesquisa += 1;
        }

        semReplicados = [];
        semReplicados = [...items];
        items = [];

        // PAGINAÇÃO DOS RESÍDUOS E PESQUISA DOS RESÍDUOS
        let count = params.pagination.page * params.pagination.amount - params.pagination.amount;
        const delimiter = count + params.pagination.amount;
        totalPaginas = Math.ceil(semReplicados.length / params.pagination.amount);

        if (params.pagination.page <= totalPaginas) {
          for (let i = count; i < delimiter; i += 1) {
            if (semReplicados && semReplicados[i] && semReplicados[i]?.codigo) {
              semReplicados[i].xExigeInteiro = !!semReplicados[i].xExigeInteiro;
              semReplicados[i].excesso = !!semReplicados[i].excesso;
              semReplicados[i].naoConforme = !!semReplicados[i].naoConforme;

              if (params.pagination.search && params.pagination.search.length > 0) {
                if (semReplicados[i].codigo === Number(params.pagination.search)) {
                  items.push(semReplicados[i]);
                } else if (
                  // @ts-ignore
                  semReplicados[i].descricao.toLocaleLowerCase().search(params.pagination.search.toLocaleLowerCase()) > -1
                ) {
                  items.push(semReplicados[i]);
                }
              } else {
                items.push(semReplicados[i]);
              }
            }

            count += 1;
          }
        }
      }

      return {
        ...params.pagination,
        items,
        pages: totalPaginas ?? 0,
        length: totalLinhas ?? 0,
      };
    } catch (e) {
      return ApiException(e);
    }
  }
}
