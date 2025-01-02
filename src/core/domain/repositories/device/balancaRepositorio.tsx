import { ISQLRows } from "vision-common";
import { IBalanca } from "../../entities/balanca/balanca";

export interface IDeviceBalancaRepositorio {
  criarTabelaBalancas: () => Promise<void>;

  pegarBalancas: () => Promise<ISQLRows<IBalanca>>;

  pegarBalancasCadastradasMobile: () => Promise<ISQLRows<IBalanca>>;

  inserirBalanca(item: IBalanca): Promise<number>;

  editarBalanca(item: IBalanca): Promise<number>;

  deletarBalanca(balancaID: number): Promise<number>;

  deletarBalancasSincronizacao(): Promise<number>;
}
