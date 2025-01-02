import { AsyncAxiosConnection } from 'vision-common';
import { IResiduosRepositorio } from '../../domain/repositories/residuosRepositorio';
import { IInserirEquipamentoParams } from '../../domain/usecases/inserirEquipamentoUseCase';
import { IPegarEquipamentosClienteUseCaseParams } from '../../domain/usecases/pegarEquipamentosClienteUseCase';
import { IPegarEquipamentosUseCaseParams } from '../../domain/usecases/pegarEquipamentosUseCase';
import { IPegarResiduosParams } from '../../domain/usecases/pegarResiduosUseCase';
import { IRemoverEquipamentoParams } from '../../domain/usecases/removerEquipamentoUseCase';
import { ISubstituirEquipamentoParams } from '../../domain/usecases/substituirEquipamentoUseCase';
import { IPegarTodosImobilizadosUseCaseParametros } from '../../domain/usecases/device/database/pegarTodosImobilizadosUseCase';

export default class ResiduosRepositorio implements IResiduosRepositorio {
  constructor(private readonly _conn: AsyncAxiosConnection) {}

  async pegarImobilizadosAgendados(codigosOS: string) {
    return this._conn.get(`/residuos/listarImobilizadosAgendados?${codigosOS}`);
  }

  async pegarResiduos(params: IPegarResiduosParams) {
    return this._conn.get(
      `/residuos/listarResiduos?pagina=${params.pagination.page}&pesquisa=${params.pagination.search}&linhas=${params.pagination.amount}&contratoID=${params.contratoID}&clienteID=${params.clienteID}`,
    );
  }

  async pegarEquipamentos(params: IPegarEquipamentosUseCaseParams) {
    return this._conn.post('/residuos/listarEquipamentos', params);
  }
  async pegarTodosImobilizados(params: IPegarTodosImobilizadosUseCaseParametros) {
    const response = await this._conn.get(
      `/residuos/pegarTodosImobilizados?pagina=${params.paginacao.page}&pesquisa=${params.paginacao.search}&linhas=${params.paginacao.amount}`
    );
    return response;
  }

  async pegarEquipamentosCliente(params: IPegarEquipamentosClienteUseCaseParams) {
    return this._conn.get(`/residuos/listarEquipamentosCliente?clienteID=${params.clienteID ?? 0}&obraID=${params?.obraID ?? 0}`);
  }

  async inserirEquipamento(params: IInserirEquipamentoParams) {
    return this._conn.post('/residuos/inserirEquipamento', {
      codigoPlaca: params.placaID,
      ordemServico: params.coleta,
      equipamento: params.equipamento,
    });
  }

  async removerEquipamento(params: IRemoverEquipamentoParams) {
    return this._conn.post('/residuos/removerEquipamento', {
      codigoPlaca: params.placaID,
      codigoOS: params.codigoOS,
      ordemID: params?.ordemID ?? 0,
      equipamento: {
        codigo: params.equipamento?.codigoContainer ?? 0,
        descricao: params.equipamento?.descricaoContainer ?? '',
        codigoMovimentacao: params.equipamento?.codigoMovimentacao ?? 0,
      },
    });
  }

  async substituirEquipamento(params: ISubstituirEquipamentoParams) {
    return this._conn.post('/residuos/substituirEquipamento', {
      codigoPlaca: params.placaID,
      ordemServico: params.ordem,
      equipamento: {
        codigo: params.equipamento.codigoContainer ?? 0,
        descricao: params.equipamento.descricaoContainer ?? '',
        codigoMovimentacao: params.equipamento?.codigoMovimentacao ?? 0,
      },
      novoEquipamento: params.novoEquipamento,
    });
  }
}
