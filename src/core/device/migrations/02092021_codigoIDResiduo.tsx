import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function CodigoIDResiduo02092021(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'CD_ID_RESIDUO',
      type: 'INTEGER',
      comment: 'Campo faltante do resíduo para caso tenha na coleta agendada ele deletar de outra tabela no Controller',
    };

    await migration.ADD_COLUMN_TABLE('RESIDUOS', column, 'CodigoIDResiduo02092021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column, 'CodigoIDResiduo02092021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column, 'CodigoIDResiduo02092021');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column, 'CodigoIDResiduo02092021');
  }

  return {
    up,
    down,
  };
}
