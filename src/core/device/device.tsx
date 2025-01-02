import Constants from 'expo-constants';
import * as ExpoDevice from 'expo-device';
import * as ExpoApplication from 'expo-application';
import { Platform } from 'react-native';
import { convertToMB } from '../../app/utils/mixins';

interface IDevice {
  UUID: string;
  VERSION: string;
  BRAND: string;
  OS: {
    NAME: string;
    DEVICENAME: string;
    VERSION: string;
    MODEL: string;
  };
  MEMORY: number;
}

export const inicializedDevice = async (): Promise<IDevice> => {
  DEVICE.BRAND = ExpoDevice?.brand ?? '';
  DEVICE.VERSION = Constants?.manifest?.version ?? '-';
  DEVICE.VERSION = Constants?.manifest?.version ?? '-';
  DEVICE.MEMORY = convertToMB(ExpoDevice?.totalMemory ?? 0);
  DEVICE.UUID = Platform.OS === 'android' ? ExpoApplication?.androidId ?? '-' : (await ExpoApplication.getIosIdForVendorAsync()) ?? '-';
  DEVICE.OS = {
    DEVICENAME: ExpoDevice?.deviceName ?? '',
    MODEL: ExpoDevice?.modelId,
    NAME: ExpoDevice?.osName ?? '-',
    VERSION: ExpoDevice?.osVersion ?? '-'
  }

  return DEVICE;
}

export const DEVICE: IDevice = {
  VERSION: '',
  UUID: '',
  BRAND: '-',
  MEMORY: 0,
  OS: {
    DEVICENAME: '-',
    MODEL: '-',
    NAME: '-',
    VERSION: '-'
  }
}