import { ISQLRows } from 'vision-common';
import { IAuditoria } from '../../entities/auditoria';
import { IDadosDispositivo } from '../../entities/dadosDispositivo';
import { IDadosRelatorio } from '../../entities/dadosRelatorio';

export interface IDeviceAuditoriaRepositorio {
  criarTabelaAuditoria: () => Promise<void>;

  inserirAuditoria: (auditoria: IAuditoria) => Promise<number>;

  pegarAuditorias: (limite: number, offset: number) => Promise<ISQLRows<IAuditoria>>;

  verificaAuditoriaGravada: (auditoria: IAuditoria) => Promise<ISQLRows<IAuditoria>>;

  deletarAuditorias: () => Promise<number>;

  pegarDadosTotaisDispositivo: (placa: string) => Promise<IDadosDispositivo>;

  pegarDadosTotaisRelatorio: (placa: string) => Promise<IDadosRelatorio>;
}
