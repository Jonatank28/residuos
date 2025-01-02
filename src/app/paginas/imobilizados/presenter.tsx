import { AsyncAxiosConnection } from 'vision-common';
import axiosClient from '../../../core/axios';
import ResiduosRepositorio from '../../../core/data/repositories/residuosRepositorio';
import { IResiduosRepositorio } from '../../../core/domain/repositories/residuosRepositorio';
import PegarImobilizadosAgendadosUseCase from '../../../core/domain/usecases/pegarImobilizadosAgendadosUseCase';

export default class ImobilizadosPresenter {
  private readonly iResiduosRepositorio: IResiduosRepositorio;

  private readonly pegarImobilizadosAgendadosUseCase: PegarImobilizadosAgendadosUseCase;

  constructor() {
    this.iResiduosRepositorio = new ResiduosRepositorio(new AsyncAxiosConnection(axiosClient));

    this.pegarImobilizadosAgendadosUseCase = new PegarImobilizadosAgendadosUseCase(this.iResiduosRepositorio);
  }

  pegarImobilizados = async (codigosOS: string) => this.pegarImobilizadosAgendadosUseCase.execute(codigosOS);
}
