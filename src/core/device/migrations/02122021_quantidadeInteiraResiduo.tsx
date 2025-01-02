import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function QuantidadeInteiraResiduo02122021(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'X_EXIGE_INTEIRO',
      type: 'INTEGER',
      comment: 'Campo que exige quantidade inteira no resíduo',
    };

    await migration.ADD_COLUMN_TABLE('RESIDUOS', column, 'QuantidadeInteiraResiduo02122021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column, 'QuantidadeInteiraResiduo02122021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column, 'QuantidadeInteiraResiduo02122021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column, 'QuantidadeInteiraResiduo02122021');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column, 'QuantidadeInteiraResiduo02122021');
  }

  return {
    up,
    down,
  };
}
