import { AxiosRequestHeaders } from 'axios';
import Config from "react-native-config";
import { DEVICE } from '../../device/device';

const DefaultHeader = () => {
  const defaultHeader: AxiosRequestHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Api-Version': String(Config.API_VERSION_KEY ?? ''),
    'Accept-Encoding': 'gzip',
    'App-Version': DEVICE.VERSION,
    'Client-Type': String(Config.APP_SLUG_KEY ?? ''),
    'Device-OS': DEVICE.OS.DEVICENAME,
    'Device-Version': DEVICE.OS.VERSION,
    UUID: DEVICE.UUID
  };

  return {
    defaultHeader,
  };
};

export default DefaultHeader;
