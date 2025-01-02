import * as React from 'react';
import { ILocalStorageConnection, timezoneDate, useVSAlert, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import { Keyboard } from 'react-native';
import { IResiduo } from '../../../../core/domain/entities/residuo';
import { verificaDiaChecklist } from '../../../utils/formatter';
import { optionsChecklist } from '../../../utils/enums';
import { useRascunho } from '../../../contextos/rascunhoContexto';
import { AuthRoutes } from '../../../routes/routes';
import { useStorage } from '../../../contextos/storageContexto';
import { useLocation } from '../../../contextos/localizacaoContexto';
import { useUser } from '../../../contextos/usuarioContexto';
import { useColeta } from '../../../contextos/coletaContexto';
import { IControllerAuth } from '../../../routes/types';
import { IOrder } from '../../../../core/domain/entities/order';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import { IConfiguracao } from '../../../../core/domain/entities/configuracao';
import { $SETTINGS_KEY } from '../../../../core/constants';

interface Props extends IControllerAuth<AuthRoutes.ResiduosDaColeta> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const storageContext = useStorage();
  const { configuracoes } = useUser();
  const { dispatchAlert, closeMe } = useVSAlert();
  const { placa } = useColeta();
  const { localizacao } = useLocation();
  const { rascunho, atualizarGravarRascunho } = useRascunho();

  const [kmAlert, setKmAlert] = React.useState<boolean>(false);
  const [kmInicial, setKmInicial] = React.useState<number>(0);
  const [kmFinal, setKmFinal] = React.useState<number>(0);
  const [residuos, setResiduos] = React.useState<IResiduo[]>([]);
  const [indexEdit, setIndexEdit] = React.useState<number | null>(null);
  const [hasDuplicado, setHasDuplicado] = React.useState<boolean>(false);
  const [loadingData, setLoadingData] = React.useState<boolean>(false);
  const [validatingSignature, setValidationgSignature] = React.useState<boolean>(false);
  const [showDeletar, setShowDeletar] = React.useState<boolean>(false);
  const [observacao, setObservacao] = React.useState<string>('');
  const [numeroCasasDecimais, setNumeroCasasDecimais] = React.useState<number>(2);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();

  const pegarNumeroCasasDecimais = async () => {
    const response = await iLocalStorageConnection.getStorageDataObject<IConfiguracao>($SETTINGS_KEY);
    setNumeroCasasDecimais(response?.numeroCasasDecimaisResiduos ?? 2);
  };

  React.useEffect(() => {
    pegarNumeroCasasDecimais();
  }, []);

  const onPressDelete = (index: number, isEdit?: boolean) => {
    const newResiduos = residuos.filter((_, _index) => _index !== index);

    if (!isEdit) {
      setResiduos(newResiduos);
    } else {
      const residuesList = [...newResiduos, params.residuo].sort(
        (item1, item2) => parseFloat(item1?.quantidade ?? '') - parseFloat(item2?.quantidade ?? ''),
      );
      setResiduos(residuesList.reverse());
    }

    setShowDeletar(false);
    setIndexEdit(null);
  };

  const onPressAdicionarQuantidade = (index: number) => {
    const residuosIndex = residuos.filter((_residuo, _index) => {
      if (_index === index) {
        const quantidade = parseFloat(_residuo?.quantidade ?? '0') + 1;
        _residuo.quantidade = quantidade.toString();
      }

      return _residuo;
    });

    if (residuosIndex?.length > 0) {
      setResiduos(residuosIndex);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.amountMoreError'),
      });
    }
  };

  const onChangeQuantidadeResiduo = (index: number, quantidade: string) => {
    const residuosIndex = residuos.filter((_residuo, _index) => {
      if (_index === index) {
        _residuo.quantidade = quantidade
          ? String(quantidade ?? '')
            .replace('.', ',')
            .replace(/ /g, '')
          : quantidade;
      }

      return _residuo;
    });

    if (residuosIndex?.length > 0) {
      setResiduos(residuosIndex);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.amountChangeError'),
      });
    }
  };

  const onPressDiminuirQuantidade = (index: number) => {
    const residuosIndex = residuos.filter((_residuo, _index) => {
      if (_index === index) {
        if (Number(_residuo.quantidade) !== 0) {
          const quantidade = parseFloat(_residuo?.quantidade ?? '') - 1;
          _residuo.quantidade = quantidade.toString();
        }
      }

      return _residuo;
    });

    if (residuosIndex?.length > 0) {
      setResiduos(residuosIndex);
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.amountDimError'),
      });
    }
  };

  const navigateToListaResiduos = () => {
    // TODO: Limpa indice para adicionar novo residuo
    setIndexEdit(null);

    navigation.navigate(AuthRoutes.ListaResiduos, {
      residuos,
      contratoID: params.coleta?.codigoContratoObra ?? 0,
      codigoColeta: params.coleta?.codigoOS ?? 0,
      clienteID: params.coleta?.codigoCliente ?? 0,
      screen: AuthRoutes.ResiduosDaColeta,
      novaColeta: params.novaColeta,
    });
  };

  const dimissKeyboard = () => Keyboard.dismiss();

  const validarColetaAssinatura = async (naoMostrarAlerta?: boolean) => {
    setValidationgSignature(true);

    if (configuracoes.obrigarUmaFotoOS && !rascunho?.fotos?.length) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectCheck.photoRequired'),
      });
      return setValidationgSignature(false);
    }
    const regEX = /^-?(\d+)(,\d+)?$/;

    const isValid = !residuos?.length
      ? !!params.coleta?.motivo?.codigo
      : residuos.every(res => regEX.test(res?.quantidade || '0'));

    if (!isValid) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.residuesValidate'),
      });
      return setValidationgSignature(false);
    }

    if (residuos.find(res => res?.xExigeInteiro && res.quantidade?.includes(','))) {
      setValidationgSignature(false);

      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.residue.amountInteger'),
      });
      return setValidationgSignature(false);
    }

    const temKmInicial = Boolean(kmInicial !== 0);
    const temKmFinal = Boolean(kmFinal !== 0);

    if (temKmInicial && temKmFinal && !naoMostrarAlerta) {
      setValidationgSignature(true);
      return dispatchAlert({
        type: 'open',
        alertType: 'confirm',
        message: 'Deseja alterar o km da coleta?',
        onPressRight: () => { setKmAlert(true) },
        textRight: 'Alterar',
        textLeft: 'Continuar',
        onPressLeft: () => {
          closeMe();
          setValidationgSignature(true);
          continuarAssinatura(residuos);
        },
      });
    }

    if (temKmInicial && !temKmFinal) {
      setValidationgSignature(false);
      return setKmAlert(true);
    }
    continuarAssinatura(residuos);
  };

  const continuarAssinatura = async (newResiduos: IResiduo[]) => {
    const col: IOrder = rascunho ? rascunho : (params.coleta as IOrder);
    const newColeta: IOrder = {
      ...col,
      residuos: rascunho ? newResiduos : residuos,
      placa: col?.placa || placa,
      dataOS: col?.dataOS || timezoneDate(new Date()),
      codigoRoterizacao: col?.codigoRoterizacao || 0,
      nomeResponsavel: col?.nomeResponsavel || '',
      funcaoResponsavel: col?.funcaoResponsavel || '',
      KMInicial: kmInicial,
      KMFinal: kmFinal,
      ordemColetaPendente: col?.ordemColetaPendente || 0,
      observacaoOS: observacao,
      enderecoOS: {
        ...col?.enderecoOS,
        latLng: {
          latitude: localizacao?.latitude ?? 0,
          longitude: localizacao?.longitude ?? 0,
        },
      },
    };

    const codigo = params.novaColeta ? params.coleta?.codigoCliente : params.coleta?.codigoOS;

    await atualizarGravarRascunho(newColeta);
    await storageContext.gravarAuditoria({
      codigoRegistro: codigo ?? 0,
      descricao: `Clicou em Assinatura na Tela de Resíduos da Coleta ${codigo} / resíduos: ${residuos?.map(res => ({
        ...res,
        fotos: res.fotos?.map(foto => ({ ...foto, base64: foto.base64?.length })),
      }))}`,
      rotina: 'Assinatura Tela Resíduos da Coleta',
      tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
    });

    navigation.navigate(AuthRoutes.Assinatura, {
      screen: AuthRoutes.ResiduosDaColeta,
      coleta: newColeta,
      novaColeta: params.novaColeta,
      codigoQuestionario: 0,
      grupos: [],
      motivo: {},
      perguntas: [],
      placa,
    });

    setValidationgSignature(false);
  };

  const continuarColeta = async () => {
    const regEX = /^-?(\d+)(,\d+)?$/;
    const isValid = !residuos?.length
      ? !!params.coleta?.motivo?.codigo
      : residuos.every(res => regEX.test(res?.quantidade || '0'));

    if (!isValid && !configuracoes.permitirOsSemResiduos) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.collectResidues.residuesValidate'),
      });
      return;
    }

    if (isValid || configuracoes.permitirOsSemResiduos) {
      if (residuos.find(res => res?.xExigeInteiro && res.quantidade?.includes(','))) {
        dispatchSnack({
          type: 'open',
          alertType: 'info',
          message: I18n.t('screens.residue.amountInteger'),
        });
      } else {
        const isToday = verificaDiaChecklist(params.coleta?.checklist);

        const col: IOrder = rascunho ? rascunho : (params.coleta as IOrder);
        const newColeta: IOrder = {
          ...col,
          residuos,
          placa: col?.placa || placa,
          dataOS: col?.dataOS || timezoneDate(new Date()),
          codigoRoterizacao: col?.codigoRoterizacao || 0,
          nomeResponsavel: col?.nomeResponsavel || '',
          funcaoResponsavel: col?.funcaoResponsavel || '',
          KMInicial: kmInicial,
          KMFinal: kmFinal,
          ordemColetaPendente: col?.ordemColetaPendente || 0,
          observacaoOS: observacao,
          enderecoOS: {
            ...col?.enderecoOS,
            latLng: {
              latitude: localizacao?.latitude ?? 0,
              longitude: localizacao?.longitude ?? 0,
            },
          },
        };

        const codigo = params.novaColeta ? newColeta?.codigoCliente : newColeta?.codigoOS;

        await storageContext.gravarAuditoria({
          codigoRegistro: codigo ?? 0,
          descricao: `resíduos: ${newColeta?.residuos?.map(res => ({
            ...res,
            fotos: res.fotos?.map(foto => ({ ...foto, base64: foto.base64?.length })),
          }))}`,
          rotina: 'Clicou em Continuar na Tela de Resíduos Coleta',
          tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
        });

        await atualizarGravarRascunho(newColeta);

        if (isToday && params.coleta?.checklist?.momentoExibicao === optionsChecklist.FINALIZAR) {
          navigation.navigate(AuthRoutes.Checklist, { coleta: newColeta });
        } else if (configuracoes?.permiteMovimentarContainerAPP) {
          navigation.navigate(AuthRoutes.EquipamentosDaColeta, {
            coleta: newColeta,
            novaColeta: params.novaColeta,
            equipamento: {},
            scanData: '',
          });
        } else {
          navigation.navigate(AuthRoutes.ColetaResponsavel, {
            coleta: newColeta,
            novaColeta: params.novaColeta,
            assinatura: '',
            mtr: {},
            photo: {},
            scanData: '',
          });
        }
      }
    }
  };

  const verificaResiduoDuplicado = (residuo: IResiduo) => {
    return residuos.filter(
      (item: IResiduo) =>
        item.codigo === residuo.codigo &&
        residuo.xImobilizadoGenerico &&
        residuo.codigoImobilizadoReal !== item.codigoImobilizadoReal,
    );
  };

  const onChangeObservacao = (value: string) => setObservacao(value);

  const goBackFunction = async () => {
    if (rascunho && (rascunho?.codigoCliente || rascunho?.codigoOS)) {
      const col = rascunho || (params.coleta as IOrder);
      await atualizarGravarRascunho({
        ...col,
        KMInicial: kmInicial,
        KMFinal: kmFinal,
        residuos,
      });
    }
    navigation.goBack();
  };

  const toogleDeletar = () => setShowDeletar(!showDeletar);

  const onPressEdit = (residuo: IResiduo) => {
    const cloneResiduo: IResiduo = {
      ...residuo,
      residuosSecundarios: residuo?.residuosSecundarios?.map(residuoSecundario => ({ ...residuoSecundario })),
      imobilizado: { ...residuo?.imobilizado },
    };

    navigation.navigate(AuthRoutes.Residuo, {
      residuo: cloneResiduo,
      isEdit: true,
      duplicado: verificaResiduoDuplicado(params.residuo)?.length > 1,
      adicionado: false,
      photo: {},
      balanca: {},
      codigoColeta: params.coleta?.codigoOS,
      codigoCliente: params.coleta?.codigoCliente,
      novaColeta: params.novaColeta,
      imobilizado: cloneResiduo.imobilizado,
    });
  };

  //TO-DO Refatora rotinas de Assinatura + mensagem residuos  + fechamentokm
  const mensagemParaContinuarOuAssinar = (assinatura?: boolean) =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t(
        residuos?.length < 2
          ? 'screens.collectResidues.quantityConfirmationMessage'
          : 'screens.collectResidues.pluralQuantityConfirmationMessage',
        { totalResiduo: residuos?.length },
      ),
      textLeft: I18n.t('alerts.no'),
      textRight: I18n.t('alerts.yes'),
      onPressRight: () => {
        assinatura
          ? validarColetaAssinatura(true)
          : continuarColeta();
      }
    });

  React.useEffect(() => {
    setKmInicial(params.coleta?.KMInicial || 0);
    setKmFinal(params.coleta?.KMFinal || 0);

    if (params.coleta?.residuos) {
      setResiduos(params.coleta.residuos);
    }
  }, [params.coleta?.KMFinal, params.coleta?.KMInicial]);

  React.useEffect(() => {
    if (rascunho?.residuos?.length) {
      setResiduos(rascunho.residuos);
    }
  }, [rascunho]);

  React.useEffect(() => {
    if (params.residuo.codigo && indexEdit === null) {

      const residuesList = [...residuos, params.residuo].sort(
        (item1, item2) => parseFloat(item1?.quantidade ?? '') - parseFloat(item2?.quantidade ?? ''),
      );
      setResiduos(residuesList.reverse());
    } else if (params.residuo.codigo && (indexEdit === 0 || indexEdit)) {
      onPressDelete(indexEdit, true);
    }
  }, [params.residuo]);

  React.useEffect(() => {
    setHasDuplicado(!!residuos.find?.(res => !!verificaResiduoDuplicado(res)?.length));
  }, [residuos]);

  const showDeletarAlert = (index = 0) =>
    dispatchAlert({
      type: 'open',
      alertType: 'confirm',
      message: I18n.t('screens.collectResidues.deleteConfirm'),
      textRight: I18n.t('alerts.yes'),
      textLeft: I18n.t('alerts.no'),
      onPressRight: async () => {
        await storageContext.gravarAuditoria({
          codigoRegistro: 0,
          descricao: `Deletou o resíduo ${residuos[index]?.codigo || 0}`,
          rotina: 'Clicou em Continuar na Tela de Resíduos Coleta',
          tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
        });
        onPressDelete(index);
      },
    });

  React.useEffect(() => {
    const validaQuantidade = (): boolean => {
      return residuos.some((item: IResiduo) => {
        const quantidade = parseFloat(item.quantidade as string);
        return !isNaN(quantidade) && quantidade > 0;
      });
    };

    if (params.coleta?.motivo?.codigo == 1) {
      setIsButtonDisabled(false);
      return;
    }
    setIsButtonDisabled(!validaQuantidade());
  }, [residuos]);

  return {
    residuos,
    observacao,
    loadingData,
    hasDuplicado,
    configuracoes,
    showDeletar,
    indexEdit,
    kmAlert,
    kmInicial,
    kmFinal,
    validatingSignature,
    numeroCasasDecimais,
    isButtonDisabled,
    goBackFunction,
    setKmAlert,
    dimissKeyboard,
    onChangeObservacao,
    setKmFinal,
    setKmInicial,
    showDeletarAlert,
    onChangeQuantidadeResiduo,
    toogleDeletar,
    verificaResiduoDuplicado,
    setIndexEdit,
    onPressAdicionarQuantidade,
    onPressDiminuirQuantidade,
    validarColetaAssinatura,
    continuarColeta,
    onPressDelete,
    onPressEdit,
    navigateToListaResiduos,
    mensagemParaContinuarOuAssinar,
  };
}
