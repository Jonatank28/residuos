/* eslint-disable max-len */
import I18n from 'i18n-js';
import { formatarDataHora, formatarPlaca, formatterCurrency } from 'vision-common';
import { IOrder } from '../../../core/domain/entities/order';
import { IUsuario } from '../../../core/domain/entities/usuario';
import { useUser } from '../../contextos/usuarioContexto';
import { enderecoFormatado } from '../formatter';

const styles = `
  <style>
    @page {
      margin: 5px;
    }

    * {
      margin: 0px;
      padding: 0px;
      box-sizing: border-box;
    }

    .container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .title-container {
      flex: 1;
      display: flex;
      padding: 10px;
      margin-bottom: 10px;
      align-items: center;
      justify-content: center;
    }

    .default-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: 10px;
      border: 1px solid #CECECE;
    }

    .default-title-container {
      flex: 1;
      padding: 15px 20px;
      background-color: #CECECE;
    }

    .sub-title-container {
      flex: 1;
      display: flex;
      padding: 10px;
      flex-wrap: wrap;
      flex-direction: row;
    }

    .sub-title-container>div {
      flex: 1;
      flex-wrap: wrap;
      margin-top: 5px;
      margin-right: 10px;
    }

    .observations-container {
      display: flex;
      align-items: center;
      margin: 10px;
    }

    .no-residuos-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .observation {
      margin-left: 10px;
    }
  </style> `;

export const renderHTMLOS = (coleta: IOrder, usuario: IUsuario, isNovaColeta: boolean, mostrarValoresOS?: boolean) => {
  const calcularValorOS = () => {
    let valorTotal = 0;

    if (coleta?.residuos && coleta.residuos?.length > 0) {
      coleta.residuos.forEach(_residuo => {
        valorTotal += Number(_residuo?.valorUnitario ?? 0) * Number(String(_residuo?.quantidade ?? '').replace(',', '.') ?? 0);
      });
    }

    return valorTotal;
  }


  let html = `
    <main class="container">
      <div class='title-container'>
        <h1>${I18n.t('printer.os.title', { os: coleta?.codigoOS && coleta.codigoOS !== 0 ? coleta.codigoOS : '' })}</div>
      <div class='default-container'>
        <div class='default-title-container'>
          <h1>${I18n.t('printer.os.clientDetails.title')}</h1>
        </div>

        <div class='sub-title-container'>
          <div>
            <h1 class='title'>${I18n.t('printer.os.clientDetails.reason')}</h1>
            <h2 class='description'>${coleta?.nomeCliente ?? ''}</h2>
          </div>
          <div>
            <h1 class='title'>${I18n.t('printer.os.clientDetails.cnpj')}</h1>
            <h2 class='description'>${coleta?.CNPJCliente ?? ''}</h2>
          </div>
          <div>
            <h1 class='title'>${I18n.t('printer.os.clientDetails.contact')}</h1>
            <h2 class='description'>${coleta?.telefoneCliente ?? ''}</h2>
          </div>
          <div>
            <h1 class='title'>${I18n.t('printer.os.clientDetails.address')}</h1>
            <h2 class='description'>${enderecoFormatado(coleta?.enderecoOS) ?? ''}</h2>
          </div>
        </div>
      </div>

      <div class='default-container'>
        <div class='default-title-container'>
          <h1>${I18n.t('printer.os.carrierDetails.title')}</h1>
        </div>

        <div class='sub-title-container'>
          <div>
            <h1 class='title'>${I18n.t('printer.os.carrierDetails.board')}</h1>
            <h2 class='description'>${formatarPlaca(coleta?.placa ?? '')}</h2>
          </div>
          <div>
            <h1 class='title'>${I18n.t('printer.os.carrierDetails.driver')}</h1>
            <h2 class='description'>${usuario?.nome ?? ''}</h2>
          </div>
        </div>
      </div>

      <div class='default-container'>
        <div class='default-title-container'>
          <h1>${I18n.t('printer.os.osDetails.title')}</h1>
        </div>

        <div class='sub-title-container'>
          <div>
            <h1 class='title'>${isNovaColeta
      ? I18n.t('printer.os.osDetails.clientCode')
      : I18n.t('printer.os.osDetails.osCode')}</h1>
            <h2 class='description'>${isNovaColeta ? coleta?.codigoCliente ?? '' : coleta?.codigoOS ?? ''}</h2>
          </div>
          <div>
            <h1 class='title'>${I18n.t('printer.os.osDetails.osDate')}</h1>
            <h2 class='description'>${formatarDataHora(coleta?.dataOS, 'DD/MM/YYYY : HH:mm')}</h2>
          </div>
        </div>
      </div>

      <div class='default-container'>
        <div class='default-title-container'>
          <h1>${I18n.t('printer.os.osWastes.title')}</h1>
        </div>
        ${coleta.residuos && coleta.residuos.length > 0
      ? coleta.residuos.map((residuo) => `
          <div class='sub-title-container'>
            <div>
              <h1 class='title'>${I18n.t('printer.os.osWastes.name')}</h1>
              <h2 class='description'>${residuo.descricao ?? ''}</h2>
            </div>
            <div>
              <h1 class='title'>${I18n.t('printer.os.osWastes.amount')}</h1>
              <h2 class='description'>${residuo.quantidade ?? ''}</h2>
            </div>
            <div>
              <h1 class='title'>${I18n.t('printer.os.osWastes.unity')}</h1>
              <h2 class='description'>${residuo.unidade ?? ''}</h2>
            </div>
          </div>
        `) : `<div class='no-residuos-container'>
          <h1>${I18n.t('printer.os.osWastes.noWaste')}</h1>
        </div>`}
      </div>

      <div class='default-container'>
        <div class='default-title-container'>
          <h1>${I18n.t('printer.os.responsibleDetails.title')}</h1>
        </div>

        <div class='sub-title-container'>
          <div>
            <h1 class='title'>${I18n.t('printer.os.responsibleDetails.name')}</h1>
            <h2 class='description'>${coleta.nomeResponsavel ?? ''}</h2>
          </div>
          <div>
            <h1 class='title'>${I18n.t('printer.os.responsibleDetails.function')}</h1>
            <h2 class='description'>${coleta.funcaoResponsavel ?? ''}</h2>
          </div>
          <div>
            <h1 class='title'>${I18n.t('printer.os.responsibleDetails.cpfcnpj')}</h1>
            <h2 class='description'>${coleta.CPFCNPJResponsavel ?? ''}</h2>
          </div>
        </div>
      </div>

      ${mostrarValoresOS ? `<div class='default-container'>
      <div class='default-title-container'>
        <h1>Valor</h1>
      </div>

      <div class='sub-title-container'>
        <div>
          <h1 class='title'></h1>
          <h2 class='description'>${formatterCurrency(calcularValorOS() ?? 0, { prefix: 'R$ ', precision: 2 })}</h2>
        </div>
      </div>
    </div>` : ''}

      <div class='observations-container'>
        <h1>${I18n.t('printer.os.observation')}</h1>
        <h1 class='observation'>${coleta.observacaoOS ?? ''}</h1>
      </div>
  </main> `;

  html += styles;

  return html;
};
