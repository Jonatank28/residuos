import * as React from 'react';
import {
    Orientation,
    timezoneDate,
    useVSAlert,
    useVSConnection,
    useVSSnack,
    useUpdates,
    usePresenter,
    formatterCurrency,
} from 'vision-common';
import I18n from 'i18n-js';
import { Platform } from 'react-native';
import { AuthQuestionarioRoutes } from 'vision-questionario';
import Presenter from './presenter';
import { useUser } from '../../contextos/usuarioContexto';
import { IRegiao } from '../../../core/domain/entities/regiao';
import { ICliente } from '../../../core/domain/entities/cliente';
import { IOrder } from '../../../core/domain/entities/order';
import { useOffline } from '../../contextos/offilineContexto';
import { useAuth } from '../../contextos/authContexto';
import { useRascunho } from '../../contextos/rascunhoContexto';
import { useColeta } from '../../contextos/coletaContexto';
import { IObra } from '../../../core/domain/entities/obra';
import { IMotivo } from '../../../core/domain/entities/motivo';
import { IResiduo } from '../../../core/domain/entities/residuo';
import { IImobilizado } from '../../../core/domain/entities/imobilizado';
import { IEquipamento } from '../../../core/domain/entities/equipamento';
import { AuthRoutes } from '../../routes/routes';
import { IRota } from '../../../core/domain/entities/rota';
import { useIsFocused } from '@react-navigation/native';
import { DEVICE } from '../../../core/device/device';
import { useStorage } from '../../contextos/storageContexto';
import { IConfiguracaoTransportador, IDadosTransportador } from '../../../core/domain/entities/portalMtr/dadosTransportador';
import { IDadosGerador } from '../../../core/domain/entities/portalMtr/dadosGerador';
import {
    IEstadoFisicoPortal,
    IFormaAcondicionamentoPortal,
    IFormaTratamentoPortal,
    IResiduoPortal,
    ISubGrupoPortal,
    IUnidadePortal,
} from '../../../core/domain/entities/portalMtr/portal';
import { ILogoEmpresa } from '../../../core/domain/entities/portalMtr/logoEmpresa';
import { IConfiguracaoDestinador, IDadosDestinador } from '../../../core/domain/entities/portalMtr/dadosDestinador';
import { IControllerAuth } from '../../routes/types';
import { IDadosDispositivo } from '../../../core/domain/entities/dadosDispositivo';
import * as FileSystem from 'expo-file-system';
import Config from 'react-native-config';
import { IEstado } from '../../../core/domain/entities/estado';
import queue, { CANCEL, CancellablePromise, Worker } from 'react-native-job-queue';
import { WORKER_COLETAS } from '../../../core/constants';
import { IBalanca } from '../../../core/domain/entities/balanca/balanca';
import { IMovimentacaoEtapaEquipamento } from '../../../core/domain/entities/movimentacaoEtapaEquipamento';
import { IClienteCheckIn } from '../../../core/domain/entities/clienteCheckIn';
import { IImobilizadoGenericoContrato } from '../../../core/domain/entities/imobilizadoGenericoContrato';
import { auditar } from '../../../core/auditoriaHelper';
import { getString } from '../../../core/storageHelper';

interface Props extends IControllerAuth<AuthRoutes.Home> { }

