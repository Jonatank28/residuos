import * as SQLite from 'expo-sqlite';
import Config from "react-native-config";

const db = SQLite.openDatabase(`${Config.APP_DATABASE_V1_KEY}.db`);

db.exec([{
  sql: `
    PRAGMA FOREIGN_KEYS = ON;
    PRAGMA JOURNAL_MODE = WAL;
    PRAGMA CACHE_SIZE   = 10000;
    PRAGMA SYNCHRONOUS  = NORMAL;
  `,
  args: [],
}], false, () => console.log('CONFIGURAÇÕES BANCO OK'));

export default db;
