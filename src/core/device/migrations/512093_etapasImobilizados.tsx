import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function EtapasImobilizados512093(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'X_ETAPA_PENDENTE',
      type: 'INTEGER',
      comment: 'Mostra se a etapa está pendente no controller',
    };

    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS_CLIENTES', column, 'EtapasImobilizados512093');
    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column, 'EtapasImobilizados512093');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column, 'EtapasImobilizados512093');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS_CONTRATOS', column, 'EtapasImobilizados512093');
  }

  return {
    up,
    down,
  };
}
