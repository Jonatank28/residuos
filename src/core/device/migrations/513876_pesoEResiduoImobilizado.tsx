import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function PesoEResiduoImobilizado513876(): IMigration {
  async function down(): Promise<void> {}

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'X_PESO_E_RESIDUO_DO_IMOBILIZADO',
      type: 'INTEGER',
      comment: 'Campo para verificar se imobilizado usa peso no resíduo',
    };
    const column1: ITableColumn = {
      name: 'CD_IMOBILIZADO_GENERICO',
      type: 'INTEGER',
      comment: '',
    };
    const column2: ITableColumn = {
      name: 'NR_PESO_BRUTO',
      type: 'INTEGER',
      comment: '',
    };
    const column3: ITableColumn = {
      name: 'NR_CUBAGEM',
      type: 'INTEGER',
      comment: '',
    };
    const column4: ITableColumn = {
      name: 'X_IMOBILIZADO_GENERICO',
      type: 'INTEGER',
      comment: '',
    };
    const column5: ITableColumn = {
      name: 'CD_IMOBILIZADO_REAL',
      type: 'INTEGER',
      comment: '',
    };
    const column6: ITableColumn = {
      name: 'NR_PESO_BRUTO_TARA',
      type: 'INTEGER',
      comment: '',
    };

    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column1, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column2, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column3, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('EQUIPAMENTOS', column6, 'PesoEResiduoImobilizado513876');

    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column1, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column2, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column3, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS', column6, 'PesoEResiduoImobilizado513876');

    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS_CONTRATOS', column, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS_CONTRATOS', column1, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS_CONTRATOS', column2, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS_CONTRATOS', column3, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('IMOBILIZADOS_CONTRATOS', column6, 'PesoEResiduoImobilizado513876');

    await migration.ADD_COLUMN_TABLE('RESIDUOS', column, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', column1, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', column2, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', column3, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', column4, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', column5, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', column6, 'PesoEResiduoImobilizado513876');
    
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column1, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column2, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column3, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column4, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column5, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', column6, 'PesoEResiduoImobilizado513876');
    
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column1, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column2, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column3, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column4, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column5, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', column6, 'PesoEResiduoImobilizado513876');
    
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column1, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column2, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column3, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column4, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column5, 'PesoEResiduoImobilizado513876');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', column6, 'PesoEResiduoImobilizado513876');
  }

  return {
    up,
    down,
  };
}
