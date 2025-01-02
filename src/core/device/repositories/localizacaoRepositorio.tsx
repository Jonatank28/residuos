import * as Location from 'expo-location';
import { AsyncSQLiteConnection, ILocation } from 'vision-common';
import { IDeviceLocalizacaoRepositorio } from '../../domain/repositories/device/localizacaoRepositorio';

export default class DeviceLocalizacaoRepositorio implements IDeviceLocalizacaoRepositorio {

  constructor(private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaLocation() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS LOCATION (
        CD_ID                       INTEGER PRIMARY KEY AUTOINCREMENT,
        NR_LATITUDE					        REAL NOT NULL,
        NR_LONGITUDE				        REAL NOT NULL,
        NR_ALTITUDE				          REAL NULL,
        NR_ACCURACY                 REAL NULL,
        NR_ALTITUDE_ACURRACY        REAL NULL,
        NR_VELOCIDADE               REAL NULL,
        DT_CADASTRO               	DATE NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO            	DATE NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME'))
      )`,
      'LOCATION'
    );

    return response;
  }

  async inserirLocation(location: ILocation) {
    const response = await this._conn.insert(
      `INSERT INTO LOCATION (
        NR_LATITUDE,
        NR_LONGITUDE,
        NR_ALTITUDE,
        NR_ACCURACY,
        NR_ALTITUDE_ACURRACY,
        NR_VELOCIDADE
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        location.latitude,
        location.longitude,
        location.altitude,
        location.accuracy,
        location.altitudeAcurracy,
        location.velocidade
      ]
    );

    return response;
  }

  async verificaPermissaoLocalizacao() {
    const { status } = await Location.getForegroundPermissionsAsync();
    console.log('Permissão de localização: ', status);
    return !!(status === 'granted');
  };

  async requisitaPermissaoLocalizacao() {
    await Location.requestForegroundPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();
  };

  async pegarLocalizacaoAtual() {
    let { granted } = await Location.getForegroundPermissionsAsync();
    const hasLocation = await Location.hasServicesEnabledAsync();
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();

    if (!granted) {
      granted = (await Location.requestBackgroundPermissionsAsync()).granted;
    }

    if (!locationServicesEnabled) {
      await Location.enableNetworkProviderAsync();
    } else if (granted && hasLocation) {
      const response = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return response;
    }

    return null;
  };
}
