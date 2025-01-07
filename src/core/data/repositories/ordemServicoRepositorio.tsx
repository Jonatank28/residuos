import Constants from 'expo-constants';
import { IOrdemServicoRepositorio } from '../../domain/repositories/ordemServicoRepositorio';
import { IEnviarColetaParams } from '../../domain/usecases/enviarColetaUseCase';
import { IInserirOSParams } from '../../domain/usecases/inserirOSManualUseCase';
import { IPegarColetasAgendadasParams } from '../../domain/usecases/pegarColetasAgendadasUseCase';
import { AsyncAxiosConnection, IPhoto } from 'vision-common';
import { IOrder } from '../../domain/entities/order';
import { randomHash } from '../../../app/utils/mixins';
import { imagensHelper } from '../../imagensHelper';
import { auditar } from '../../auditoriaHelper';

export default class OrdemServicoRepositorio implements IOrdemServicoRepositorio {
    constructor(private readonly _conn: AsyncAxiosConnection) { }

    async pegarColetasAgendadas(params: IPegarColetasAgendadasParams) {
        return this._conn.post(
            '/residuos/listarColetasAgendadas',
            {
                placa: params.placa ?? '',
                cidade: params.cidade ?? '',
                filtros: {
                    classificacao: params.filtros?.classificacao ?? 0,
                    roterizacao: params.filtros?.roterizacao ?? 0,
                    rota: params.filtros?.rota ?? 0,
                    codigoCliente: params.filtros?.cliente?.codigo ?? 0,
                    codigoObra: params.filtros?.obra?.codigo ?? 0,
                    dataColeta: params.filtros?.dataColeta ?? null,
                },
                pagina: params.pagination.page,
                pesquisa: params.pagination.search,
                linhas: params.pagination.amount
            }
        );
    }

    async pegarTodasColetasAgendadas() {
        return this._conn.get('/residuos/listarTodasColetasAgendadas');
    }

    async pegarColetaAgendada(codigoOS: number) {
        return this._conn.get(`/residuos/pegarColetaAgendada?codigoOS=${codigoOS ?? 0}`);
    }

    async pegarMotivos() {
        return this._conn.get('/residuos/listarMotivosColetas');
    }

    tratarImagem = (imagem: IPhoto): IPhoto => {
        const nome = randomHash();
        imagensHelper.addToQueue({ base64: imagem.base64 || '', nome });
        return { ...imagem, base64: '', nome };
    };

    removerimagens = (coleta: IOrder) => {
        const coletaSemImagens = {
            ...coleta,
            fotos: coleta.fotos?.map(this.tratarImagem),
            residuos: coleta.residuos?.map(residuo => ({
                ...residuo,
                fotos: residuo.fotos?.map(this.tratarImagem)
            }))
        };
        return coletaSemImagens;
    };

    async enviarImagemPendente(foto: { nome: string; base64: string; }) {
        try {
            const { status, data } = await this._conn.post('/residuos/enviarImagemPendente', foto);
            auditar(`Response da requisição enviarImagemPendente: ${status} - ${JSON.stringify(data)}`, 'enviarImagemPendente', 'info');
            if (status === 200) return Promise.resolve(foto);
            else return Promise.reject(foto);
        } catch (e) {
            console.error(e);
            return Promise.reject(foto);
        }
    };

