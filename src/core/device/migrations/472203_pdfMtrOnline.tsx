import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function PDFMtrOnline472203(): IMigration {
  async function down(): Promise<void> { }

  async function up(): Promise<void> {
    const column: ITableColumn = {
      name: 'BASE64_MTR_ONLINE',
      type: 'TEXT',
      comment: 'Campo para gravar PDF do MTR online gerado',
    };

    const columnCelularCliente: ITableColumn = {
      name: 'DS_CELULAR',
      type: 'TEXT',
      comment: 'Campo para gravar celular do cliente',
    };

    const columnVinculoOrdemPendente: ITableColumn = {
      name: 'DS_VINCULO',
      type: 'TEXT',
      comment: 'Campo para gravar vinculo coleta',
    };

    const columnDestinadorOS: ITableColumn = {
      name: 'CD_DESTINADOR',
      type: 'INTEGER',
      comment: 'Campo para gravar o destinador da OS',
    };

    const columnCodigoIbama: ITableColumn = {
      name: 'CD_IBAMA',
      type: 'TEXT',
      comment: 'Campo para gravar o código Ibama do resíduo',
    };

    const columnCodigoEstadoFisico: ITableColumn = {
      name: 'CD_ESTADO_FISICO',
      type: 'INTEGER',
      comment: 'Campo para gravar o código do estado fisíco resíduo',
    };

    const columnCodigoSubGrupo: ITableColumn = {
      name: 'CD_SUB_GRUPO',
      type: 'INTEGER',
      comment: 'Campo para gravar o código do subgrupo resíduo',
    };

    const columnCodigoAcondicionamento: ITableColumn = {
      name: 'CD_ACONDICIONAMENTO',
      type: 'INTEGER',
      comment: 'Campo para gravar o código acondicionamento resíduo',
    };

    const columnCodigoUnidade: ITableColumn = {
      name: 'CD_UNIDADE',
      type: 'INTEGER',
      comment: 'Campo para gravar o código da unidade resíduo',
    };

    const columnCodigoFormaTratamento: ITableColumn = {
      name: 'CD_FORMA_TRATAMENTO',
      type: 'INTEGER',
      comment: 'Campo para gravar o código da forma de tratamento resíduo',
    };

    const columnCodigoEmpresa: ITableColumn = {
      name: 'CD_EMPRESA',
      type: 'INTEGER',
      comment: 'Campo para gravar o código da empresa',
    };

    const columnVinculoOS: ITableColumn = {
      name: 'DS_VINCULO',
      type: 'TEXT',
      comment: 'Campo para gravar o vínculo da OS',
    };

    await migration.ADD_COLUMN_TABLE('MTRS_SINIR_ORDEM_SERVICO', column, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('CLIENTES', columnCelularCliente, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', columnVinculoOrdemPendente, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', columnDestinadorOS, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', columnDestinadorOS, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', columnDestinadorOS, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('OBRAS', columnDestinadorOS, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('RESIDUOS', columnCodigoIbama, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', columnCodigoEstadoFisico, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', columnCodigoSubGrupo, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', columnCodigoAcondicionamento, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', columnCodigoUnidade, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', columnCodigoFormaTratamento, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS', {
      name: 'CD_HASH_RESIDUO',
      type: 'TEXT',
      comment: 'Campo para gravar o hash do resíduo',
    }, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', {
      name: 'CD_HASH_RESIDUO',
      type: 'TEXT',
      comment: 'Campo para gravar o hash do resíduo',
    }, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', {
      name: 'CD_HASH_RESIDUO',
      type: 'TEXT',
      comment: 'Campo para gravar o hash do resíduo',
    }, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', columnCodigoIbama, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', columnCodigoEstadoFisico, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', columnCodigoSubGrupo, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', columnCodigoAcondicionamento, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', columnCodigoUnidade, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', columnCodigoFormaTratamento, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_SECUNDARIOS_PESAGEM', {
      name: 'CD_HASH_RESIDUO',
      type: 'TEXT',
      comment: 'Campo para gravar o hash do resíduo',
    }, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', columnCodigoIbama, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', columnCodigoEstadoFisico, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', columnCodigoSubGrupo, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', columnCodigoAcondicionamento, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', columnCodigoUnidade, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_CONTRATO', columnCodigoFormaTratamento, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', columnCodigoIbama, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', columnCodigoEstadoFisico, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', columnCodigoSubGrupo, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', columnCodigoAcondicionamento, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', columnCodigoUnidade, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RESIDUOS_BASE', columnCodigoFormaTratamento, 'PDFMtrOnline472203');

    // CD_EMPRESA para vinculo logo MTR
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', columnCodigoEmpresa, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', columnCodigoEmpresa, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', columnCodigoEmpresa, 'PDFMtrOnline472203');


    // RASCUNHO
    await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', columnCodigoEmpresa, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', columnDestinadorOS, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('NOVAS_COLETAS', columnCodigoEmpresa, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('NOVAS_COLETAS', columnDestinadorOS, 'PDFMtrOnline472203');
    
    await migration.ADD_COLUMN_TABLE('OBRAS', columnCodigoEmpresa, 'PDFMtrOnline472203');

    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', columnVinculoOS, 'PDFMtrOnline472203');
    await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', columnVinculoOS, 'PDFMtrOnline472203');
  }

  return { 
    up,
    down,
  };
}
