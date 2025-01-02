import * as React from 'react';
import I18n from 'i18n-js';
import Presenter from './presenter';
import { usePresenter, useVSAlert, useVSSnack } from 'vision-common';
import { IOrder } from '../../../core/domain/entities/order';
import { useRascunho } from '../../contextos/rascunhoContexto';
import { useStorage } from '../../contextos/storageContexto';
import { AuthRoutes } from '../../routes/routes';
import { useUser } from '../../contextos/usuarioContexto';
import { useIsFocused } from '@react-navigation/native';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.DetalhesDoRascunho> { }

export default function Controller({ navigation, params }: Props) {
    const isFocused = useIsFocused();
    const { usuario } = useUser();
    const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
    const { dispatchSnack } = useVSSnack();
    const { setRascunho } = useRascunho();
    const { dispatchAlert } = useVSAlert();
    const storageContext = useStorage();
    const [rascunhoDetalhes, setRascunhoDetalhes] = React.useState<IOrder>({});
    const [loadingData, setLoadingData] = React.useState<boolean>(true);

    const pegarRascunho = async () => {
        setLoadingData(true);

        const response = await presenter.pegarRascunho(params.rascunho);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else if (response.codigoOS || response.codigoCliente) {
            setRascunhoDetalhes(response);
        }

        setLoadingData(false);
    };

    const navigateToColeta = () => {
        if (rascunhoDetalhes.codigoOS || rascunhoDetalhes.codigoCliente) {
            if (rascunhoDetalhes.codigoOS) {
                navigation.navigate(AuthRoutes.DetalhesDaColeta, { coletaID: rascunhoDetalhes.codigoOS, motivo: {} });
            } else if (rascunhoDetalhes.codigoCliente) {
                navigation.navigate(AuthRoutes.NovaColeta, {
                    cliente: {
                        codigo: rascunhoDetalhes.codigoCliente,
                        nomeFantasia: rascunhoDetalhes.nomeCliente,
                        telefone: rascunhoDetalhes.telefoneCliente,
                        endereco: rascunhoDetalhes.enderecoOS
                    },
                    motivo: {},
                    obra: {}
                });
            }
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.draftsDetails.invalidCode'),
            });
        }
    };

    React.useEffect(() => {
        if ((params.rascunho.codigoOS || params.rascunho.codigoCliente) && isFocused) {
            pegarRascunho();
            setRascunho(null);
        }

        return () => { }
    }, [params.rascunho, isFocused]);

    const gravarAuditoria = async () => {
        if (rascunhoDetalhes?.codigoOS && rascunhoDetalhes?.codigoOS !== 0) {
            storageContext.gravarAuditoria({
                codigoRegistro: rascunhoDetalhes.codigoOS,
                descricao: `Motorista excluiu Rascunho da OS ${rascunhoDetalhes.codigoOS}`,
                rotina: 'Rascunho',
                tipo: 'RASCUNHO',
            });
        } else {
            storageContext.gravarAuditoria({
                codigoRegistro: rascunhoDetalhes.codigoCliente,
                descricao: `Motorista excluiu Rascunho do Cliente ${rascunhoDetalhes.codigoCliente} da Nova Coleta`,
                rotina: 'Rascunho',
                tipo: 'RASCUNHO',
            });
        }
    };

    const onPressDeleteRascunho = async () => {
        const response = await presenter.deletarRascunhoColeta(rascunhoDetalhes);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'success',
                message: I18n.t('screens.draftsDetails.deleteDraftSuccess'),
            });

            await gravarAuditoria();

            navigation.navigate(AuthRoutes.Rascunhos, { rascunhoDeletado: rascunhoDetalhes });
        }
    };

    const showDeletarAlert = () => dispatchAlert({
        type: 'open',
        alertType: 'confirm',
        message: I18n.t('screens.draftsDetails.deleteMessage'),
        onPressRight: onPressDeleteRascunho,
    });

    return {
        loadingData,
        rascunhoDetalhes,
        showDeletarAlert,
        onPressDeleteRascunho,
        navigateToColeta
    };
}
