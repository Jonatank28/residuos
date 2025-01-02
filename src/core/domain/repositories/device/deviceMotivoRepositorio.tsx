import { ISQLRows } from 'vision-common';
import { IMotivo } from '../../entities/motivo';
import { IMotivoRecusaAssinatura } from '../../entities/motivoRecusaAssinatura';

export interface IDeviceMotivoRepositorio {
  criarTabelaMotivos: () => Promise<void>;

  criarTabelaMotivosRecusaAssinatura: () => Promise<void>;

  inserirMotivo: (motivo: IMotivo, codigoVinculo: string | number | null) => Promise<number>;

  inserirMotivoRecusaAssinatura: (motivoRecusa: IMotivoRecusaAssinatura, codigoVinculo: string | number) => Promise<number>;

  pegarMotivo: (codigoVinculo: number | string) => Promise<IMotivo>;

  pegarMotivos: () => Promise<ISQLRows<IMotivo>>;

  pegarMotivoRecusaAssinatura: (codigoVinculo: number | string) => Promise<IMotivoRecusaAssinatura>;

  atualizarMotivo: (motivo: IMotivo, codigoVinculo: number | string) => Promise<number>;

  deletarMotivo: (codigoVinculo: number | string) => Promise<number>;

  deletarMotivos: () => Promise<number>;

  deletarMotivoRecusaAssinatura: (codigoVinculo: number | string) => Promise<number>;
}
