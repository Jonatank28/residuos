import * as React from 'react';
import * as Print from 'expo-print';
import I18n from 'i18n-js';
import { Orientation, useVSSnack } from 'vision-common';
import { IOrder } from '../../../../core/domain/entities/order';
import { useLoading } from '../../../contextos/loadingContexto';
import { useUser } from '../../../contextos/usuarioContexto';
import { renderHTMLOS } from '../../../utils/Printer';
import { useStorage } from '../../../contextos/storageContexto';
import { AuthRoutes } from '../../../routes/routes';
import { IEquipamento } from '../../../../core/domain/entities/equipamento';
import { IResiduo } from '../../../../core/domain/entities/residuo';
import { useColeta } from '../../../contextos/coletaContexto';
import { useIsFocused } from '@react-navigation/native';
import { IControllerAuth } from '../../../routes/types';
import Decimal from 'decimal.js';
import { auditar } from '../../../../core/auditoriaHelper';

interface Props extends IControllerAuth<AuthRoutes.ResumoDaColeta> { }

export default function Controller({ navigation, params }: Props) {
    const isFocused = useIsFocused();
    const { usuario, configuracoes } = useUser();
    const { dispatchSnack } = useVSSnack();
    const { enviarColeta } = useColeta();
    const { dispatchLoading } = useLoading();
    const storageContext = useStorage();
    const [coleta, setColeta] = React.useState<IOrder>({});
    const [visivel, setVisivel] = React.useState<boolean>(false);

    const navigateToResiduos = () =>
        navigation.navigate(AuthRoutes.ListaResiduosLocal, {
            residuos: coleta.residuos ?? [],
        });

    const navigateToEquipamentos = () =>
        navigation.navigate(AuthRoutes.ListaEquipamentosLocal, {
            equipamentos: coleta.equipamentos ?? [],
            equipamentosRetirados: [],
        });

    const navigateToDetalhesResiduo = (residuo: IResiduo) => {
        const residuosGenericos = coleta.residuos?.filter(residuoColeta => residuoColeta.codigo === residuo.codigo) || [];
        let subResiduosGenericos: IResiduo[] = [];

        residuosGenericos.forEach(generico => {
            subResiduosGenericos = [...subResiduosGenericos, ...(generico?.residuosSecundarios || [])];
        });

        const subResiduosGenericosUnicos = encontrarResiduosUnicos(subResiduosGenericos);

        navigation.navigate(AuthRoutes.DetalhesDoResiduoLocal, {
            residuo: { ...residuo, residuosSecundarios: subResiduosGenericosUnicos },
        });
    };

    const calcularValorOS = () => {
        let valorTotal = 0;

        if (coleta?.residuos && coleta.residuos?.length > 0) {
            coleta.residuos.forEach(_residuo => {
                valorTotal += Number(_residuo?.valorUnitario ?? 0) * Number(String(_residuo?.quantidade ?? '').replace(',', '.') ?? 0);
            });
        }

        return valorTotal;
    };

    const navigateToAssinatura = () => {
        if (configuracoes.obrigarUmaFotoOS && (!coleta?.fotos || coleta?.fotos?.length === 0)) {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.collectResume.photoRequired'),
            });
        } else {
            navigation.navigate(AuthRoutes.Assinatura, {
                screen: AuthRoutes.ResumoDaColeta,
                coleta,
                novaColeta: params.novaColeta,
                codigoQuestionario: 0,
                grupos: [],
                motivo: {},
                perguntas: [],
                placa: '',
            });
        }
    };

    const setVisivelModel = () => setVisivel(!visivel);

    const navigateToImpressoras = () => {
        navigation.navigate(AuthRoutes.Impressoras, { ordem: coleta });
        setVisivelModel();
    };

    const imprimirOS = async () => {
        const isNovaColeta = false;

        const html = renderHTMLOS(coleta, usuario ?? {}, isNovaColeta, configuracoes?.mostrarValoresOSResiduos);

        await Print.printAsync({
            html,
        });

        setVisivelModel();
    };

    const validarColeta = async () => {
        dispatchLoading({ type: 'open' });

        if (coleta.motivo?.codigo && !coleta.motivo?.obrigarAssinaturaResponsavel) {
            if (!coleta.residuos) {
                auditar(`residuos sumiram em ordservrepo->enviarcoleta${coleta.residuos}`);
            }
            await storageContext.gravarAuditoria({
                codigoRegistro: params.coleta?.codigoOS ?? 0,
                descricao: `Clicou em Enviar na Tela de Resumo ${params.coleta.codigoOS}`,
                rotina: 'Enviar Tela Resumo',
                tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
            });

            const response = await enviarColeta(coleta, params.novaColeta);

            console.log("akii envia a coleta", coleta)

            if (response && params.novaColeta) {
                navigation.navigate(AuthRoutes.Home);
            } else {
                navigation.navigate(AuthRoutes.ColetasAgendadas, { codigoOSEnviada: coleta.codigoOS ?? 0 });
            }
        } else {
            navigateToAssinatura();
        }

        dispatchLoading({ type: 'close' });
    };

    React.useEffect(() => {
        if (isFocused) {
            Orientation.defaultOrientation();
        }

        return () => { };
    }, [isFocused]);

    React.useEffect(() => {
        (async () => {
            if (params.coleta) {
                setColeta(params.coleta);

                const codigo = params.coleta?.codigoOS ? params.coleta?.codigoOS : params.coleta?.codigoCliente;

                await storageContext.gravarAuditoria({
                    codigoRegistro: codigo,
                    descricao: 'Acessou Tela de Resumo',
                    rotina: 'Abrir Tela de Resumo',
                    tipo: params.novaColeta ? 'NOVA_COLETA' : 'COLETA_AGENDADA',
                });
            }
        })();

        return () => { };
    }, [params.coleta]);

    const navigateToDetalhesEquipamentos = (equipamento: IEquipamento) => {
        if (equipamento?.codigoContainer) {
            navigation.navigate(AuthRoutes.DetalhesDoEquipamentoLocal, {
                equipamento,
            });
        } else {
            dispatchSnack({
                type: 'open',
                alertType: 'info',
                message: I18n.t('screens.equipamentListLocal.invalidCode'),
            });
        }
    };

    const residuosNormais = () => {
        if (!coleta.residuos) return [];

        return coleta.residuos.filter(residuo => !Boolean(residuo.xImobilizadoGenerico) && !residuo.residuosSecundarios?.length);
    };

    const encontrarResiduosUnicos = (residuos: IResiduo[]): IResiduo[] => {
        const mapaResiduos: { [codigo: string]: IResiduo } = {};

        residuos.forEach(residuo => {
            const { codigo } = residuo;
            if (codigo && !mapaResiduos[codigo]) {
                // Se o codigo não existir na váriavel, adiciona o residuo inteiro a váriavel
                mapaResiduos[codigo] = { ...residuo };
            } else if (codigo && mapaResiduos[codigo]) {
                // Se o codigo já existir na váriavel, atualiza a quantidade
                const residuoExistente = mapaResiduos[codigo];
                residuoExistente.quantidade = new Decimal(String(residuoExistente.quantidade || '0').replace(',', '.'))
                    .add(new Decimal(String(residuo.quantidade || '0').replace(',', '.')))
                    .abs()
                    .toString();
            }
        });

        // Retorna os valores da váriavel como um array de resíduos únicos
        return Object.values(mapaResiduos);
    };

    const residuosGenericos = () => {
        if (!coleta.residuos) return [];

        const genericosFiltrados = coleta.residuos.filter(residuo => Boolean(residuo?.xImobilizadoGenerico));

        if (!genericosFiltrados?.length) return [];

        const genericosUnicos = encontrarResiduosUnicos(genericosFiltrados);

        let subResiduosGenericos: IResiduo[] = [];

        genericosFiltrados.forEach(genericoUnico => {
            subResiduosGenericos = [...subResiduosGenericos, ...(genericoUnico?.residuosSecundarios || [])];
        });

        const subResiduosGenericosUnicos = encontrarResiduosUnicos(subResiduosGenericos);

        return [...genericosUnicos, ...subResiduosGenericosUnicos];
    };

    const contagemResiduosGenericos = (): { quantidade: number; unidade: string } => {
        if (!coleta.residuos) return { quantidade: 0, unidade: '' };

        let quantidadeGenericos: Decimal = new Decimal(0);
        let unidade: string[] = [];

        coleta.residuos.forEach(residuo => {
            if (Boolean(residuo?.xImobilizadoGenerico)) {
                quantidadeGenericos = quantidadeGenericos.add(String(residuo.quantidade || 1).replace(',', '.')).abs();
                if (residuo?.unidade && !unidade.includes(residuo.unidade)) {
                    unidade.push(residuo.unidade);
                }
            }
        });

        return { quantidade: quantidadeGenericos.toNumber(), unidade: unidade.join(', ') };
    };

    const contagemTotalSubResiduos = (): { quantidade: string; unidade: string } => {
        if (!coleta.residuos) return { quantidade: '0', unidade: '' };

        let quantidadeResiduosSecundarios: Decimal = new Decimal(0);
        let unidade: string[] = [];

        coleta.residuos.forEach(residuo => {
            if (Boolean(residuo?.xImobilizadoGenerico)) {
                if (residuo?.residuosSecundarios && residuo.residuosSecundarios?.length > 0) {
                    residuo.residuosSecundarios.forEach(residuoSecundario => {
                        quantidadeResiduosSecundarios = quantidadeResiduosSecundarios
                            .add(String(residuoSecundario.quantidade || 1).replace(',', '.'))
                            .abs();

                        if (residuoSecundario?.unidade && !unidade.includes(residuoSecundario.unidade)) {
                            unidade.push(residuoSecundario.unidade);
                        }
                    });
                }
            }
        });

        return { quantidade: quantidadeResiduosSecundarios.toString(), unidade: unidade.join(', ') };
    };

    return {
        coleta,
        visivel,
        configuracoes,
        usuario,
        contagemResiduosGenericos,
        contagemTotalSubResiduos,
        residuosNormais,
        validarColeta,
        residuosGenericos,
        imprimirOS,
        navigateToAssinatura,
        navigateToImpressoras,
        navigateToResiduos,
        navigateToDetalhesResiduo,
        navigateToDetalhesEquipamentos,
        navigateToEquipamentos,
        calcularValorOS,
        setVisivelModel,
    };
}
