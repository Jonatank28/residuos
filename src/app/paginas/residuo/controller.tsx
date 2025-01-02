import * as React from 'react';
import I18n from 'i18n-js';
import { Alert, Keyboard } from 'react-native';
import { IResiduo } from '../../../core/domain/entities/residuo';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';
import { randomHash } from '../../utils/mixins';
import { useBalanca } from '../../contextos/balanca/balancaContexto';
import ResiduoPresenter from './presenter';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from '../../contextos/usuarioContexto';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { EnumEstabilidadeWt3000iR } from '../../../core/domain/entities/balanca/wt3000iR';
import { useVSSnack, IPhoto, useVSAlert, usePresenter, timezoneDate, ILocalStorageConnection } from 'vision-common';
import Decimal from 'decimal.js';
import LocalStorageConnection from 'vision-common/src/app/hooks/asyncStorageConnection';
import { IConfiguracao } from '../../../core/domain/entities/configuracao';
import { $SETTINGS_KEY } from '../../../core/constants';
import { IImobilizado } from '../../../core/domain/entities/imobilizado';

interface Props extends IControllerAuth<AuthRoutes.Residuo> { }

export default function Controller({ navigation, params }: Props) {
    const inputRef = React.useRef<any>(null);
    const { usuario } = useUser();
    const { configuracoes } = useUser();
    const { dispatchSnack } = useVSSnack();
    const { dispatchAlert } = useVSAlert();
    const balancaSocket = useBalanca();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const [somarPeso, setSomarPeso] = React.useState<boolean>(false);
    const [photos, setPhotos] = React.useState<IPhoto[]>([]);
    const [residuo, setResiduo] = React.useState<IResiduo>({});
    const [imobilizado, setImobilizado] = React.useState<IImobilizado>({});
    const [timer, setTimer] = React.useState<any>(null);
    const presenter = usePresenter(() => new ResiduoPresenter(usuario?.codigo ?? 0));
    const [numeroCasasDecimais, setNumeroCasasDecimais] = React.useState<number>(2);
    const [quantidade, setQuantidade] = React.useState<string | undefined>(params.residuo.quantidade);
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

    const dimissKeyboard = () => Keyboard.dismiss();

    const iLocalStorageConnection: ILocalStorageConnection = new LocalStorageConnection();

    const pegarNumeroCasasDecimais = async () => {
        const response = await iLocalStorageConnection.getStorageDataObject<IConfiguracao>($SETTINGS_KEY);
        setNumeroCasasDecimais(response?.numeroCasasDecimaisResiduos ?? 2);
    };

    React.useEffect(() => {
        pegarNumeroCasasDecimais();
    }, []);

    const onChangeExcesso = () =>
        setResiduo({
            ...residuo,
            excesso: !residuo.excesso,
        });

    const onPressBalanca = () => {
        navigation.navigate(AuthRoutes.ListaBalancasTCP, {
            screen: AuthRoutes.Residuo,
        });
    };

    const goToCamera = () => {
        navigation.navigate(AuthRoutes.Camera, {
            message: I18n.t('components.addPhoto.defaultMessage'),
            isFront: false,
            screen: AuthRoutes.Residuo,
        });
    };

    const goToGaleraFotos = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            quality: 0.3,
        });

        if (!result.cancelled && (result.base64?.length || 0) > 5 * 1024 * 1024) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: 'A imagem selecionada é muito grande, por favor selecione uma imagem menor.',
            });
            return;
        }

        if (!result.cancelled && result.base64) {
            setPhotos([
                ...photos,
                {
                    height: result.height,
                    width: result.width,
                    base64: `data:image/jpg;base64,${result.base64}`,
                    uri: result.uri,
                    observacao: '',
                    data: timezoneDate(new Date()),
                    nome: '',
                    origem: 'VSR',
                    tipo: result.type,
                },
            ]);
        } else if (!result.cancelled && !result.base64) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: 'Ocorreu um erro ao pegar a imagem',
            });
        }
    };

    const goToEquipamentos = () => {
        navigation.navigate(AuthRoutes.ListaEquipamentos, {
            scanData: '',
            equipamentoSubstituir: {},
            equipamentos: [],
            codigoColeta: params.codigoColeta || 0,
            codigoCliente: params.codigoCliente || 0,
            novaColeta: params.novaColeta,
            coleta: {},
            screen: AuthRoutes.Residuo,
            residuo: residuo,
        });
    };

    const onChangeConforme = () =>
        setResiduo({
            ...residuo,
            naoConforme: !residuo.naoConforme,
        });

    const onPressConfirmar = () => {
        const newResiduo: IResiduo = {
            ...residuo,
            codigoHashResiduo: randomHash(),
            quantidade:
                residuo?.quantidade && residuo.quantidade?.length > 0
                    ? String(residuo?.quantidade ?? '')
                        .replace('.', ',')
                        .replace(/ /g, '')
                    : '0',
            excesso: !!residuo.excesso,
            xExigeInteiro: !!residuo.xExigeInteiro,
            naoConforme: !!residuo.naoConforme,
            fotos: photos,
            imobilizado,
        };

        setIsButtonDisabled(true);

        const hasResidueValue = newResiduo?.quantidade && parseFloat(newResiduo.quantidade) >= 0;
        const isValid = /^((-)?(0|([1-9][0-9]*))(,[0-9]+)?)$/.test(newResiduo?.quantidade ?? '');
        const regexValidaValoresAposVirgula = /^\d+,\d*[1-9]+\d*$/;

        const validaValordepoisDaVirgula = newResiduo?.quantidade && regexValidaValoresAposVirgula.test(newResiduo.quantidade);

        if (!isValidNumberInput(residuo?.quantidade ?? '0')) {
            setIsButtonDisabled(false);
            return dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: `Os valores digitados são inválidos`,
            });
        }

        if (residuo?.residuosSecundarios && residuo.residuosSecundarios?.length > 0) {
            setIsButtonDisabled(false);
            const invalido = residuo?.residuosSecundarios.some(residuoSecundario => {
                if (!isValidNumberInput(residuoSecundario?.quantidade ?? '0')) return true;

                return false;
            });

            if (invalido) {
                setIsButtonDisabled(false);
                return dispatchSnack({
                    type: 'open',
                    alertType: 'info',
                    message: `Os valores digitados são inválidos`,
                });
            }

            let pesoResiduos = new Decimal(0);
            const pesoLiquido = calculaPesoLiquidoResiduo();
            const casasDecimais = contarCasasDecimais(String(pesoLiquido));

            residuo.residuosSecundarios.forEach(_novoResiduo => {
                const quantidade = String(_novoResiduo.quantidade ?? 0);
                setIsButtonDisabled(false);
                if (quantidade !== '0') {
                    pesoResiduos = pesoResiduos.plus(quantidade.replace(',', '.'));
                }
            });

            let pesoValidacao: any;

            if (casasDecimais > 0) {
                pesoValidacao = pesoResiduos.toFixed(casasDecimais);
            } else {
                pesoValidacao = pesoResiduos;
            }

            if (pesoValidacao < pesoLiquido && residuo.residuosSecundarios.length > 0) {
                setIsButtonDisabled(false);
                dispatchSnack({
                    type: 'open',
                    alertType: 'info',
                    message: `Você deve informar um peso máximo de ${pesoLiquido}`,
                });

                return;
            } else if (pesoResiduos > pesoLiquido && residuo.residuosSecundarios.length > 0) {
                setIsButtonDisabled(false);
                dispatchSnack({
                    type: 'open',
                    alertType: 'info',
                    message: `A soma dos pesos passa do peso líquido de ${pesoLiquido}`,
                });

                return;
            }
            setIsButtonDisabled(false);
        }

        if ((hasResidueValue || params.isEdit) && (!newResiduo.quantidade || newResiduo.quantidade === '0' || isValid)) {
            if ((newResiduo?.xExigeInteiro && newResiduo?.quantidade && !validaValordepoisDaVirgula) || !newResiduo.xExigeInteiro) {
                navigation.navigate(AuthRoutes.ResiduosDaColeta, {
                    residuo: newResiduo,
                    novaColeta: params.novaColeta,
                });
            } else {
                setIsButtonDisabled(false);
                dispatchSnack({
                    type: 'open',
                    alertType: 'info',
                    message: I18n.t('screens.residue.amountInteger'),
                });
            }
        } else {
            setIsButtonDisabled(false);
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.residue.amountRequired'),
            });
        }
    };

    const onChangeObservacao = (value: string) =>
        setResiduo({
            ...residuo,
            observacao: value,
        });

    const onChangePesoFinal = (value: number) =>
        setResiduo({
            ...residuo,
            pesoFinal: value,
        });

    const navigateToResiduos = () =>
        navigation.navigate(AuthRoutes.ListaResiduos, {
            clienteID: 0,
            contratoID: 0,
            residuos: params?.residuos ?? [],
            screen: AuthRoutes.Residuo,
            novaColeta: params.novaColeta,
        });

    const onChangeQuantidade = (quantidade: string) => {
        const newQuantidade = quantidade.trim() === '' ? '0' : quantidade;
        const sanitizedQuantidade = (
            newQuantidade?.length > 0 ? newQuantidade.replace('.', ',').replace(/ /g, '') : newQuantidade
        ).replace(/^0+(?=\d)/, '');


        setResiduo({
            ...residuo,
            quantidade: sanitizedQuantidade,
        });
    };


    const validaQuantidade = (): boolean => {
        const tara = parseFloat(String(imobilizado?.tara ?? 0).replace(',', '.')) || 0;
        const quantidadeResiduo = parseFloat(String(residuo?.quantidade ?? 0).replace(',', '.')) || 0;
        return quantidadeResiduo <= tara;
    };


    const onChangePesoBruto = (pesoBruto: string) => {
        const newPesoBruto = pesoBruto?.length > 0 ? pesoBruto.replace('.', ',').replace(/ /g, '') : pesoBruto;

        setResiduo({
            ...residuo,
            pesoBruto: newPesoBruto,
        });
    };

    const contarCasasDecimais = (numeroStr: string): number => {
        return numeroCasasDecimais ?? 2;
        // if (!numeroStr) return 0;

        // let partes: string[] = [];

        // if (numeroStr.includes('.')) {
        //   partes = numeroStr.split('.');
        // } else {
        //   partes = numeroStr.split(',');
        // }

        // if (partes.length > 1) {
        //   return partes[1].length;
        // }

        // return 0;
    };

    const calculaPesoExcesso = () => {
        const cubagemString = String(residuo?.cubagem ?? 0);
        const pesoBrutoString = String(residuo?.pesoBruto ?? 0);
        const taraString = String(residuo.tara ?? 0);
        const casasDecimais = contarCasasDecimais(pesoBrutoString);

        if (!isValidNumberInput(cubagemString) || !isValidNumberInput(pesoBrutoString) || !isValidNumberInput(taraString))
            return new Decimal(0);

        const cubagem = new Decimal(cubagemString ? cubagemString.replace(',', '.') : '0');
        const pesoBruto = new Decimal(pesoBrutoString ? pesoBrutoString.replace(',', '.') : '0');
        const tara = new Decimal(taraString ? taraString.replace(',', '.') : '0');
        const pesoLiquido = pesoBruto.minus(tara).abs();

        if (pesoLiquido.isNaN()) return new Decimal(0);

        if (pesoLiquido.gt(cubagem)) {
            const excesso = cubagem.minus(pesoLiquido).abs();

            if (casasDecimais > 0) {
                return excesso.toFixed(casasDecimais);
            }

            return excesso;
        }

        return 0;
    };

    const calculaPesoFinaldoOs = () => {
        const tara = parseFloat(String(imobilizado?.tara ?? 0).replace(',', '.')) || 0;
        const quantidadeResiduo = parseFloat(String(residuo?.quantidade ?? 0).replace(',', '.')) || 0;
        const pesoFinal = quantidadeResiduo - tara;
        const response = pesoFinal < 0 ? 0 : pesoFinal;
        return Number(response.toFixed(configuracoes.numeroCasasDecimaisResiduos));
    }

    const calculaPesoLiquidoResiduo = () => {
        const pesoBrutoString = String(residuo?.pesoBruto ?? 0);
        const taraString = String(residuo.tara ?? 0);
        const casasDecimais = contarCasasDecimais(pesoBrutoString);

        if (!isValidNumberInput(pesoBrutoString) || !isValidNumberInput(taraString)) return new Decimal(0);

        const pesoBruto = new Decimal(pesoBrutoString ? pesoBrutoString.replace(',', '.') : '0');
        const tara = new Decimal(taraString ? taraString.replace(',', '.') : '0');
        const pesoLiquido = pesoBruto.minus(tara).abs();

        if (pesoLiquido.isNaN()) return new Decimal(0);

        if (casasDecimais > 0) {
            return pesoLiquido.toFixed(casasDecimais);
        }

        return pesoLiquido;
    };

    const isValidNumberInput = (_input: string): boolean => {
        const input = String(_input || '').replace('.', ',');

        if (typeof input !== 'string' || !/^[0-9, ]+$/.test(input)) {
            return false;
        }

        if (input.split(',').length > 2) {
            return false;
        }

        if (input.startsWith(',') || input.endsWith(',')) {
            return false;
        }

        if (input.includes('  ')) {
            return false;
        }

        return true;
    };

    const onChangeQuantidadeResiduoSecundario = (quantidade: string, index: number) => {
        if (!residuo.residuosSecundarios) return;

        let newPesoBruto: string = '';
        const newQuantidade = quantidade?.length > 0 ? quantidade.replace('.', ',').replace(/ /g, '') : quantidade;

        if (isValidNumberInput(quantidade)) {
            const quantidadeNumerica = new Decimal(newQuantidade ? newQuantidade?.replace(',', '.') : 0);
            const pesoBrutoNumerico = new Decimal(residuo?.pesoBruto ? String(residuo.pesoBruto).replace(',', '.') : 0);

            // Determinar a quantidade de casas decimais a serem usadas
            const casasDecimais = Math.max(contarCasasDecimais(newQuantidade ?? '0'), contarCasasDecimais(residuo?.pesoBruto ?? '0'));

            // Arredondar os números para a mesma precisão
            const quantidadeArredondada = quantidadeNumerica.toDecimalPlaces(casasDecimais);
            const pesoBrutoArredondado = pesoBrutoNumerico.toDecimalPlaces(casasDecimais);
            const quantidadeMaiorOuIgual = quantidadeArredondada.gte(pesoBrutoArredondado);

            // Altera o valor do peso bruto se tiver somente 1 resíduo e for alterado o peso líquido dele
            if (residuo?.residuosSecundarios?.length === 1 && quantidadeMaiorOuIgual) {
                clearTimeout(timer);

                const newTimer = setTimeout(() => {
                    const taraString = String(residuo?.tara ?? 0);
                    const _quantidadeTratada = new Decimal(newQuantidade ? newQuantidade.replace(',', '.') : '0');
                    const tara = new Decimal(taraString ? taraString.replace(',', '.') : '0');
                    newPesoBruto = _quantidadeTratada.plus(tara).abs().toFixed(contarCasasDecimais(newQuantidade));

                    setResiduo(prev => ({ ...prev, pesoBruto: newPesoBruto }));
                }, 10);

                setTimer(newTimer);
            }
        }

        const residuosIndex = residuo.residuosSecundarios.filter((residuoSecundario, residuoSecundarioIndex) => {
            if (residuoSecundarioIndex === index) {
                residuoSecundario.quantidade = String(newQuantidade).replace(/ /g, '');
            }

            return residuoSecundario;
        });

        if (residuosIndex?.length > 0) {
            setResiduo({
                ...residuo,
                residuosSecundarios: residuosIndex,
            });
        }
    };

    const onFocusQuantidade = () =>
        setResiduo(prev => ({
            ...prev,
            quantidade:
                parseFloat(prev?.quantidade && prev.quantidade?.length > 0 ? prev.quantidade : '0') === 0
                    ? ''
                    : String(prev?.quantidade ?? '').replace(/ /g, ''),
        }));

    const configuracaoExibeMensagemPeso = () => {
        const tara = parseFloat(String(imobilizado?.tara ?? 0).replace(',', '.')) || 0;
        if (configuracoes.exibeMensagemInsercaoPeso) {
            if (validaQuantidade()) {
                // Se a quantidade for inválida
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: `Quantidade inválida! A quantidade não pode ser menor ou igual que a tara: ${tara}!`,
                });
            } else {
                // Se a quantidade for válida
                quantidade == '0' || (quantidade == '' && residuo.quantidade !== '0')
                    ? dispatchSnack({
                        type: 'open',
                        alertType: 'success',
                        message: 'Quantidade inserida com sucesso!',
                    })
                    : dispatchSnack({
                        type: 'open',
                        alertType: 'success',
                        message: 'Quantidade alterada com sucesso!',
                    });
            }
        }
    };

    const onBlurQuantidade = () => {
        if (residuo.quantidade && quantidade !== residuo.quantidade) {
            setQuantidade(residuo.quantidade);

            configuracaoExibeMensagemPeso();
        }
    };

    const onChangeDescricaoResiduos = (descricao: string) =>
        setResiduo({
            ...residuo,
            descricao,
        });

    const verificarQuantidadeBalancas = async (somarPeso: boolean) => {
        const response = await presenter.verificarQuantidadeBalancas();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else if (response && response?.codigo) {
            setSomarPeso(somarPeso);
            navigation.setParams({ ...params, balanca: response });
        } else {
            setSomarPeso(somarPeso);
            onPressBalanca();
        }
    };

    React.useEffect(() => {
        if (params.residuo && params.residuo?.codigo) {
            if (params.residuo?.fotos && params.residuo.fotos?.length > 0) {
                setPhotos(params.residuo.fotos);
            }

            setResiduo(
                params.isEdit
                    ? params.residuo
                    : {
                        ...params.residuo,
                        quantidade: '',
                    },
            );
        }
    }, [params.residuo]);

    React.useEffect(() => {
        if (params.photo.base64) {
            setPhotos([...photos, params.photo]);
        }
    }, [params.photo]);

    React.useEffect(() => {
        if (params.imobilizado?.codigo) {
            setImobilizado(params.imobilizado);
        }

    }, [params.imobilizado]);

    React.useEffect(() => {
        try {
            if (params.balanca) {
                const socket = balancaSocket.connect(params.balanca);

                if (socket) {
                    socket.on('data', data => {
                        if (typeof data === 'string') {
                            const dadosTratados = balancaSocket.handlePeso(data, params.balanca.tipoBalanca);

                            if (dadosTratados.estabilidade === EnumEstabilidadeWt3000iR.OL) {
                                dispatchAlert({
                                    type: 'open',
                                    alertType: 'info',
                                    onPressRight: () => null,
                                    message: 'A balança está em overload',
                                });

                                return socket.destroy();
                            }

                            if (
                                String(dadosTratados.unidade ?? '') !== '' &&
                                String(dadosTratados.unidade ?? '').toUpperCase() !== String(residuo.unidade ?? '').toUpperCase()
                            ) {
                                dispatchAlert({
                                    type: 'open',
                                    alertType: 'info',
                                    onPressRight: () => null,
                                    message: 'A unidade da balança não condiz com a unidade do resíduo',
                                });

                                setSomarPeso(false);
                                return socket.destroy();
                            }

                            setResiduo(prev => ({
                                ...residuo,
                                quantidade: somarPeso
                                    ? new Decimal(prev.quantidade || 0).add(new Decimal(dadosTratados.valor || 0)).toString()
                                    : dadosTratados.valor,
                            }));
                        }

                        setSomarPeso(false);
                        socket.destroy();
                    });
                }
            }
        } catch (e) {
            Alert.alert(JSON.stringify(e));
        }
    }, [params.balanca]);

    return {
        residuo,
        photos,
        inputRef,
        balancaSocket,
        bottomSheetRef,
        numeroCasasDecimais,
        imobilizado,
        isButtonDisabled,
        onChangePesoBruto,
        calculaPesoExcesso,
        calculaPesoLiquidoResiduo,
        goToCamera,
        goToGaleraFotos,
        onChangeConforme,
        onChangeExcesso,
        onChangeQuantidade,
        verificarQuantidadeBalancas,
        onChangeQuantidadeResiduoSecundario,
        dimissKeyboard,
        onPressConfirmar,
        setPhotos,
        onFocusQuantidade,
        onBlurQuantidade,
        navigateToResiduos,
        onChangeObservacao,
        onChangeDescricaoResiduos,
        goToEquipamentos,
        setImobilizado,
        calculaPesoFinaldoOs,
        onChangePesoFinal,
        validaQuantidade,
    };
}
