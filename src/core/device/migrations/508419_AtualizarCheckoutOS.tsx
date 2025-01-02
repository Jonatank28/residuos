import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function AtualizarCheckoutOS508419(): IMigration {
  async function down(): Promise<void> {}

  async function up(): Promise<void> {
    const columnXSincronizado: ITableColumn = {
      name: 'X_SINCRONIZADO',
      type: 'INTEGER',
      comment: 'Campo para saber se aquele checkout já foi sincronizado no controller',
    };

    const columnNrInicioKM: ITableColumn = {
      name: 'NR_KM_INICIAL',
      type: 'REAL',
      comment: 'Campo para informar o KM Inicial da coleta',
    };

    const columnNrFimKM: ITableColumn = {
      name: 'NR_KM_FINAL',
      type: 'REAL',
      comment: 'Campo para informar o KM final da coleta',
    };

    await migration.ADD_COLUMN_TABLE('CLIENTES_CHECKIN_CHECKOUT', columnXSincronizado, 'AtualizarCheckoutOS508419');

    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', columnNrInicioKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('NOVAS_COLETAS', columnNrInicioKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', columnNrInicioKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', columnNrInicioKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', columnNrInicioKM, 'AtualizarCheckoutOS508419');

    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', columnNrFimKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('NOVAS_COLETAS', columnNrFimKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', columnNrFimKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', columnNrFimKM, 'AtualizarCheckoutOS508419');
    await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', columnNrFimKM, 'AtualizarCheckoutOS508419');
  }

  return {
    up,
    down,
  };
}
