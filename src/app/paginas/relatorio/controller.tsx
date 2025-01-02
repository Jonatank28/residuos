import * as React from 'react';
import Presenter from './presenter';
import { AuthRoutes } from "../../routes/routes";
import { IControllerAuth } from "../../routes/types";
import { formatarData, usePresenter, useVSSnack } from 'vision-common';
import { useUser } from '../../contextos/usuarioContexto';
import { useColeta } from '../../contextos/coletaContexto';
import { IReport } from '../../../core/domain/entities/report';

interface Props extends IControllerAuth<AuthRoutes.Relatorio> { }

export default function Controller({ params }: Props) {
    const { usuario } = useUser();
    const { placa } = useColeta();
    const { dispatchSnack } = useVSSnack();
    const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));

    const [coletasAgendadas, setColetasAgendadas] = React.useState<IReport>({});
    const [historicoColetas, setHistoricoColetas] = React.useState<IReport>({});
    const [rascunhoColetas, setRascunhosColetas] = React.useState<IReport>({});
    const [dataUltimaSincronizacao, setDataUltimaSincronizacao] = React.useState<Date>();
    const [coletasPendentesDeEnvio, setColetasPendentesDeEnvio] = React.useState<boolean>(false);
    const [loadingData, setLoadingData] = React.useState<boolean>(false);

    const pegarRelatorio = async () => {
        setLoadingData(true);

        const response = await presenter.pegarRelatorio(placa);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message
            });
        } else {
            setDataUltimaSincronizacao(response.ultimaSincronizacao);
            setColetasPendentesDeEnvio(!!(response.historicoEnvioPendentes && response.historicoEnvioPendentes !== 0));

            setColetasAgendadas({
                title: 'Total',
                columns: ['Coletas Agendadas', 'Coletas Realizadas'],
                rows: [
                    {
                        totalColetas: response.totalOSAgendadas,
                        ColetasRealizadas: response.totalOSColetadas
                    }]
            });

            setHistoricoColetas({
                title: 'Histórico',
                columns: ['Coletas Enviadas', 'Pendentes de envio', 'Coletas Excluídas', 'Coletas em Entrega'],
                rows: [{
                    coletasEnviadas: response.totalOSEnviadas,
                    coletasPendentes: response.historicoEnvioPendentes,
                    ColetasExcluidas: response.osExcluidas,
                    ColetasEntrega: response.osEntrega,
                }]
            })

            if (response.rascunhos && response.rascunhos?.length > 0) {
                const newRascunhos = response.rascunhos?.map(rascunho => ({
                    os: rascunho?.codigoOS != 0 ? rascunho.codigoOS : "MOBILE",
                    cliente: rascunho?.nomeCliente ?? '',
                    data: formatarData(rascunho?.dataOS, 'DD/MM/YY')
                }));

                setRascunhosColetas({
                    title: 'Rascunhos',
                    columns: ["OS's", 'Cliente', 'Data'],
                    rows: newRascunhos
                });
            }
        }

        setLoadingData(false);
    }

    React.useEffect(() => {
        pegarRelatorio();

        return () => { };
    }, []);

    return {
        loadingData,
        coletasAgendadas,
        historicoColetas,
        rascunhoColetas,
        dataUltimaSincronizacao,
        coletasPendentesDeEnvio
    }
};