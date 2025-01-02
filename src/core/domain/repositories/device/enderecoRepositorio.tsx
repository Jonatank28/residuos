import { ISQLRows } from 'vision-common';
import { IEndereco } from '../../entities/endereco';
import { IFiltro } from '../../entities/filtro';

export interface IDeviceEnderecoRepositorio {
  criarTabelaEnderecos: () => Promise<void>;

  inserirEndereco: (codigoVinculo: number | string, endereco: IEndereco) => Promise<number>;

  atualizarEndereco: (codigoVinculo: number | string, endereco: IEndereco) => Promise<number>;

  pegarEndereco: (codigoVinculo: number | string) => Promise<IEndereco>;

  deletarEndereco: (codigoVinculo: string | number) => Promise<number>;

  pegarCidadesColetasAgendadas: (placa: string, filtros?: IFiltro) => Promise<ISQLRows<string>>;

  inserirEnderecosSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;
}
