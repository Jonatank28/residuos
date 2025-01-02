import * as React from 'react';
import I18n from 'i18n-js';
import { useVSSnack, IPhoto, ILocalStorageConnection } from 'vision-common';
import { IResiduo } from '../../../../core/domain/entities/residuo';
import { IControllerAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import { useUser } from '../../../contextos/usuarioContexto';
import Decimal from 'decimal.js';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import { IConfiguracao } from '../../../../core/domain/entities/configuracao';
import { $SETTINGS_KEY } from '../../../../core/constants';

interface Props extends IControllerAuth<AuthRoutes.DetalhesDoResiduoLocal> {}

export default function Controller({ params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { configuracoes } = useUser();
  const [residuo, setResiduo] = React.useState<IResiduo>({});
  const [foto, setFoto] = React.useState<IPhoto>({});
  const [visivel, setVisivel] = React.useState<boolean>(false);
  const [numeroCasasDecimais, setNumeroCasasDecimais] = React.useState<number>(2);

  const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();

  const pegarNumeroCasasDecimais = async () => {
    const response = await iLocalStorageConnection.getStorageDataObject<IConfiguracao>($SETTINGS_KEY);
    setNumeroCasasDecimais(response?.numeroCasasDecimaisResiduos ?? 2);
  };

  React.useEffect(() => {
    pegarNumeroCasasDecimais();
  }, []);

  React.useEffect(() => {
    if (params.residuo && params.residuo.codigo) {
      setResiduo(params.residuo);
    }
  }, [params.residuo]);

  const contarCasasDecimais = (numeroStr: string): number => {
    return numeroCasasDecimais ?? 2;
  };

  const calculaPesoBruto = () => {
    const pesoBrutoString = String(residuo?.pesoBruto ?? 0);
    const pesoBruto = new Decimal(pesoBrutoString.replace(',', '.'));
    const casasDecimais = contarCasasDecimais(pesoBrutoString);

    if (casasDecimais > 0) {
      return pesoBruto.toFixed(casasDecimais);
    }

    return pesoBruto.toString();
  };

  const calculaPesoLiquido = () => {
    const pesoBrutoString = String(residuo?.pesoBruto ?? 0);
    const taraString = String(residuo.tara ?? 0);
    const casasDecimais = contarCasasDecimais(pesoBrutoString);

    const pesoBruto = new Decimal(pesoBrutoString.replace(',', '.'));
    const tara = new Decimal(taraString.replace(',', '.'));
    const pesoLiquido = pesoBruto.minus(tara).abs();

    if (pesoLiquido.isNaN()) return new Decimal(0);

    if (casasDecimais > 0) {
      return pesoLiquido.toFixed(casasDecimais);
    }

    return pesoLiquido.toString();
  };

  const calculaTara = () => {
    const pesoTaraString = String(residuo?.tara ?? 0);
    const casasDecimais = contarCasasDecimais(pesoTaraString);
    const tara = new Decimal(pesoTaraString.replace(',', '.'));

    if (casasDecimais > 0) {
      return tara.toFixed(casasDecimais);
    }

    return tara.toString();
  };

  const calculaPesoExcesso = () => {
    const cubagemString = String(residuo?.cubagem ?? 0);
    const pesoBrutoString = String(residuo?.pesoBruto ?? 0);
    const taraString = String(residuo.tara ?? 0);
    const casasDecimais = contarCasasDecimais(pesoBrutoString);

    const cubagem = new Decimal(cubagemString.replace(',', '.'));
    const pesoBruto = new Decimal(pesoBrutoString.replace(',', '.'));
    const tara = new Decimal(taraString.replace(',', '.'));

    const pesoLiquido = pesoBruto.minus(tara).abs();

    if (pesoLiquido.isNaN()) return new Decimal(0);

    if (pesoLiquido.gt(cubagem)) {
      const excesso = cubagem.minus(pesoLiquido).abs();

      if (casasDecimais > 0) {
        return excesso.toFixed(casasDecimais);
      }

      return excesso.toString();
    }

    return 0;
  };

  const calcularValorTotal = () => {
    let valorTotal = new Decimal(0);

    if (params.residuo?.codigo) {
      valorTotal = new Decimal(params.residuo?.valorUnitario ?? 0).mul(
        new Decimal(String(params.residuo?.quantidade ?? '').replace(',', '.')),
      );
    }

    return valorTotal.toNumber();
  };

  const calculaCubagem = () => {
    const pesoCubagemString = String(residuo?.cubagem ?? 0);
    const casasDecimais = contarCasasDecimais(pesoCubagemString);
    const cubagem = new Decimal(pesoCubagemString.replace(',', '.'));

    if (casasDecimais > 0) {
      return cubagem.toFixed(casasDecimais);
    }

    return cubagem.toString();
  };

  const onPressFoto = (fotoSelecionada: IPhoto) => {
    if (fotoSelecionada.base64) {
      setFoto(fotoSelecionada);
      setVisivel(!visivel);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.residuesDetailsLocal.selectPhotoError'),
      });
    }
  };

  return {
    foto,
    visivel,
    residuo,
    configuracoes,
    numeroCasasDecimais,
    onPressFoto,
    setVisivel,
    calculaPesoBruto,
    calculaPesoLiquido,
    calculaTara,
    calculaCubagem,
    calculaPesoExcesso,
    calcularValorTotal,
  };
}
