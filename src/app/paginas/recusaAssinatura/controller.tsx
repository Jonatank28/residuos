import * as React from 'react';
import I18n from 'i18n-js';
import { useVSSnack } from 'vision-common';
import { IOrder } from '../../../core/domain/entities/order';
import { useColeta } from '../../contextos/coletaContexto';
import { useLoading } from '../../contextos/loadingContexto';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';
import { auditar } from '../../../core/auditoriaHelper';

interface Props extends IControllerAuth<AuthRoutes.RecusaDeAssinatura> { }

export default function Controller({ navigation, params }: Props) {
    const { dispatchSnack } = useVSSnack();
    const { dispatchLoading } = useLoading();
    const { enviarColeta } = useColeta();
    const [coleta, setColeta] = React.useState<IOrder>({});
    const [responsavel, setResponsavel] = React.useState<string>('');
    const [motivoRecusa, setMotivoRecusa] = React.useState<string>('');

    const enviarColetaAgendada = async () => {
        dispatchLoading({ type: 'open' });

        coleta.motivoRecusaAssinatura = {
            nomeResponsavel: responsavel,
            motivo: motivoRecusa,
        };

        if (!coleta.residuos) {
            auditar(`residuos sumiram em recusaassinatura->enviarcoletaagendada${coleta.residuos}`);
        }

        const response = await enviarColeta(coleta, params.novaColeta);

        if (response) {
            if (params.novaColeta) {
                navigation.navigate(AuthRoutes.Home);
            } else {
                navigation.navigate(AuthRoutes.ColetasAgendadas, { codigoOSEnviada: coleta?.codigoOS ?? 0 });
            }
        }

        dispatchLoading({ type: 'close' });
    };

    const validarColeta = async () => {
        if (responsavel && responsavel.trim().length > 0) {
            if (motivoRecusa && motivoRecusa.trim().length > 0) {
                enviarColetaAgendada();
            } else {
                dispatchSnack({
                    type: 'open',
                    alertType: 'info',
                    message: I18n.t('screens.refuseSignature.reason.required'),
                });
            }
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.refuseSignature.responsible.required'),
            });
        }
    };

    React.useEffect(() => {
        if (params.coleta && (params.coleta.codigoOS || params.coleta.codigoCliente)) {
            if (params.coleta.nomeResponsavel && params.coleta.nomeResponsavel.trim().length > 0) {
                setResponsavel(params.coleta.nomeResponsavel);
            }

            setColeta(params.coleta);
        }
    }, [params.coleta]);

    return {
        coleta,
        responsavel,
        motivoRecusa,
        validarColeta,
        setResponsavel,
        setMotivoRecusa,
    };
}
