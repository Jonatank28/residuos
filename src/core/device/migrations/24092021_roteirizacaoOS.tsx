import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function RoteirizacaoOS21092021(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'CD_PONTO',
      type: 'INTEGER',
      comment: 'Código do ponto da roteirização da OS',
    };

    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', column, 'RoteirizacaoOS21092021');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', column, 'RoteirizacaoOS21092021');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', column, 'RoteirizacaoOS21092021');
  }

  return {
    up,
    down,
  };
}