export default function Controller({ navigation }: Props) {
    const { verificarAtualizacoesApp } = useUpdates();
    const { offline, toogleOffline } = useOffline();
    const { dispatchAlert } = useVSAlert();

    const {
        enviarColeta,
        pegarNovasColetasOffline,
        pegarColetasAgendadasOffline,
        deletarColetaAgendadaOffline,
        setVeiculo,
        pegarVeiculo,
        veiculo,
    } = useColeta();

    const { bloqueio, guardarBloqueio } = useAuth();
    const isFocused = useIsFocused();
    const { setRascunho } = useRascunho();
    const storageContext = useStorage();
    const { connectionState, connectionType } = useVSConnection();
    const { dispatchSnack } = useVSSnack();
    const { usuario, configuracoes, pegarConfiguracoes, pegarUsuario } = useUser();
    const presenter = usePresenter(() => new Presenter(usuario?.codigo ?? 0));
    const [regioes, setRegioes] = React.useState<IRegiao[]>();
    const [bloqueiaVersao, setBloqueiaVersao] = React.useState<boolean>(false);
    const [activeAlert, setActiveAlert] = React.useState<boolean>(false);
    const [progress, setProgress] = React.useState<{
        progress: number;
        message: string;
        hasError?: boolean;
    }>({ message: '', progress: 0 });
    const [dadosTotaisDispositivo, setDadosTotaisDispositivo] = React.useState<IDadosDispositivo>({});

    const pegarRegioes = async () => {
        const response: IRegiao[] = await presenter.getRegioes();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else {
            setRegioes(response);
            return response;
        }
    };

    const verificaStorage = async () => {
        const response = await presenter.getVeiculo();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else if (!response || !!(!response || !response?.codigo) || (regioes && regioes.length === 0)) {
            navigation.navigate(AuthRoutes.AdicionarRegioes, { isChange: false });
        } else {
            setVeiculo(response);
        }
    };

    const setSincronizacaoOK = async () => {
        const response = await presenter.sincronizacaoOK('');

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        }
    };

    const pegarVersaoRest = async () => {
        const response = await presenter.pegarVersaoRest(true);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        }
    };

    const verificarBloqueioVersao = async () => {
        const response = await presenter.verificarBloqueioVersao();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else {
            setBloqueiaVersao(!!response?.length);
        }
    };

    React.useEffect(() => {
        // SETA OFFLINE CASO CONFIGURAÇÃO ESTIVER ATIVA
        if (configuracoes) {
            toogleOffline(configuracoes.padraoOffline ?? false);
        }
        if (configuracoes.padraoOffline && !offline) {

            dispatchAlert({
                type: 'open',
                alertType: 'info',
                message: 'O Aplicativo está operando por padrão no modo offline',
                onPressRight: () => null,
            });
        }

        (async () => {
            const queueConfig = await getString('queueState');
            if (!queue.registeredWorkers[WORKER_COLETAS] && queueConfig === 'true') iniciarWorker();

            await pegarRegioes();

            if (connectionState) await pegarVersaoRest();

            verificarBloqueioVersao();
            verificaStorage();
            setRascunho(null);
        })();
        return () => { };
    }, [configuracoes]);

    const verificarQuestionario = async () => {
        // PROVISORY - APP CRASH IOS
        if (!connectionState || Platform.OS === 'ios' || !configuracoes?.habilitaFichaInspecao) {
            return true;
        }

        if (veiculo && veiculo?.codigo && veiculo?.placa) {
            const questionario = await presenter.verificarQuestionario(veiculo.placa);

            if (questionario instanceof Error) {
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: questionario.message,
                });
            } else if (questionario && questionario.codigo !== 0 && questionario.obrigatiorioResponderQuestionario) {
                setActiveAlert(false);
                setProgress({ message: '', progress: 0 });

                navigation.navigate<any>(AuthRoutes.QuestionarioRotas, {
                    screen: AuthQuestionarioRoutes.Questionario,
                    params: {
                        questionario,
                        veiculo: veiculo ?? {},
                    },
                });
            } else {
                if (bloqueio && bloqueio.length > 0) {
                    return false;
                }

                guardarBloqueio('');
                return true;
            }
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.home.boardError'),
            });
        }

        return false;
    };

    const showBloqueioVersaoAlert = () =>
        dispatchAlert({
            type: 'open',
            alertType: 'info',
            message: I18n.t('screens.home.versionAlert'),
            onPressRight: Platform.OS !== 'ios' ? () => verificarAtualizacoesApp() : () => null,
        });

    const navigateToColetasAgendadas = async () => {
        if (bloqueiaVersao) {
            return showBloqueioVersaoAlert();
        }

        const isOK = offline ? true : await verificarQuestionario();

        if (isOK) {
            navigation.navigate(AuthRoutes.ColetasAgendadas, {
                codigoOSEnviada: 0,
                filtros: {},
                scanData: '',
            });
        }
    };

    const navigateToClientes = () => navigation.navigate(AuthRoutes.Clientes, { isSelect: false, screen: '' });

    const navigateToRascunhos = () => navigation.navigate(AuthRoutes.Rascunhos, { rascunhoDeletado: {} });

    const navigateToMeusDados = () => navigation.navigate(AuthRoutes.MeusDados, { photo: {} });

    const navigateToHistoricoColetas = () =>
        navigation.navigate(AuthRoutes.HistoricoDeColetas, {
            filtros: {},
            scanData: '',
        });

    const navigateToNovaColeta = async () => {
        if (usuario && usuario.permiteCadastrarOrdemMobile) {
            if (bloqueiaVersao) {
                return showBloqueioVersaoAlert();
            }

            const isOK = offline ? true : await verificarQuestionario();

            if (isOK) {
                navigation.navigate(AuthRoutes.NovaColeta, {
                    cliente: {},
                    motivo: {},
                    obra: {},
                });
            }
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: I18n.t('screens.home.noOSPermission'),
            });
        }
    };

    const navigateConfiguracoes = () => navigation.navigate(AuthRoutes.Configuracoes);

    const navigateRelatorio = () => navigation.navigate(AuthRoutes.Relatorio);

    const deletarColetasEnviadas5Dias = async () => {
        const response = await presenter.deletarColetasEnviadas5Dias();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        }
    };

    const enviarNovasColetasOffline = async (coletas: IOrder[]) => {
        let index = 0;

        for await (const novaColeta of coletas) {
            incrementProgress(`Enviando ${index} de ${coletas.length} coletas pendentes`);
            const isNovaColeta = true;
            const isSincronizacao = true;

            const response = await enviarColeta(novaColeta, isNovaColeta, isSincronizacao);

            if (!response) {
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: 'Ocorreu um erro ao sincronizar uma OS',
                });
            }

            index++;
        }
    };

    const limpaDadosDispositivo = async () => {
        const response: any = await presenter.limpaDadosSincronizacao();
        console.log('LIMPA DADOS DISPOSITIVO ANTES DE PEGAR DADOS: ', response);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
            throw new Error(response.message);
        }
    };

    const enviarColetasAgendadasOffline = async (coletas: IOrder[]) => {
        let index = 0;

        for await (const coleta of coletas) {
            incrementProgress(`Enviando ${index} de ${coletas.length} coletas pendentes`);

            const response = await enviarColeta(coleta, false, true);

            if (response) {
                const responseDeletar = await deletarColetaAgendadaOffline(coleta);

                if (responseDeletar instanceof Error) {
                    dispatchSnack({
                        type: 'open',
                        alertType: 'error',
                        message: responseDeletar.message,
                    });
                }
            }

            index++;
        }
    };

    const gravarClientesStorage = async (clientes: ICliente[]) => {
        incrementProgress(`Gravando ${formatterCurrency(clientes.length)} clientes`);

        const response = await presenter.gravarClienteDevice(clientes);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarEquipamentosPendentesLiberacao = async (equipamentosPendentes: IMovimentacaoEtapaEquipamento[]) => {
        incrementProgress(`Gravando ${formatterCurrency(equipamentosPendentes.length)} equipamentos pendentes`);

        const response = await presenter.gravarEquipamentosPendentesLiberacaoDevice(equipamentosPendentes);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarImobilizadoGenericoContrato = async (imobilizadosGenericosContratos: IImobilizadoGenericoContrato[]) => {
        incrementProgress(`Gravando ${formatterCurrency(imobilizadosGenericosContratos.length)} Imobilizado Generico Contrato`);

        const response = await presenter.gravarImobilizadoGenericoContratoDevice(imobilizadosGenericosContratos);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarBalancasStorage = async (balancas: IBalanca[]) => {
        incrementProgress(`Gravando ${formatterCurrency(balancas.length)} balanças`);

        for await (const balanca of balancas) {
            const response = await presenter.gravarBalanca(balanca);

            if (response instanceof Error) {
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: response.message,
                });

                throw new Error(response.message);
            }
        }
    };

    const gravarResiduosContratoStorage = async (residuos: IResiduo[]) => {
        incrementProgress(`Gravando ${formatterCurrency(residuos.length)} resíduos com contrato`);

        const response = await presenter.gravarResiduoContratoDevice(residuos);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarResiduosBaseStorage = async (residuos: IResiduo[]) => {
        incrementProgress(`Gravando ${formatterCurrency(residuos.length)} resíduos complementares`);

        const response = await presenter.gravarResiduoBaseDevice(residuos);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarConfiguracoesTransportador = async (configuracoesTransportador: IConfiguracaoTransportador[]) => {
        const response = await presenter.gravarConfiguracoesTransportador(configuracoesTransportador);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarDadosGerador = async (dadosGerador: IDadosGerador[]) => {
        const response = await presenter.gravarDadosGerador(dadosGerador);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarDadosTransportador = async (dadosTransportador: IDadosTransportador[]) => {
        const response = await presenter.gravarDadosTransportador(dadosTransportador);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarEstadosFisicosPortal = async (estadosFisicos: IEstadoFisicoPortal[]) => {
        const response = await presenter.gravarEstadosFisicosPortal(estadosFisicos);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarFormasAcondicionamentoPortal = async (formasAcondicionamento: IFormaAcondicionamentoPortal[]) => {
        const response = await presenter.gravarFormasAcondicionamentoPortal(formasAcondicionamento);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarFormasTratamentoPortal = async (formasTratamento: IFormaTratamentoPortal[]) => {
        const response = await presenter.gravarFormasTratamentoPortal(formasTratamento);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarResiduosPortal = async (residuosPortal: IResiduoPortal[]) => {
        const response = await presenter.gravarResiduosPortal(residuosPortal);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarSubGruposPortal = async (subGruposPortal: ISubGrupoPortal[]) => {
        const response = await presenter.gravarSubGruposPortal(subGruposPortal);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarUnidadesPortal = async (unidadesPortal: IUnidadePortal[]) => {
        const response = await presenter.gravarUnidadesPortal(unidadesPortal);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarLogosEmpresas = async (logosEmpresas: ILogoEmpresa[]) => {
        const response = await presenter.gravarLogosEmpresas(logosEmpresas);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarConfiguracoesDestinadorMtr = async (configuracoesDestinador: IConfiguracaoDestinador[]) => {
        const response = await presenter.gravarConfiguracoesDestinadorMtr(configuracoesDestinador);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarDadosDestinador = async (dadosDestinador: IDadosDestinador[]) => {
        const response = await presenter.gravarDadosDestinador(dadosDestinador);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarResiduosStorage = async (residuos: IResiduo[]) => {
        incrementProgress(`Gravando ${formatterCurrency(residuos.length)} resíduos`);

        const response = await presenter.gravarResiduoDevice(residuos);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarImobilizadosStorage = async (imobilizados: IImobilizado[]) => {
        incrementProgress(`Gravando ${formatterCurrency(imobilizados.length)} imobilizados`);

        let response = await presenter.gravarImobilizadosDevice(imobilizados);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
            throw new Error(response.message);
        }

        // TODO: Verificar para pegar todos os imobilizados do pegar dados corretamente
        if (configuracoes.mostraImobilizadoTelaResiduosAPP) {
            const pegarTodosImobilizados = await presenter.pegarTodosImobilizados({
                paginacao: {
                    amount: 20,
                    page: 1,
                    search: '',
                },
            });

            if (pegarTodosImobilizados instanceof Error) {
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: pegarTodosImobilizados.message,
                });
                throw new Error(pegarTodosImobilizados.message);
            }

            response = await presenter.gravarTodosImobilizadosDevice(pegarTodosImobilizados.items);
            if (response instanceof Error) {
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: response.message,
                });
                throw new Error(response.message);
            }
        }
    };

    const gravarColetasStorage = async (coletas: IOrder[]) => {
        incrementProgress(`Gravando ${formatterCurrency(coletas.length)} coletas agendadas`);

        const response = await presenter.gravarColetasAgendadas(coletas);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarObrasClientesStorage = async (obras: IObra[]) => {
        incrementProgress(`Gravando ${formatterCurrency(obras.length)} clientes`);

        const response = await presenter.gravarObraCliente(obras);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarRotasColetasAgendadasStorage = async (rotas: IRota[]) => {
        incrementProgress(`Gravando ${formatterCurrency(rotas.length)} rotas`);

        const response = await presenter.gravarRotasColetasAgendadas(rotas);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarEstadosMTRStorage = async (estados: IEstado[]) => {
        incrementProgress(`Gravando ${formatterCurrency(estados.length)} estados mtr`);

        const response = await presenter.gravarEstadosMTRDevice(estados);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarEquipamentosClientesStorage = async (equipamentos: IEquipamento[]) => {
        incrementProgress(`Gravando ${formatterCurrency(equipamentos.length)} equipamentos`);

        const response = await presenter.gravarEquipamentosClienteDevice(equipamentos);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarEquipamentosContratossStorage = async (imobilizados: IImobilizado[]) => {
        incrementProgress(`Gravando ${formatterCurrency(imobilizados.length)} equipamentos contratos`);

        const response = await presenter.gravarImobilizadosContratos(imobilizados);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const gravarMotivosColetasStorage = async (motivos: IMotivo[]) => {
        incrementProgress(`Gravando ${formatterCurrency(motivos.length)} motivos`);

        const response = await presenter.gravarMotivos(motivos);

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw new Error(response.message);
        }
    };

    const pegarClientesCheckInSincronizacao = async () => {
        const response = await presenter.pegarCheckInClientesDevice();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else {
            return response;
        }
    };

    const pegarBalancasCadastradasMobileSincronizacao = async () => {
        const response = await presenter.pegarBalancasCadastradasMobile();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else {
            return response;
        }
    };

    const deletarDadosDevice = async () => {
        const response = await presenter.deletarDadosDevice();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });

            throw response.message;
        } else {
            return response;
        }
    };

    const incrementProgress = (message: string) =>
        setProgress(prev => ({
            message: message + '...',
            progress: prev.progress + 0.1,
        }));

    const iniciarWorker = () => {
        queue.addWorker(
            new Worker(
                WORKER_COLETAS,
                async (os: IOrder) => {
                    let cancel;
                    const queueConfig = await getString('queueState');
                    if (queueConfig === 'false') return;

                    const promise: CancellablePromise<any> = await new Promise<any>(async (resolve, reject) => {
                        const isNovaColeta = !(os?.codigoOS && os?.codigoOS !== 0);
                        const isSincronizacao = true;
                        const isSincronizacaoAutomatica = true;

                        let checkinsOS: IClienteCheckIn[] = [];

                        // PEGA CHECKINS
                        if (!isNovaColeta && os?.codigoOS) {
                            const res = await presenter.pegarCheckinsPorCodigoOS(os.codigoOS);

                            if (res instanceof Error) {
                                return reject(new Error('canceled'));
                            }

                            checkinsOS = res;
                        }

                        const response = await enviarColeta(os, isNovaColeta, isSincronizacao, checkinsOS, isSincronizacaoAutomatica);

                        console.log('response os Worker: ', response)

                        if (!response) {
                            return reject(new Error('canceled'));
                        }

                        // DELETA CHECKINS
                        if (checkinsOS.length > 0 && os?.codigoOS) {
                            await presenter.deletarCheckinsOrdemServico(os.codigoOS);
                        }

                        return resolve({});
                    });

                    promise[CANCEL] = cancel;
                    return promise;
                },
                {
                    onSuccess: async job => {
                        const queueConfig = await getString('queueState');
                        if (queueConfig === 'false') return;
                        const isNovaColeta = !!!(job.payload?.codigoOS && job.payload?.codigoOS !== 0);

                        if (!isNovaColeta) {
                            const response = await deletarColetaAgendadaOffline(job.payload);

                            if (response instanceof Error) {
                                console.log(response);
                            }
                        }

                        const veiculo = await pegarVeiculo();

                        await pegarDadosDispositivo(veiculo?.placa);
                    },
                    onFailure: async (job, error) => {
                        const queueConfig = await getString('queueState');
                        if (queueConfig === 'false') return;
                        const codigo = job.payload?.codigoOS ?? job.payload?.codigoCliente;

                        await storageContext.gravarAuditoria({
                            codigoRegistro: codigo,
                            descricao: `Erro ao enviar os ${codigo}, ${error?.message}`,
                            rotina: `Envio automático OS`,
                            tipo: 'LOG_FILA_COLETA',
                        });
                    },
                },
            ),
        );
    };


    const requeueJobs = async () => {
        const queueConfig = await getString('queueState');
        if (queueConfig === 'false') return;
        const jobs = await queue.getJobs();

        jobs.forEach(async job => !!job.failed && (await queue.requeueJob(job)));
    };

    React.useEffect(() => {
        if (queue.registeredWorkers[WORKER_COLETAS] && !queue.isRunning) {
            requeueJobs();
        }
    }, [queue.isRunning]);

    const removerTodosOsJobsDaFila = async () => {
        let jobs = await queue.getJobs();
        let jobRemovals = jobs.filter(job => job.id !== '').map(async job => await queue.removeJob(job));
        await Promise.all(jobRemovals);
    };

    const enviarDados = async () => {
        try {
            if (queue.isRunning) {
                queue.stop();
            }

            setProgress({ message: '', progress: 0 });
            incrementProgress('Verificando questionário');

            const isOK = await verificarQuestionario();

            if (isOK) {
                incrementProgress('Verificando dados dispositivo');

                const listaItensEnviar = await Promise.all([
                    storageContext.pegarAuditorias(),
                    pegarBalancasCadastradasMobileSincronizacao(),
                    pegarNovasColetasOffline(),
                    pegarColetasAgendadasOffline(),
                    pegarClientesCheckInSincronizacao(),
                ]);

                const auditorias = listaItensEnviar[0] ?? [];
                const balancas = listaItensEnviar[1] ?? [];
                const novasColetasOffline = listaItensEnviar[2] ?? [];
                const coletasAgendadasOffline = listaItensEnviar[3] ?? [];
                const clientesCheckInDevice = listaItensEnviar[4] ?? [];

                console.log(JSON.stringify(clientesCheckInDevice, null, 2));

                auditorias.push({
                    codigoMotorista: usuario?.codigo ?? 0,
                    codigoRegistro: usuario?.codigo ?? 0,
                    descricao: `Sincronizando aplicativo via: ${connectionType ?? '-'}`,
                    rotina: 'Sincronizar',
                    tipo: 'CONFIGURACOES',
                    data: timezoneDate(new Date()),
                });

                if (coletasAgendadasOffline.length > 0) await enviarColetasAgendadasOffline(coletasAgendadasOffline);
                if (novasColetasOffline.length > 0) await enviarNovasColetasOffline(novasColetasOffline);

                incrementProgress('Enviando dados complementares');

                const response = await presenter.enviarDados(auditorias, balancas, clientesCheckInDevice, usuario?.fotoBase64);

                if (response instanceof Error) {
                    dispatchSnack({
                        type: 'open',
                        alertType: 'error',
                        message: response.message,
                    });

                    throw new Error(response.message);
                } else {
                    incrementProgress('Limpando dispositivo');
                    const deletarResponse = await deletarDadosDevice();

                    if (deletarResponse) {
                        await removerTodosOsJobsDaFila();
                        await pegarDados();
                    } else {
                        dispatchSnack({
                            type: 'open',
                            alertType: 'error',
                            message: I18n.t('screens.home.synchronize.deleteError'),
                        });

                        throw new Error(I18n.t('screens.home.synchronize.deleteError'));
                    }
                }
            }

            if (Platform.OS !== 'ios') verificarAtualizacoesApp();
        } catch (err: any) {
            setProgress({ message: err?.message ?? '', progress: 0, hasError: true });

            await storageContext.gravarAuditoria({
                codigoRegistro: 0,
                descricao: err?.message ?? '',
                rotina: 'Erro ao enviar dados',
            });
        }
    };

    const pegarDados = async () => {
        try {
            incrementProgress('Coletando dados');

            const _regioes = await pegarRegioes();

            const response = await presenter.pegarDados(_regioes ?? [], veiculo?.placa ?? '', veiculo?.codigo ?? 0);

            if (response instanceof Error) {
                dispatchSnack({
                    type: 'open',
                    alertType: 'error',
                    message: response.message,
                });

                throw new Error(response.message);
            } else {
                if (response.clientes.length > 0) await gravarClientesStorage(response.clientes);

                if (response.balancas.length > 0) await gravarBalancasStorage(response.balancas);

                if (response.obrasClientes.length > 0) await gravarObrasClientesStorage(response.obrasClientes);

                if (response.equipamentosClientes.length > 0) await gravarEquipamentosClientesStorage(response.equipamentosClientes);

                if (response.equipamentosPendentesLiberacao.length > 0)
                    await gravarEquipamentosPendentesLiberacao(response.equipamentosPendentesLiberacao);

                if (response.imobilizadosGenericosContratos.length > 0)
                    await gravarImobilizadoGenericoContrato(response.imobilizadosGenericosContratos);

                if (response.equipamentosContratos.length > 0) await gravarEquipamentosContratossStorage(response.equipamentosContratos);

                if (response.motivos.length > 0) await gravarMotivosColetasStorage(response.motivos);

                if (response.imobilizados.length > 0) await gravarImobilizadosStorage(response.imobilizados);

                if (response.residuos.length > 0) await gravarResiduosStorage(response.residuos);

                if (response.residuosContrato.length > 0) await gravarResiduosContratoStorage(response.residuosContrato);

                if (response.residuosBase.length > 0) await gravarResiduosBaseStorage(response.residuosBase);

                if (response.coletasAgendadas.length > 0) await gravarColetasStorage(response.coletasAgendadas);

                if (response.rotasColetasAgendadas.length > 0) await gravarRotasColetasAgendadasStorage(response.rotasColetasAgendadas);

                if (response.estadosMTR.length > 0) await gravarEstadosMTRStorage(response.estadosMTR);

                incrementProgress('Gravando dados de portal MTR');
                if (response.dadosPortalMtr.configuracaoPortalTransportador.length > 0)
                    await gravarConfiguracoesTransportador(response.dadosPortalMtr.configuracaoPortalTransportador);

                if (response.dadosPortalMtr.dadosGerador.length > 0) await gravarDadosGerador(response.dadosPortalMtr.dadosGerador);

                if (response.dadosPortalMtr.dadosTransportador.length > 0)
                    await gravarDadosTransportador(response.dadosPortalMtr.dadosTransportador);

                if (response.dadosPortalMtr.estadoFisicoPortal.length > 0)
                    await gravarEstadosFisicosPortal(response.dadosPortalMtr.estadoFisicoPortal);

                if (response.dadosPortalMtr.formaAcondicionamentoPortal.length > 0)
                    await gravarFormasAcondicionamentoPortal(response.dadosPortalMtr.formaAcondicionamentoPortal);

                if (response.dadosPortalMtr.formaTratamentoPortal.length > 0)
                    await gravarFormasTratamentoPortal(response.dadosPortalMtr.formaTratamentoPortal);

                if (response.dadosPortalMtr.residuoPortal.length > 0) await gravarResiduosPortal(response.dadosPortalMtr.residuoPortal);

                if (response.dadosPortalMtr.subGrupoPortal.length > 0)
                    await gravarSubGruposPortal(response.dadosPortalMtr.subGrupoPortal);

                if (response.dadosPortalMtr.unidadePortal.length > 0) await gravarUnidadesPortal(response.dadosPortalMtr.unidadePortal);

                if (response.dadosPortalMtr.logosEmpresas.length > 0) await gravarLogosEmpresas(response.dadosPortalMtr.logosEmpresas);

                if (response.dadosPortalMtr.configuracoesDestinador.length > 0)
                    await gravarConfiguracoesDestinadorMtr(response.dadosPortalMtr.configuracoesDestinador);

                if (response.dadosPortalMtr.dadosDestinador.length > 0)
                    await gravarDadosDestinador(response.dadosPortalMtr.dadosDestinador);

                incrementProgress('Finalizando');

                await pegarConfiguracoes().then(async response => {
                    if (response) {
                        await storageContext.gravarAuditoria({
                            codigoRegistro: 0,
                            descricao: JSON.stringify(response),
                            rotina: 'Configurações Sincronização',
                            tipo: 'CONFIGURACOES',
                        });

                        toogleOffline(response.padraoOffline as boolean);
                    }
                });

                await setSincronizacaoOK();
                await pegarDadosDispositivo();
                await pegarVeiculo();
                fazerBackupAutomatico();

                if (connectionState) pegarUsuario();
                await verificarBloqueioVersao();

                setProgress({ message: 'Sincronizado com sucesso!', progress: 1 });
            }
        } catch (err: any) {
            setProgress({ message: err?.message ?? '', progress: 0, hasError: true });
        }
    };
    const verificaPlacaAlterada = async () => {
        const response = await presenter.verificaPlacaAlterada();

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else if (response && bloqueiaVersao) {
            showBloqueioVersaoAlert();
        } else if (response && DEVICE.MEMORY && DEVICE.MEMORY > 1000) {
            setActiveAlert(() => true);
            await enviarDados();
        }
    };

    const pegarDadosDispositivo = async (placa?: string) => {
        const response = await presenter.pegarDadosTotaisDispositivo(placa ?? veiculo?.placa ?? '');

        if (response instanceof Error) {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: response.message,
            });
        } else {
            setDadosTotaisDispositivo(response);
        }
    };

    const showBloqueioAlert = () =>
        dispatchAlert({
            type: 'open',
            alertType: 'info',
            message: bloqueio ?? '',
            onPressRight: () => undefined,
        });

    const showSemInternetAlert = () =>
        dispatchAlert({
            type: 'open',
            alertType: 'info',
            message: 'Para sincronizar é necessário estar conectado a internet!',
            onPressRight: () => undefined,
        });

    const showModalSincronizacao = () =>
        dispatchAlert({
            type: 'open',
            alertType: 'confirm',
            message: 'Deseja realizar a sincronização?',
            onPressRight: async () => {
                setActiveAlert(() => true);
                await enviarDados();
            },
        });

    const showSincronizarAlert = async () => {
        if (bloqueiaVersao) showBloqueioVersaoAlert();
        else if (!connectionState) showSemInternetAlert();
        else showModalSincronizacao();
    };

    const fazerBackupAutomatico = async () => {
        const formData: FormData = new FormData();
        const databaseFile = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}/SQLite/${Config.APP_DATABASE_V1_KEY}.db`);

        if (databaseFile.exists) {
            formData.append('residuosDB', {
                uri: databaseFile.uri,
                type: 'database/bd',
                name: 'residuos',
            });

            const response = await presenter.fazerBackupAutomatico(formData);

            if (response instanceof Error) {
                console.log(response.message);
            }
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'error',
                message: I18n.t('screens.backup.noDatabase'),
            });
        }
    };

    React.useEffect(() => {
        if (bloqueio && bloqueio?.length > 0) {
            showBloqueioAlert();
        }
    }, [bloqueio]);

    React.useEffect(() => {
        (async () => {
            if (isFocused) {
                // limpar rascunho antigo
                setRascunho({});

                await Orientation.defaultOrientation();
                await deletarColetasEnviadas5Dias();
                await verificaPlacaAlterada();

                if (veiculo?.codigo && veiculo?.placa) {
                    await pegarDadosDispositivo();
                }
            }
        })();
    }, [isFocused]);

    return {
        offline,
        bloqueio,
        activeAlert,
        progress,
        usuario,
        storageContext,
        dadosTotaisDispositivo,
        showSincronizarAlert,
        navigateToColetasAgendadas,
        navigateToClientes,
        navigateToRascunhos,
        navigateToHistoricoColetas,
        navigateToNovaColeta,
        navigateConfiguracoes,
        navigateToMeusDados,
        navigateRelatorio,
        setActiveAlert,
        enviarDados,
        limpaDadosDispositivo,
    };
}
