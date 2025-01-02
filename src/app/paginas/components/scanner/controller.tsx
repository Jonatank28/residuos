import * as React from 'react';
import { Orientation } from 'vision-common';
import { BarCodeType, RNCamera } from 'react-native-camera';
import { AuthRoutes } from '../../../routes/routes';
import { IControllerAuth } from '../../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.Scanner> { }

export default function Controller({ navigation, params }: Props) {
  const [type] = React.useState<Array<keyof BarCodeType>>(params.scanType === 'qr'
    ? [
      RNCamera.Constants.BarCodeType.qr,
      RNCamera.Constants.BarCodeType.pdf417,
    ]
    : [
      RNCamera.Constants.BarCodeType.code39,
      RNCamera.Constants.BarCodeType.code128,
      RNCamera.Constants.BarCodeType.code39mod43,
      RNCamera.Constants.BarCodeType.code93,
    ]);
  const [scanned, setScanned] = React.useState<boolean>(false);
  const [changeColor, setChangeColor] = React.useState<boolean>(false);
  const [data, setData] = React.useState<string>('');

  const scanearNovamente = () => {
    setData('');
    setScanned(false);
  };

  const handleBarCodeScanned = ({ data }: any) => {
    setScanned(true);
    setData(data);
  };

  React.useEffect(() => {
    if (params.scanType === 'code39') {
      const timeout = setTimeout(() => setChangeColor(!changeColor), 1000);

      return () => {
        clearTimeout(timeout);
      };
    }

    return () => { };
  }, [changeColor]);

  const navigateToScreen = () => navigation.navigate<any>(params.screen, { scanData: data });

  const goBack = () => navigation.goBack();

  React.useEffect(() => {
    (async () => {
      if (params.scanType === 'code39') {
        await Orientation.allowLandScapeOnly();
      }
    })();
  }, []);

  return {
    data,
    type,
    scanned,
    changeColor,
    goBack,
    scanearNovamente,
    navigateToScreen,
    handleBarCodeScanned
  };
}
