import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function SomanteEquipamentosPontoColeta495995(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'CD_OBRA',
      type: 'INTEGER',
      comment: 'Campo para guardar código obra do equipamento',
    };

    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS_CLIENTES', column, 'SomanteEquipamentosPontoColeta495995');
    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column, 'SomanteEquipamentosPontoColeta495995');
  }

  return {
    up,
    down
  };
}
