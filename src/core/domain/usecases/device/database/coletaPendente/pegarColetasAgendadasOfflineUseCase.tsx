import { ApiException } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { setEndereco } from '../../../../entities/endereco';
import { IFiltro } from '../../../../entities/filtro';
import { IOrder } from '../../../../entities/order';
import { IDeviceMotivoRepositorio } from '../../../../repositories/device/deviceMotivoRepositorio';
import { IDeviceEnderecoRepositorio } from '../../../../repositories/device/enderecoRepositorio';
import { IDeviceImagemRepositorio } from '../../../../repositories/device/imagemRepositorio';
import { IDeviceMtrRepositorio } from '../../../../repositories/device/mtrRepositorio';
import { IDeviceOrdemServicoRepositorio } from '../../../../repositories/device/ordemServicoRepositorio';
import { IDeviceResiduoRepositorio } from '../../../../repositories/device/residuoRepositorio';

export interface IPegarColetasAgendadasOfflineParams {
    search?: string;
    filtros?: IFiltro;
}

export default class PegarColetasAgendadasOfflineUseCase
    implements UseCase<IPegarColetasAgendadasOfflineParams, IOrder[] | Error> {
    constructor(
        private readonly iDeviceOrdemServicoRepositorio: IDeviceOrdemServicoRepositorio,
        private readonly iDeviceEnderecoRepositorio: IDeviceEnderecoRepositorio,
        private readonly iDeviceImagemRepositoio: IDeviceImagemRepositorio,
        private readonly iDeviceResiduoRepositorio: IDeviceResiduoRepositorio,
        private readonly iDeviceMtrRepositorio: IDeviceMtrRepositorio,
        private readonly iDeviceMotivoRepositorio: IDeviceMotivoRepositorio,
    ) { }

    async execute(params: IPegarColetasAgendadasOfflineParams): Promise<IOrder[] | Error> {
        try {
            const ordens: IOrder[] = [];
            const limite = 30;
            let offset = 0;
            let xAcabouDados = true;

            while (xAcabouDados) {
                const response = await this.iDeviceOrdemServicoRepositorio.pegarColetasAgendadasPendente(
                    limite,
                    offset,
                    params.search,
                    params.filtros,
                );
                if (response.length === 0) {
                    xAcabouDados = false;
                    break;
                }

                if (response.length > 0) {
                    for await (const order of response._array) {
                        if (!order.codigoOS) continue;

                        const codigo = `@VRCOLETAAGENDADAPENDENTE:${order.codigoOS}`;
                        const codigoRetirado = `@VRCOLETAAGENDADAPENDENTE$RETIRADO:${order.codigoOS}`;

                        const endereco = await this.iDeviceEnderecoRepositorio.pegarEndereco(codigo);
                        const imagensOS = await this.iDeviceImagemRepositoio.pegarImagens(codigo);
                        const equipamentosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(codigo);
                        const equipamentosRetiradosOS = await this.iDeviceResiduoRepositorio.pegarEquipamentos(codigoRetirado);
                        const residuosOS = await this.iDeviceResiduoRepositorio.pegarResiduosVinculo(codigo);
                        const mtrsOS = await this.iDeviceMtrRepositorio.pegarMtrs(codigo);
                        const motivoOS = await this.iDeviceMotivoRepositorio.pegarMotivo(codigo);
                        const motivoRecusaAssinaturaOS = await this.iDeviceMotivoRepositorio.pegarMotivoRecusaAssinatura(codigo);

                        if (endereco) {
                            order.enderecoOS = setEndereco(endereco);
                        }

                        if (imagensOS.length > 0) order.fotos = imagensOS._array;

                        if (equipamentosOS.length > 0) order.equipamentos = equipamentosOS._array;

                        if (equipamentosRetiradosOS.length > 0) order.equipamentosRetirados = equipamentosRetiradosOS._array;

                        if (residuosOS.length > 0) {
                            order.residuos = residuosOS._array;

                            for await (const residuo of order.residuos) {
                                if (residuo.codigo) {
                                    residuo.xImobilizadoGenerico = Boolean(residuo?.xImobilizadoGenerico);

                                    // pega resíduos secundários
                                    if (residuo?.xImobilizadoGenerico && residuo?.codigo) {
                                        const residuosSecundarios = await this.iDeviceResiduoRepositorio.pegarResiduosSecundariosPesagem(
                                            `${codigo}-${residuo.id}`,
                                        );

                                        if (residuosSecundarios && residuosSecundarios._array) {
                                            residuo.residuosSecundarios = residuosSecundarios._array;
                                        }
                                    }
                                    //descobrir por que não está trazendo o imobilizado,
                                    // acho que não salva quando cria, já que não mostra quando volta para o resído na os
                                    const imobilizadoNoResiduo = await this.iDeviceResiduoRepositorio.pegarImobilizadoDoResiduoVinculo(
                                        `@IMOBILIZADO_RESIDUO:${residuo.codigo}-OS:${order.codigoOS}`,
                                    );

                                    if (imobilizadoNoResiduo?._array?.[0]?.codigo) {
                                        residuo.imobilizado = imobilizadoNoResiduo._array[0];
                                    }

                                    const imagensResiduo = await this.iDeviceImagemRepositoio.pegarImagens(`${codigo}-${residuo.id}`);

                                    if (imagensResiduo.length > 0) residuo.fotos = imagensResiduo._array;
                                }
                            }
                        }

                        if (mtrsOS.length > 0) {
                            order.mtrs = mtrsOS._array;

                            for await (const mtr of order.mtrs) {
                                if (!mtr.hasSinir && mtr?.codigoEstado) {
                                    const responseEstadoMtr = await this.iDeviceMtrRepositorio.pegarEstadoMtr(mtr.codigoEstado, codigo);

                                    if (responseEstadoMtr && responseEstadoMtr?.codigo) {
                                        mtr.estado = responseEstadoMtr;
                                    }
                                }
                            }
                        }

                        if (motivoOS && motivoOS?.codigo) {
                            order.motivo = motivoOS;
                        }

                        if (motivoRecusaAssinaturaOS && motivoRecusaAssinaturaOS?.motivo) {
                            order.motivoRecusaAssinatura = motivoRecusaAssinaturaOS;
                        }

                        ordens.push(order);
                    }
                }

                offset += limite;
            }

            return ordens;
        } catch (e) {
            return ApiException(e);
        }
    }
}
