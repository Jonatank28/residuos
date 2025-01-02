import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function PeriodicidadeOS10122021(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'DS_PERIODICIDADE',
      type: 'TEXT',
      comment: 'Adicionar campo periodicidade vindo do Controller, exemplo: semanal / mensal',
    };

    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', column, 'PeriodicidadeOS10122021');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', column, 'PeriodicidadeOS10122021');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', column, 'PeriodicidadeOS10122021');
    await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', column, 'PeriodicidadeOS10122021');
  }

  return {
    up,
    down,
  };
}
