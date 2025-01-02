import I18n from 'i18n-js';
import { ApiException, capitalize } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IDropDownItems } from '../../../../../app/componentes/dropdownOptions';
import { IFiltro } from '../../../entities/filtro';
import { IDeviceEnderecoRepositorio } from '../../../repositories/device/enderecoRepositorio';

export interface IPegarCidadesColetasAgendadasParams {
  placa: string;
  filtros?: IFiltro;
}

export default class PegarCidadesColetasAgendadasUseCase implements UseCase<IPegarCidadesColetasAgendadasParams, IDropDownItems[] | Error> {

  constructor(private readonly iEnderecoRepositorio: IDeviceEnderecoRepositorio) { }

  async execute(params: IPegarCidadesColetasAgendadasParams): Promise<IDropDownItems[] | Error> {
    try {
      const dropdownItems: IDropDownItems[] = [
        { label: I18n.t('screens.sheduledCollections.allCities'), value: '1' }
      ];

      const response = await this.iEnderecoRepositorio.pegarCidadesColetasAgendadas(params.placa, params.filtros);

      if (response.length > 0) {
        for await (const cidadeItem of response._array) {
          dropdownItems.push({
            // @ts-ignore
            label: capitalize(cidadeItem['DS_CIDADE']),
            // @ts-ignore
            value: capitalize(cidadeItem['DS_CIDADE']),
          });
        }
      }

      return dropdownItems;
    } catch (e) {
      return ApiException(e);
    }
  };
}
