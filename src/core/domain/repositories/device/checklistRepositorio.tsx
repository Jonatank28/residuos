import { ISQLRows } from 'vision-common';
import { IChecklist } from '../../entities/checklist';
import { IGrupo } from '../../entities/grupo';
import { IPergunta } from '../../entities/pergunta';

export interface IDeviceChecklistRepositorio {
  criarTabelaChecklists: () => Promise<void>;

  criarTabelaGruposChecklists: () => Promise<void>;

  criarTabelaPerguntasGruposChecklists: () => Promise<void>;

  inserirChecklist: (checklist: IChecklist, codigoOS: number) => Promise<number>;

  inserirGrupoChecklist: (grupo: IGrupo, codigoVinculo: number | string) => Promise<number>;

  inserirChecklistsSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirGruposChecklistsSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirPerguntaGrupoChecklistSincronizacao: (sqlParams: string) => Promise<ISQLRows<void>>;

  inserirPerguntaGrupoChecklist: (pergunta: IPergunta, codigoVinculo: number | string) => Promise<number>;

  pegarChecklist: (codigoOS: number) => Promise<IChecklist>;

  pegarGruposChecklist: (codigoVinculo: number | string) => Promise<ISQLRows<IGrupo>>;

  pegarPerguntasGrupoChecklist: (codigoVinculo: number | string) => Promise<ISQLRows<IPergunta>>;

  deletarChecklist: (codigoOS: number) => Promise<number>;

  deletarGruposChecklist: (codigoVinculo: number | string) => Promise<number>;

  deletarPerguntasGruposChecklist: (codigoVinculo: number | string) => Promise<number>;
}
