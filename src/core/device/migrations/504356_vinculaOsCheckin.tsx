import { migration } from '../../../app/utils/migrationResponse';
import { IMigration, ITableColumn } from '../../../app/utils/migrations';

export default function VinculaOsCheckin504356(): IMigration {
    async function down(): Promise<void> { }

    async function up(): Promise<void> {
        const column1: ITableColumn = {
            name: 'NR_ORDEM_SERVICO',
            type: 'INTEGER',
            comment: 'Guarda numero o.s ao fazer o checkin',
        };

        const column2: ITableColumn = {
            name: 'DT_CHEGADA',
            type: 'TEXT',
            comment: 'Guarda hora de chegada.',
        };

        await migration.ADD_COLUMN_TABLE('CLIENTES_CHECKIN_CHECKOUT', column1, 'VinculaOsCheckin504356');
        await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS', column2, 'VinculaOsCheckin504356');
        await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_COLETADAS', column2, 'VinculaOsCheckin504356');
        await migration.ADD_COLUMN_TABLE('ORDEM_SERVICO_AGENDADAS_PENDENTES', column2, 'VinculaOsCheckin504356');
        await migration.ADD_COLUMN_TABLE('RASCUNHOS_ORDEM_SERVICO', column2, 'VinculaOsCheckin504356');
    }

    return {
        up,
        down
    };
}
