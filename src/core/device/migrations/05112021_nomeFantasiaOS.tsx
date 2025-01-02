import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function NomeFantasiaOS05112021(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'DS_CLIENTE_FANTASIA',
      type: 'TEXT',
      comment: 'Nome fantasia cliente da OS',
    };

    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', column, 'NomeFantasiaOS05112021');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', column, 'NomeFantasiaOS05112021');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', column, 'NomeFantasiaOS05112021');
    await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', column, 'NomeFantasiaOS05112021');
  }

  return {
    up,
    down,
  };
}
