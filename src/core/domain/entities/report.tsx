export interface IReport {
  title?: string;
  columns?: string[];
  rows?: IRow[];
  colunmsConf?: IColumnConf[];
}

export interface IColumnConf {
  index?: number;
  align?: 'flex-start' | 'center' | 'flex-end';
  flex?: number;
}

type IRow = {}
