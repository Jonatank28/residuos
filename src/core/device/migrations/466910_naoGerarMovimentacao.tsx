import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function NaoGerarMovimentacao466910(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'X_NAO_GERAR_MOVIMENTACAO',
      type: 'INTEGER',
      comment: 'Campo para verificar a geração de movimentação de OS no Controller',
    };

    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column, 'NaoGerarMovimentacao466910');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column, 'NaoGerarMovimentacao466910');
  }

  return {
    up,
    down
  };
}
