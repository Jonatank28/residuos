import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function ValorOS501078(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'NR_VALOR_UNITARIO',
      type: 'INTEGER',
      comment: 'Campo que guarda o valor unitário do resíduo',
    };

    await migration.ADD_COLUMN_TABLE('RESIDUOS', column, 'ValorOS501078');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column, 'ValorOS501078');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column, 'ValorOS501078');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column, 'ValorOS501078');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column, 'ValorOS501078');
  }

  return {
    up,
    down
  };
}
