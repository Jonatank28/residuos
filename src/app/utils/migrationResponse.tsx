/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
import database from '../../core/database';
import { ITableColumn, ITableRef } from './migrations';

export const migration = {
  EXECUTE_QUERY: (SQL: string, migrationName: string) => executeQUERY(SQL, migrationName),
  RENAME_TABLE: (table: string, newTable: string, migrationName: string) => executeRenameTable(table, newTable, migrationName),
  ADD_COLUMN_TABLE: (table: string, column: ITableColumn, migrationName: string) => executeAddColumn(table, column, migrationName),
  DROP_TABLE: (table: string, migrationName: string) => executeDropTable(table, migrationName),
};

function executeQUERY(SQL: string, migrationName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      database.transaction((tx) => tx.executeSql(
        SQL,
        [],
        (_, _success) => {
          return resolve();
        },
        // @ts-ignore
        (_, error) => {
          console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
          return reject();
        },
      ));
    } catch (error) {
      console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
      return reject();
    }
  });
}

function executeRenameTable(table: string, newTable: string, migrationName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (table !== newTable) {
        const SQL = `ALTER TABLE ${table} RENAME TO ${newTable}`;

        database.transaction((tx) => tx.executeSql(
          SQL,
          [],
          (_, _success) => {
            // console.log(`migration ${migrationName} executada com sucesso!`);
            return resolve();
          },
          // @ts-ignore
          (_, error) => {
            console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
            return reject();
          },
        ));
      }
    } catch (error) {
      console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
      return reject();
    }
  });
}

function executeAddColumn(table: string, column: ITableColumn, migrationName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      database.transaction((tx) => tx.executeSql(
        `PRAGMA table_info(${table})`,
        [],
        (transaction, { rows }: any) => {
          {
            const ref: ITableRef[] = rows._array;
            const exist = ref.some((tableRef) => tableRef.name === column.name);

            if (!exist) {
              const SQL = `ALTER TABLE ${table} ADD COLUMN ${column.name} ${column.type} ${column?.notNull ? `NOT NULL ${column?.default ?? ''}` : ''}`;

              return transaction.executeSql(
                SQL,
                [],
                (_, _success) => {
                  // console.log(`migration ${migrationName} executada com sucesso!`);
                  return resolve();
                },
                // @ts-ignore
                (_, error) => {
                  console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
                  return reject();
                },
              );
            }

            // console.log(`migration ${migrationName} executada com sucesso!`);
          }

          return resolve();
        },
        // @ts-ignore
        (_, error) => {
          console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
          return reject();
        },
      ));
    } catch (error) {
      console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
      return reject();
    }
  });
}

function executeDropTable(table: string, migrationName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const SQL = `DROP TABLE IF EXISTS ${table}`;

      database.transaction((tx) => {
        tx.executeSql(
          SQL,
          [],
          (_, _success) => {
            // console.log(`migration ${migrationName} executada com sucesso!`);
            return resolve();
          },
          // @ts-ignore
          (_, error) => {
            console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
            return reject();
          },
        );
      });
    } catch (error) {
      console.log(`Erro ao tentar executar a migration ${migrationName}:`, error);
      return reject();
    }
  });
}
