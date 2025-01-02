import * as React from 'react';
import { Keyboard } from 'react-native';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';
import { ListarBalancasPresenter } from './presenter';
import { usePresenter, useVSSnack } from 'vision-common';
import { useUser } from '../../contextos/usuarioContexto';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { IDropDownItems } from '../../componentes/dropdownOptions';
import { EnumBalancas, EnumTipoConexaoBalanca, IBalanca } from '../../../core/domain/entities/balanca/balanca';

interface Props extends IControllerAuth<AuthRoutes.ListaBalancasTCP> {}

export default function Controller({ navigation, params }: Props) {
  const STRING_REGEX_VALIDA_TCP_IP = /^((\d){1,3}\.){3}(\d){1,3}$/;

  const { usuario } = useUser();
  const { dispatchSnack } = useVSSnack();
  const snapPoints = React.useMemo(() => ['90%', '100%'], []);
  const tiposConexao: IDropDownItems[] = React.useMemo(
    () => [
      { label: 'TCP Client', value: '0' },
      { label: 'Bluetooth', value: '1' },
    ],
    [],
  );
  const tiposBalanca: IDropDownItems[] = React.useMemo(
    () => [{ label: 'WT3000i R', value: EnumBalancas.WT3000iR.toString() }],
    [],
  );
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const [balanca, setBalanca] = React.useState<IBalanca>({ tipoBalanca: EnumBalancas.WT3000iR });
  const [ehValido, setEhValido] = React.useState<boolean>(false);
  const [ehIpValido, setEhIpValido] = React.useState<boolean>(false);
  const [balancas, setBalancas] = React.useState<IBalanca[]>([]);
  const presenter = usePresenter(() => new ListarBalancasPresenter(usuario?.codigo ?? 0));

  const handleClosePress = () => {
    Keyboard.dismiss();
    setBalanca({ tipoBalanca: EnumBalancas.WT3000iR });
    bottomSheetRef.current?.dismiss();
  };

  const onPressNovaBalanca = () => {
    setBalanca({ ...balanca, tipoConexao: EnumTipoConexaoBalanca.TCP_CLIENT });
    handleOpenPress();
  };

  const handleOpenPress = () => {
    bottomSheetRef.current?.present();
    Keyboard.dismiss();
  };

  const handleDismissPress = React.useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  const onPressEditarBalanca = (balanca: IBalanca) => {
    setBalanca(balanca);
    handleOpenPress();
  };

  const handleTipoConexaoChanges = React.useCallback(
    (tipoConexao: EnumTipoConexaoBalanca) => {
      setBalanca({ descricaoBalanca: balanca.descricaoBalanca, tipoBalanca: balanca.tipoBalanca, tipoConexao });
    },
    [balanca],
  );

  const handleSnapPress = React.useCallback(index => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const handleTipoBalancaChanges = React.useCallback(
    (tipoBalanca: EnumBalancas) => setBalanca({ ...balanca, tipoBalanca }),
    [balanca],
  );

  const handleIpChanges = React.useCallback((ip: string) => setBalanca({ ...balanca, tcpIP: ip }), [balanca]);

  const handlePortaChanges = React.useCallback((porta: string) => setBalanca({ ...balanca, tcpPorta: Number(porta) }), [balanca]);

  const handleDescricaoBalancaChanges = React.useCallback(
    (descricao: string) => setBalanca({ ...balanca, descricaoBalanca: descricao }),
    [balanca],
  );

  const handleMacAddressBalancaChanges = React.useCallback(
    (mac: string) => setBalanca({ ...balanca, bluetoothMacAddress: mac }),
    [balanca],
  );

  const cadastrarBalanca = async () => {
    const response = await presenter.cadastrarBalanca(balanca);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      pegarBalancas();
      handleClosePress();

      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: 'Balança cadastrada com sucesso!',
      });
    }
  };

  const deletarBalanca = async () => {
    const response = await presenter.deletarBalanca(balanca?.codigo ?? 0);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });

      handleClosePress();
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: 'Balança deletada com sucesso!',
      });

      pegarBalancas();
      handleClosePress();
    }
  };

  const editarBalanca = async () => {
    const response = await presenter.atualizarBalanca(balanca);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      pegarBalancas();
      handleClosePress();

      dispatchSnack({
        type: 'open',
        alertType: 'success',
        message: 'Balança editada com sucesso!',
      });
    }
  };

  const selecionarBalanca = () => {
    if (!ehValido) {
      return dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Verifique os dados informados e tente novamente',
      });
    }

    handleClosePress();
    navigation.navigate<any>(params.screen, { balanca });
  };

  const validaCampos = React.useCallback(() => {
    if (balanca.tipoConexao == 0) {
      const ehIpValido = STRING_REGEX_VALIDA_TCP_IP.test(balanca?.tcpIP ?? '');

      setEhIpValido(ehIpValido);
      return setEhValido(!!(balanca.descricaoBalanca && balanca.tcpIP && balanca.tcpPorta));
    } else if (balanca.tipoConexao == 1) {
      return setEhValido(!!(balanca.descricaoBalanca && balanca.bluetoothMacAddress));
    }

    return setEhValido(false);
  }, [balanca]);

  const pegarBalancas = React.useCallback(async () => {
    const response = await presenter.pegarBalancas();

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      setBalancas(response);
    }
  }, []);

  React.useEffect(() => {
    pegarBalancas();

    const unsubscribe = Keyboard.addListener('keyboardDidHide', () => {
      handleSnapPress(0);
    });

    return () => {
      unsubscribe.remove();
    };
  }, []);

  React.useEffect(() => {
    validaCampos();
  }, [balanca]);

  return {
    balanca,
    balancas,
    snapPoints,
    bottomSheetRef,
    tiposBalanca,
    tiposConexao,
    ehIpValido,
    ehValido,
    setBalanca,
    selecionarBalanca,
    handleClosePress,
    onPressNovaBalanca,
    handleIpChanges,
    handleMacAddressBalancaChanges,
    onPressEditarBalanca,
    handleTipoConexaoChanges,
    handlePortaChanges,
    handleDescricaoBalancaChanges,
    handleTipoBalancaChanges,
    pegarBalancas,
    handleDismissPress,
    cadastrarBalanca,
    editarBalanca,
    deletarBalanca,
  };
}
