import * as Yup from 'yup';
import * as React from 'react';
import {
    IPhoto,
    Orientation,
    removerQuebrasLinha,
    timezoneDate,
    usePresenter,
    useVSAlert,
    useVSConnection,
    useVSSnack,
    validateCNPJ,
    validateCPF,
} from 'vision-common';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { IOrder } from '../../../../core/domain/entities/order';
import { IMtr } from '../../../../core/domain/entities/mtr';
import { useRascunho } from '../../../contextos/rascunhoContexto';
import { useColeta } from '../../../contextos/coletaContexto';
import { useStorage } from '../../../contextos/storageContexto';
import { AuthRoutes } from '../../../routes/routes';
import { useLocation } from '../../../contextos/localizacaoContexto';
import { useUser } from '../../../contextos/usuarioContexto';
import { useIsFocused } from '@react-navigation/native';
import { IControllerAuth } from '../../../routes/types';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { auditar } from '../../../../core/auditoriaHelper';

interface Props extends IControllerAuth<AuthRoutes.ColetaResponsavel> { }

export default function Controller({ navigation, params }: Props) {
    const formRef = React.useRef<any>();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const { dispatchSnack } = useVSSnack();
    const { dispatchAlert, closeMe } = useVSAlert();
    const { enviarColeta, placa } = useColeta();
    const { configuracoes } = useUser();
    const { localizacao } = useLocation();
    const storageContext = useStorage();
    const presenter = usePresenter(() => new Presenter());
    const isFocused = useIsFocused();
    const { rascunho, atualizarGravarRascunho } = useRascunho();

    const [kmAlert, setKmAlert] = React.useState<boolean>(false);
    const [naoMostrarAlerta, setNaoMostrarAlerta] = React.useState<boolean>(false);
    const [kmInicial, setKmInicial] = React.useState<number>(0);
    const [kmFinal, setKmFinal] = React.useState<number>(0);

    const [photos, setPhotos] = React.useState<IPhoto[]>([]);
    const [mtrsRelacao, setMtrsRelacao] = React.useState<IMtr[]>([]);
    const [coleta, setColeta] = React.useState<IOrder>({});
    const [resumo, setResumo] = React.useState<boolean>(false);
    const [isSignature, setIsSignature] = React.useState<boolean>(false);
    const [validatingSignature, setValidatingSignature] = React.useState<boolean>(false);
    const [assinaturaColeta, setAssinaturaColeta] = React.useState<string>();
    const { connectionState, connectionType } = useVSConnection();

    const initialData = {
        responsavel: coleta?.nomeResponsavel ?? '',
        funcaoResponsavel: coleta?.funcaoResponsavel ?? '',
        cpfcnpj: removerQuebrasLinha(coleta?.CPFCNPJResponsavel ?? '') ?? '',
        emailResponsavel: coleta?.emailResponsavel ?? '',
        observacao: coleta?.observacaoOS ?? '',
        mtr: coleta?.mtr ?? '',
        mtrBarra: coleta?.codigoBarraMTR ?? '',
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

    const navigateToAdicionarMtr = () =>
        navigation.navigate(AuthRoutes.ListaEstadosMTR, {
            mtrs: mtrsRelacao,
            screen: AuthRoutes.ColetaResponsavel,
        });

    const calcularValorOS = () => {
        let valorTotal = 0;

        if (coleta?.residuos && coleta.residuos?.length > 0) {
            coleta.residuos.forEach(_residuo => {
                valorTotal += Number(_residuo?.valorUnitario ?? 0) * Number(String(_residuo?.quantidade ?? '').replace(',', '.') ?? 0);
            });
        }

        return valorTotal;
    };

    const pegarMtrRelacao = async () => {
        if (params.coleta.codigoOS) {
            const response = await presenter.pegarMtrRelacao(params.coleta.codigoOS);

            if (response instanceof Error) {
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: response.message,
                });
            } else if (mtrsRelacao.length === 0) {
                if (params.coleta.mtrs && params.coleta.mtrs.length > 0) {
                    setMtrsRelacao(params.coleta.mtrs);
                } else {
                    setMtrsRelacao(response);
                }
            }
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.collectCheck.codeOSInvalid'),
            });
        }
    };

    const verificarMtr = async () => {
        if (!connectionState) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: 'Sem coexão com a internet, não será possível verificar MTR.',
            });
            return;
        }

        const responseRelacao = await presenter.verificarRelacao(params.coleta?.codigoOS ?? 0);

        if (responseRelacao instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: responseRelacao.message,
            });
        } else if (!params.coleta.mtr && !params.coleta.codigoBarraMTR && !responseRelacao) {
            pegarMtrRelacao();
        }
    };

    const onChangeNomeResponsavel = (value: string) =>
        setColeta({
            ...coleta,
            nomeResponsavel: value,
        });

    const onChangeObservacao = (value: string) =>
        setColeta({
            ...coleta,
            observacaoOS: value,
        });

    const onChangeCodigoBarrasMTR = (value: string) =>
        setColeta({
            ...coleta,
            codigoBarraMTR: value,
        });

    const onChangeFuncaoResponsavel = (value: string) =>
        setColeta({
            ...coleta,
            funcaoResponsavel: value,
        });

    const onChangeCPFCNPJResponsavel = (value: string) =>
        setColeta({
            ...coleta,
            CPFCNPJResponsavel: value,
        });

    const onChangeEmailResponsavel = (value: string) =>
        setColeta({
            ...coleta,
            emailResponsavel: value,
        });

    const onChangeMTR = (value: string) =>
        setColeta({
            ...coleta,
            mtr: value,
        });

    React.useEffect(() => {
        const codigo = params.novaColeta ? params.coleta?.codigoCliente : params.coleta?.codigoOS;

        storageContext.gravarAuditoria({
            codigoRegistro: codigo ?? 0,
            descricao: `Acessou Tela de Responsável ${codigo}`,
            rotina: 'Abrir Tela Responsável',
            tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
        });
    }, []);

    const deletarMtr = (mtrSelecionado: IMtr) => {
        if (mtrSelecionado) {
            // eslint-disable-next-line max-len
            const newMtrs = mtrsRelacao.filter(
                item => item.mtr !== mtrSelecionado.mtr || item.mtrCodBarras !== mtrSelecionado.mtrCodBarras,
            );
            setMtrsRelacao(newMtrs);
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: I18n.t('screens.collectCheck.mtrDelete'),
            });
        }
    };

    React.useEffect(() => {
        if ((params.mtr?.estado && params.mtr.estado?.codigo) || params.mtr?.mtrCodBarras || params.mtr?.mtr) {
            setMtrsRelacao([...mtrsRelacao, params.mtr]);
        }
    }, [params.mtr]);

    React.useEffect(() => {
        if (isFocused) {
            Orientation.allowPortraitOnly();
        }
    }, [isFocused]);

    React.useEffect(() => {
        if (params.coleta?.codigoOS || params.novaColeta) {
            setKmInicial(params.coleta?.KMInicial || 0);
            setKmFinal(params.coleta?.KMFinal || 0);

            if (params.coleta?.mtrs?.length) {
                setMtrsRelacao(params.coleta.mtrs);
            }

            if (params.coleta?.fotos?.length) {
                setPhotos(params.coleta.fotos);
            }

            setColeta(params.coleta);
            if (!params.novaColeta) {
                verificarMtr();
            }
        }
    }, [params.coleta]);

    React.useEffect(() => {
        if (params.assinatura && params.assinatura.length > 0) {
            setAssinaturaColeta(params.assinatura);
        }
    }, [params.assinatura]);

    const goBackFunction = async () => {
        if (rascunho?.codigoCliente || rascunho?.codigoOS) {
            await atualizarGravarRascunho({
                ...coleta,
                mtrs: mtrsRelacao,
                fotos: photos,
            });
        }

        navigation.goBack();
    };

    React.useEffect(() => {
        if (params.scanData && params.scanData.length > 0) {
            onChangeCodigoBarrasMTR(params.scanData);
            navigation.setParams({ scanData: '' });
        }
    }, [params.scanData]);

    React.useEffect(() => {
        if (params.photo && params.photo.base64) {
            setPhotos([...photos, params.photo]);
        }
    }, [params.photo]);

    const navigateToScanCode = () =>
        navigation.navigate(AuthRoutes.Scanner, {
            message: I18n.t('screens.collectCheck.scanMessage'),
            scanType: 'code39',
            screen: AuthRoutes.ColetaResponsavel,
        });

    const navigateToAssinatura = (coletaAgendada: IOrder, isNovaColeta: boolean) =>
        navigation.navigate(AuthRoutes.Assinatura, {
            screen: AuthRoutes.ColetaResponsavel,
            coleta: coletaAgendada,
            novaColeta: isNovaColeta,
            codigoQuestionario: 0,
            grupos: [],
            motivo: {},
            perguntas: [],
            placa: '',
        });

    const goToCamera = () => {
        navigation.navigate(AuthRoutes.Camera, {
            message: I18n.t('components.addPhoto.defaultMessage'),
            isFront: false,
            screen: AuthRoutes.ColetaResponsavel,
        });
    };

    const continuarColeta = async (data: any) => {
        const newColeta: IOrder = {
            ...coleta,
            CPFCNPJResponsavel: data?.cpfcnpj,
            KMInicial: kmInicial,
            KMFinal: kmFinal,
            placa: !coleta?.placa ? placa ?? '' : coleta?.placa,
            dataOS: coleta?.dataOS ? coleta?.dataOS : timezoneDate(new Date()),
            codigoRoterizacao: coleta?.codigoRoterizacao ?? 0,
            ordemColetaPendente: coleta?.ordemColetaPendente ?? 0,
            nomeResponsavel: data?.responsavel,
            funcaoResponsavel: data?.funcaoResponsavel,
            emailResponsavel: data?.emailResponsavel,
            observacaoOS: data?.observacao,
            mtr: data?.mtr,
            mtrs: mtrsRelacao,
            codigoBarraMTR: data?.mtrBarra,
            fotos: photos,
            assinaturaBase64: assinaturaColeta,
            enderecoOS: {
                ...coleta?.enderecoOS,
                latLng: {
                    latitude: localizacao?.latitude ?? 0,
                    longitude: localizacao?.longitude ?? 0,
                },
            },
        };

        await atualizarGravarRascunho(newColeta);

        if (resumo) {
            navigation.navigate(AuthRoutes.ResumoDaColeta, { coleta: newColeta, novaColeta: params.novaColeta });
        } else if (isSignature) {
            navigateToAssinatura(newColeta, params.novaColeta);
        } else {
            if (!newColeta.residuos) {
                auditar(`residuos sumiram em coletaresponsavel->continuarcoleta${newColeta.residuos}`);
            }
            const codigo = params.novaColeta ? newColeta?.codigoCliente : newColeta.codigoOS;

            await storageContext.gravarAuditoria({
                codigoRegistro: codigo ?? 0,
                descricao: `Clicou em Enviar na Tela de Responsável ${codigo}`,
                rotina: 'Enviar Tela Responsável',
                tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
            });

            const response = await enviarColeta(newColeta, params.novaColeta);

            if (response) {
                if (params.novaColeta) {
                    navigation.navigate(AuthRoutes.Home);
                } else {
                    navigation.navigate(AuthRoutes.ColetasAgendadas, {
                        codigoOSEnviada: newColeta?.codigoOS ?? 0,
                    });
                }
            }
        }

        formRef.current.setErrors({});
        setValidatingSignature(false);
    };

    const finalizarColeta = async (data: any) => {
        setValidatingSignature(true);

        if (configuracoes.obrigarUmaFotoOS && !resumo && !photos?.length) {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.collectCheck.photoRequired'),
            });
        } else {
            try {
                if (!coleta?.residuos?.length && !coleta?.motivo?.codigo) {
                    dispatchAlert({
                        type: 'open',
                        alertType: 'info',
                        onPressRight: () => null,
                        message:
                            'Por favor, certifique-se de fornecer informações sobre os resíduos na Ordem de Serviço (OS) ou, caso não haja resíduos, inclua um motivo de não coleta.',
                    });

                    setValidatingSignature(false);

                    return;
                }

                const schema = Yup.object().shape({
                    responsavel: coleta?.motivo?.codigo
                        ? coleta.motivo.obrigarNomeResponsavel
                            ? Yup.string().required(I18n.t('screens.collectCheck.form.responsibleRequired'))
                            : Yup.string()
                        : configuracoes?.obrigarNomeResponsavel
                            ? Yup.string().required(I18n.t('screens.collectCheck.form.responsibleRequired'))
                            : Yup.string(),
                    funcaoResponsavel: coleta?.motivo?.codigo
                        ? coleta?.motivo?.obrigarFuncaoResponsavel
                            ? Yup.string().required(I18n.t('screens.collectCheck.form.responsibleFunctionRequired'))
                            : Yup.string()
                        : configuracoes?.obrigarFuncaoResponsavel
                            ? Yup.string().required(I18n.t('screens.collectCheck.form.responsibleFunctionRequired'))
                            : Yup.string(),
                    emailResponsavel: Yup.string().email(I18n.t('screens.collectCheck.form.invalidEmail')),
                    observacao: Yup.string(),
                    cpfcnpj: Yup.string().test('CPF Validation', I18n.t('yup.cpf'), value => {
                        if (!value) return true;

                        const newValue = value.replace(/[^0-9]/g, '');

                        if (newValue.length === 11) return validateCPF(newValue);
                        if (newValue.length === 14) return validateCNPJ(newValue);

                        if (newValue && newValue.length > 0) return false;
                        return true;
                    }),
                    mtr: Yup.string(),
                    mtrBarra: Yup.string(),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                const temKmInicial = Boolean(kmInicial !== 0);
                const temKmFinal = Boolean(kmFinal !== 0);

                if (temKmInicial && temKmFinal && !naoMostrarAlerta) {
                    return dispatchAlert({
                        type: 'open',
                        alertType: 'confirm',
                        message: 'Deseja alterar o km da coleta?',
                        onPressRight: () => setKmAlert(true),
                        textRight: 'Alterar',
                        textLeft: 'Continuar',
                        onPressLeft: () => {
                            closeMe();
                            setValidatingSignature(true);
                            continuarColeta(data);
                        },
                    });
                }

                if (temKmInicial && !temKmFinal) {
                    setValidatingSignature(false);

                    return setKmAlert(true);
                }

                continuarColeta(data);
            } catch (e) {
                if (e instanceof Yup.ValidationError) {
                    const mensagensErros: any = {};

                    e.inner.forEach(erro => {
                        mensagensErros[erro.path] = erro.message;

                        dispatchSnack({
                            type: 'open',
                            alertType: 'info',
                            message: I18n.t('yup.vericationError'),
                        });
                    });

                    formRef.current.setErrors(mensagensErros);
                }
            }
        }

        setNaoMostrarAlerta(false);
        setValidatingSignature(false);
    };

    return {
        formRef,
        mtrsRelacao,
        photos,
        coleta,
        initialData,
        configuracoes,
        validatingSignature,
        bottomSheetRef,
        kmAlert,
        kmInicial,
        kmFinal,
        setKmAlert,
        setKmFinal,
        goToCamera,
        setKmInicial,
        goToGaleraFotos,
        setIsSignature,
        onChangeMTR,
        setResumo,
        deletarMtr,
        finalizarColeta,
        goBackFunction,
        onChangeObservacao,
        navigateToAdicionarMtr,
        setPhotos,
        setNaoMostrarAlerta,
        navigateToScanCode,
        onChangeCodigoBarrasMTR,
        onChangeCPFCNPJResponsavel,
        onChangeNomeResponsavel,
        onChangeEmailResponsavel,
        onChangeFuncaoResponsavel,
        calcularValorOS,
    };
}
