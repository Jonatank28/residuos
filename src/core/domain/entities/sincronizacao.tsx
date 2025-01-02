import { IVeiculo } from 'vision-common';
import { IBalanca } from './balanca/balanca';
import { ICliente } from './cliente';
import { IEquipamento } from './equipamento';
import { IEstado } from './estado';
import { IImobilizado } from './imobilizado';
import { IMotivo } from './motivo';
import { IObra } from './obra';
import { IOrder } from './order';
import { ISincronizacaoPortal } from './portalMtr/sincronizacaoPortal';
import { IResiduo } from './residuo';
import { IRota } from './rota';
import { IMovimentacaoEtapaEquipamento } from './movimentacaoEtapaEquipamento';
import { IImobilizadoGenericoContrato } from './imobilizadoGenericoContrato';

export interface ISincronizao {
  clientes: ICliente[];
  balancas: IBalanca[];
  obrasClientes: IObra[];
  equipamentosClientes: IEquipamento[];
  equipamentosContratos: IEquipamento[];
  equipamentosPendentesLiberacao: IMovimentacaoEtapaEquipamento[];
  coletasAgendadas: IOrder[];
  motivos: IMotivo[];
  residuos: IResiduo[];
  residuosContrato: IResiduo[];
  residuosBase: IResiduo[];
  imobilizados: IImobilizado[];
  rotasColetasAgendadas: IRota[];
  dadosPortalMtr: ISincronizacaoPortal;
  estadosMTR: IEstado[];
  veiculo: IVeiculo;
  imobilizadosGenericosContratos: IImobilizadoGenericoContrato[];
}
