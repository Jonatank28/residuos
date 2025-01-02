/* eslint-disable camelcase */
export interface IMigration {
  up: () => Promise<void>;

  down: () => Promise<void>;
}

export interface IInitMigration {
  inicialize: Function[]
}

export interface ITableColumn {
  name: string;
  type: ColumnTypes;
  default?: string;
  notNull?: boolean;
  length?: string;
  comment?: string;
}

export interface ITableRef {
  cid: number,
  dflt_value: any,
  name: string,
  notnull: number,
  pk: number,
  type: string,
}

export type ColumnTypes = 'TEXT' | 'NUMERIC' | 'INTEGER' | 'REAL' | 'BLOB';
