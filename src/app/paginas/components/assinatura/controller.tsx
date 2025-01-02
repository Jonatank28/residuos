import I18n from 'i18n-js';
import * as React from 'react';
import { Orientation, getConnection, usePresenter, useVSAlert, useVSSnack } from 'vision-common';
import Presenter from './presenter';
import { useLoading } from '../../../contextos/loadingContexto';
import { useAuth } from '../../../contextos/authContexto';
import { useOffline } from '../../../contextos/offilineContexto';
import { useColeta } from '../../../contextos/coletaContexto';
import { useStorage } from '../../../contextos/storageContexto';
import { AuthRoutes } from '../../../routes/routes';
import { IControllerAuth } from '../../../routes/types';
import { useUser } from '../../../contextos/usuarioContexto';
import { useCheckin } from '../../../contextos/checkinContexto';
import { IDeviceClienteRepositorio } from '../../../../core/domain/repositories/device/clienteRepositorio';
import DeviceClienteRepositorio from '../../../../core/device/repositories/clienteRepositorio';
import database from '../../../../core/database';
import { useLocation } from '../../../contextos/localizacaoContexto';
import { auditar } from '../../../../core/auditoriaHelper';

interface Props extends IControllerAuth<AuthRoutes.Assinatura> { }

export default function Controller({ navigation, params }: Props) {
    const presenter = usePresenter(() => new Presenter());
    const signatureRef = React.useRef(null);
    const { dispatchSnack } = useVSSnack();
    const { enviarColeta } = useColeta();
    const { usuario, configuracoes } = useUser();
    const { localizacao } = useLocation();
    const storageContext = useStorage();
    const { fazerCheckOut, verificaClienteCheckIn } = useCheckin();
    const { offline } = useOffline();
    const { dispatchLoading } = useLoading();
    const { dispatchAlert, closeMe } = useVSAlert();
    const { guardarBloqueio, setBloqueio } = useAuth();
    const [signature, setSignature] = React.useState<string>('');
    const [showSignature, setShowSignature] = React.useState<boolean>(true);
    const [loadingData, setLoadingData] = React.useState<boolean>(true);
    const [hasDisabled, setHasDisabled] = React.useState<boolean>(false);

    const iClienteDeviceRepositorio: IDeviceClienteRepositorio = new DeviceClienteRepositorio(
        usuario?.codigo ?? 0,
        getConnection(database),
    );

    const navigateToRecusaAssinatura = () =>
        navigation.navigate(AuthRoutes.RecusaDeAssinatura, {
            coleta: params.coleta,
            novaColeta: params.novaColeta,
        });

    const toogleButton = () => setHasDisabled(!hasDisabled);

    const navigateToImpressoras = () => navigation.navigate(AuthRoutes.Impressoras, { ordem: params.coleta });

    const perguntarDesejaRealizarCheckout = async (clienteIDCheckin: number) => {
        if (clienteIDCheckin && params.coleta?.codigoCliente && Number(clienteIDCheckin) === params.coleta?.codigoCliente) {
            dispatchAlert({
                type: 'open',
                alertType: 'confirm',
                textLeft: 'Não',
                message: 'Deseja realizar o checkout da OS?',
                onPressRight: async () => {
                    await fazerCheckOut(localizacao, Number(params.coleta.codigoCliente), offline, iClienteDeviceRepositorio);

                    validarVoltaTela();
                },
                onPressLeft: () => {
                    validarVoltaTela();
                    closeMe();
                },
            });
        } else if (clienteIDCheckin && Number(clienteIDCheckin) !== 0) {
            dispatchAlert({
                alertType: 'confirm',
                type: 'open',
                title: 'Atenção!',
                message: `Existe um CheckIn Ativo no cliente ${clienteIDCheckin}, deseja finaliza-lo? `,
                onPressRight: async () => {
                    await fazerCheckOut(localizacao, Number(clienteIDCheckin), offline, iClienteDeviceRepositorio);
                    validarVoltaTela();
                },
                onPressLeft: () => {
                    validarVoltaTela();

                    closeMe();
                },
            });
        }
    };

    const validarVoltaTela = () => {
        if (params.novaColeta) {
            navigation.navigate(AuthRoutes.Home);
        } else if (params.coleta.codigoOS) {
            navigation.navigate(AuthRoutes.ColetasAgendadas, {
                codigoOSEnviada: params.coleta.codigoOS,
            });
        }

        setHasDisabled(false);
        dispatchLoading({ type: 'close' });
    };

    const verificaQuantidadeFotosOS = () => {
        if (signature && signature.length > 0 && params.screen && params.screen.length > 0) {
            let totalFotosOS = 0;
            // CONTA AS FOTOS DOS RESIDUOS
            if (params.coleta?.residuos && params.coleta.residuos?.length > 0) {
                params.coleta.residuos.forEach(residuo => {
                    if (residuo.fotos && residuo.fotos?.length > 0) {
                        totalFotosOS += residuo.fotos?.length;
                    }
                });
            }

            // SOMA AS RESIDUOS COM FOTOS DA OS
            totalFotosOS = totalFotosOS + (params.coleta?.fotos?.length || 0);

            if (totalFotosOS > 60) {
                dispatchAlert({
                    type: 'open',
                    alertType: 'confirm',
                    textLeft: 'Não',
                    message: 'Você informou muitas fotos na OS e pode gerar problemas, deseja continuar?',
                    onPressRight: () => handleSignature(),
                    onPressLeft: () => {
                        goBack();
                        toogleButton();
                        closeMe();
                    },
                });
            } else {
                handleSignature();
            }
        } else {
            setHasDisabled(false);
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('components.signature.requiredSignature'),
            });
        }
    };

    const handleSignature = async () => {
        if (!params.coleta.residuos) {
            auditar(`residuos sumiram em assinaturacontroller->handlesignature${params.coleta.residuos}`);
        }
        dispatchLoading({ type: 'open' });

        if (signature?.length && params.screen?.length) {
            if (params.coleta?.codigoOS || params.novaColeta) {
                const codigo = params.novaColeta ? params.coleta.codigoCliente : params.coleta.codigoOS;

                await storageContext.gravarAuditoria({
                    codigoRegistro: codigo ?? 0,
                    descricao: `Clicou em Enviar na Tela de Assinatura ${codigo}`,
                    rotina: 'Enviar Coleta',
                    tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
                });

                params.coleta.assinaturaBase64 =
                    params.novaColeta && offline ? signature.replace('data:image/png;base64,', '') : signature;

                await storageContext.gravarAuditoria({
                    codigoRegistro: codigo ?? 0,
                    descricao: JSON.stringify({
                        ...params.coleta,
                        residuos: params.coleta.residuos?.map(residuo => ({
                            ...residuo,
                            fotos: residuo.fotos?.map(foto => ({ ...foto, base64: foto.base64?.length })),
                        })),
                        fotos: params.coleta.fotos?.map(foto => ({ ...foto, base64: foto.base64?.length })),
                    }),
                    rotina: 'Dados Coleta',
                    tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
                });
                if (!params.coleta.residuos) {
                    auditar(`residuos sumiram em controllerassinatura->anteshandlesignature${params.coleta.residuos}`);
                }

                const response = await enviarColeta(params.coleta, params.novaColeta);

                if (response) {
                    if (configuracoes.alertaCheckoutOS && !configuracoes.checkOutAutomatico) {
                        const clienteIDCheckin = await verificaClienteCheckIn(iClienteDeviceRepositorio);

                        if (clienteIDCheckin && clienteIDCheckin !== 0) {
                            await perguntarDesejaRealizarCheckout(clienteIDCheckin);
                            return;
                        }
                    }

                    validarVoltaTela();
                }
            } else if (params.codigoQuestionario && params.codigoQuestionario !== 0) {
                const responseQuestionario = await presenter.enviarQuestionario(
                    params.codigoQuestionario,
                    params.placa,
                    params.grupos,
                    signature.replace('data:image/png;base64,', ''),
                );

                if (responseQuestionario instanceof Error) {
                    dispatchSnack({
                        type: 'open',
                        alertType: 'error',
                        message: responseQuestionario.message,
                    });
                } else {
                    dispatchSnack({
                        type: 'open',
                        alertType: 'success',
                        message: I18n.t('components.signature.inspectionSuccess'),
                    });

                    if (responseQuestionario && responseQuestionario.length > 0) {
                        guardarBloqueio(responseQuestionario);
                        setBloqueio(responseQuestionario);
                    } else {
                        guardarBloqueio('');
                        setBloqueio('');
                    }

                    navigation.navigate<any>(params.screen, { assinatura: signature });
                }
            } else {
                navigation.navigate<any>(params.screen, { assinatura: signature });
            }
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('components.signature.requiredSignature'),
            });
        }

        setHasDisabled(false);
        dispatchLoading({ type: 'close' });
    };

    // @ts-ignore
    const clearSignature = () => signatureRef?.current?.clearSignature();

    const goBack = async () => {
        if (params.screen && params.screen.length > 0) {
            navigation.navigate<any>(params.screen);
            await Orientation.allowPortraitOnly();
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('components.signature.requiredScreen'),
            });
        }
    };

    const onInit = async () => {
        if (params.coleta?.codigoOS || params.coleta?.codigoCliente) {
            const codigo = params.novaColeta ? params.coleta?.codigoCliente : params.coleta?.codigoOS;

            await storageContext.gravarAuditoria({
                codigoRegistro: codigo ?? 0,
                descricao: `Acessou Tela de Assinatura ${codigo}`,
                rotina: 'Abrir Assinatura',
                tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
            });
        }

        setLoadingData(false);
    };

    React.useEffect(() => {
        (async () => {
            await Orientation.allowLandScapeOnly();
        })();
    }, []);

    React.useEffect(() => {
        onInit();
    }, [params.coleta]);

    return {
        signature,
        signatureRef,
        loadingData,
        showSignature,
        hasDisabled,
        toogleButton,
        setHasDisabled,
        clearSignature,
        setShowSignature,
        navigateToImpressoras,
        setSignature,
        setLoadingData,
        navigateToRecusaAssinatura,
        handleSignature,
        goBack,
        verificaQuantidadeFotosOS,
    };
}
