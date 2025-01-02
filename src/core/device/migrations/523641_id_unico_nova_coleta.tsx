import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function IdUnicoNovaColeta523641(): IMigration {
  async function down(): Promise<void> {}

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'CD_ID_UNICO',
      type: 'TEXT',
      comment: 'Código de identificação único da coleta',
    };

    await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', column, 'IdUnicoNovaColeta523641');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', column, 'IdUnicoNovaColeta523641');
    await migration.ADD_COLUMN_TABLE('NOVAS_COLETAS', column, 'IdUnicoNovaColeta523641');
  }

  return {
    up,
    down,
  };
}
