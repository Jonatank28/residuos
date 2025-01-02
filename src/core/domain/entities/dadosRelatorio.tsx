import { IOrder } from "./order";

export interface IDadosRelatorio {
  ultimaSincronizacao?: Date;
  totalOSAgendadas?: number;
  totalOSColetadas?: number;
  totalOSEnviadas?: number;
  historicoEnvioPendentes?: number;
  osExcluidas?: number;
  osEntrega?: number;
  rascunhos?: IOrder[];
}