    async enviarColeta(params: IEnviarColetaParams) {
        if (!params.coleta.residuos) {
            auditar(`residuos sumiram em ordservrepo->enviarcoleta${params.coleta.residuos}`)
        }
        const data = {
            codigoPlaca: params.placaID,
            perguntasRespondidas: params.coleta?.perguntasRespondidas ?? [],
            checkinsOS: params?.checkinsOS ?? [],
            ordemServico: {
                ...(this.removerimagens(params.coleta)),
                ordemID: params.coleta?.codigoOrdem ?? 0,
                paradas: params.coleta?.paradas ?? [],
                codigoDispositivo: params.coleta?.codigoDispositivo ?? 0,
                codigoMotorista: params.coleta?.codigoMotorista ?? 0,
                mtrCodigoBarra: params.coleta?.codigoBarraMTR,
                versaoAppSincronizacao: Constants?.manifest?.version ?? '',
                dataOSColetada: params.coleta?.dataOS,
                cidadeOS: params.coleta?.enderecoOS?.cidade ?? '',
                estadoOS: params.coleta?.enderecoOS?.uf ?? '',
                ruaOS: params.coleta?.enderecoOS?.rua ?? '',
                bairroOS: params.coleta?.enderecoOS?.bairro ?? '',
                numeroOS: params.coleta?.enderecoOS?.numero ?? '',
                letraOS: params.coleta?.enderecoOS?.letra ?? '',
                complementoOS: params.coleta?.enderecoOS?.complemento ?? '',
                equipamentosRetirados: params.coleta?.equipamentosRetirados ?? [],
                equipamentos: params.coleta?.equipamentos ?? [],
                latitudeOS: params.coleta?.enderecoOS?.latLng?.latitude ?? null,
                longitudeOS: params.coleta?.enderecoOS?.latLng?.longitude ?? null
            }
        }

        console.log("partadassaaaaaaaaaaa", data.ordemServico.paradas)
        data.ordemServico.residuos = data.ordemServico.residuos?.map(r => {
            //to-do - Thauã vai refatorar o que ele criou aqui. Boa Sorte. 
            let tara = r.imobilizado?.tara ?? '0';
            let quantidade = r.quantidade ?? '0';
            if (typeof tara === 'number') {
                tara = tara.toString();
            }
            if (typeof tara === 'string' && tara.includes(',')) {
                tara = tara.replace(',', '.');
            }
            if (typeof quantidade === 'string' && quantidade.includes(',')) {

                quantidade = quantidade.replace(',', '.');
            }
            const quantidadeConvertida = Number(quantidade);
            const taraNumber = Number(tara);
            const pesoFinal = quantidadeConvertida - taraNumber;
            const pesoFinalFormatado = pesoFinal.toFixed(5);
            return {
                ...r,
                CodigoImobilizadoNoResiduo: r.imobilizado?.codigo ?? 0,
                DescricaoImobilizadoNoResiduo: r.imobilizado?.descricao ?? '',
                PesoFinalImobilizadoNoResiduo: parseFloat(pesoFinalFormatado)
            };
        });

        const response = await this._conn.post(
            '/residuos/enviarColetaAgendada',
            data
        );

        await auditar(`Response da requisição enviaColetaAgendada: ${JSON.stringify(response)}`);
        return response;
    }

    async inserirOSManual(params: IInserirOSParams) {
        const data = {
            codigoPlaca: params.placaID,
            ordemServico: {
                ...(this.removerimagens(params.coleta)),
                ordemID: params.coleta?.codigoOrdem ?? 0,
                codigoDispositivo: params.coleta?.codigoDispositivo ?? 0,
                codigoMotorista: params.coleta?.codigoMotorista ?? 0,
                mtrCodigoBarra: params.coleta?.codigoBarraMTR,
                versaoAppSincronizacao: Constants?.manifest?.version ?? '',
                dataOSColetada: params.coleta?.dataOS,
                cidadeOS: params.coleta?.enderecoOS?.cidade ?? '',
                estadoOS: params.coleta?.enderecoOS?.uf ?? '',
                ruaOS: params.coleta?.enderecoOS?.rua ?? '',
                codigoVinculoMobile: params.coleta?.codigoVinculo ?? '',
                bairroOS: params.coleta?.enderecoOS?.bairro ?? '',
                numeroOS: params.coleta?.enderecoOS?.numero ?? '',
                letraOS: params.coleta?.enderecoOS?.letra ?? '',
                complementoOS: params.coleta?.enderecoOS?.complemento ?? '',
                equipamentos: params.coleta?.equipamentos ?? [],
                equipamentosRetirados: params.coleta?.equipamentosRetirados ?? [],
                latitudeOS: params.coleta?.enderecoOS?.latLng?.latitude ?? null,
                longitudeOS: params.coleta?.enderecoOS?.latLng?.longitude ?? null
            }
        }
        data.ordemServico.residuos = data.ordemServico.residuos?.map(r => {
            //to-do - Thauã vai refatorar o que ele criou aqui. Boa Sorte. 
            let tara = r.imobilizado?.tara ?? '0';
            let quantidade = r.quantidade ?? '0';
            if (typeof tara === 'number') {
                tara = tara.toString();
            }
            if (typeof tara === 'string' && tara.includes(',')) {
                tara = tara.replace(',', '.');
            }
            if (typeof quantidade === 'string' && quantidade.includes(',')) {

                quantidade = quantidade.replace(',', '.');
            }
            const quantidadeConvertida = Number(quantidade);
            const taraNumber = Number(tara);
            const pesoFinal = quantidadeConvertida - taraNumber;
            const pesoFinalFormatado = pesoFinal.toFixed(5);
            return {
                ...r,
                CodigoImobilizadoNoResiduo: r.imobilizado?.codigo ?? 0,
                DescricaoImobilizadoNoResiduo: r.imobilizado?.descricao ?? '',
                PesoFinalImobilizadoNoResiduo: parseFloat(pesoFinalFormatado)
            };
        })
        const response = await this._conn.post(
            '/residuos/inserirOSManual',
            data
        );

        await auditar(`Response da requisição inserirOSManual: ${response.status} - ${JSON.stringify(response.data)}`);

        return response;
    }

    async pegarRotas(placa: string) {
        return this._conn.get(`/residuos/pegarRotas?placa=${placa ?? ''}`);
    }
}

