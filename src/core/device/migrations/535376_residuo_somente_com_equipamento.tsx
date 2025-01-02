import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function ResiduoSomenteComEquipamento535376(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'X_COLETAR_SOMENTE_COM_EQUIPAMENTO',
      type: 'INTEGER',
      comment: 'Marcador para validar se resíduo está sendo coletado com um equipamento movimentado',
    };

    await migration.ADD_COLUMN_TABLE('RESIDUOS', column, 'ResiduoSomenteComEquipamento535376');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column, 'ResiduoSomenteComEquipamento535376');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column, 'ResiduoSomenteComEquipamento535376');
  }

  return {
    up,
    down,
  };
}
