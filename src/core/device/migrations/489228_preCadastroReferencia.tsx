import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function PreCadastroReferencia489228(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'X_SERVICO_PRE_CADASTRO_REFERENCIA',
      type: 'INTEGER',
      comment: 'Permite alterar quantidade ou restringir quantidade.',
    };

    await migration.ADD_COLUMN_TABLE('RESIDUOS', column, 'PreCadastroReferencia489228');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column, 'PreCadastroReferencia489228');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column, 'PreCadastroReferencia489228');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column, 'PreCadastroReferencia489228');
  }

  return {
    up,
    down,
  };
}