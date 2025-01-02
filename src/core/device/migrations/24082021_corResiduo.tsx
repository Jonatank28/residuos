import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function CorResiduo24082021(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'DS_COR',
      type: 'TEXT',
      comment: 'Adicionar cor de fundo do resíduo vindo do Controller',
    };

    await migration.ADD_COLUMN_TABLE('RESIDUOS', column, 'CorResiduo24082021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column, 'CorResiduo24082021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column, 'CorResiduo24082021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column, 'CorResiduo24082021');
  }

  return {
    up,
    down,
  };
}
