import I18n from 'i18n-js';
import { capitalize, formatarData, formatarDataHora, formatarPlaca } from 'vision-common';
import { IMtrAuxiliar } from '../../../core/domain/entities/portalMtr/mtrAuxiliar';
import { enderecoFormatado } from '../formatter';

const styles = `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  table,
  th,
  td {
    text-align: left;
    padding: 5px;
    font-size: 11pt;
    border-collapse: collapse;
    border: 1px solid black;
  }
</style> `;

export const renderHTMLMTROS = (dados: IMtrAuxiliar, placa: string, codigoOS: number, mtr: string) => {
  let html = `
  <main>
    <div style="position: relative; height: 110px; display: flex; flex-direction: row; margin-bottom: 10px;">
      <div style="position: absolute; top: 0px; left: 0px;">
        ${dados?.logoEmpresa && dados.logoEmpresa?.length > 0 && (
      `<img src="data:image/png;base64, ${dados.logoEmpresa}" width="120px" height="100px" alt="" />`
    )}
      </div>
      <div style="display: flex; flex: 1; align-items: center; justify-content: center;">
        <h3>${I18n.t('printer.mtrPortal.title')}</h3>
      </div>
      <div style="position: absolute; bottom: 0px; right: 0px;">
          <p>${I18n.t('printer.mtrPortal.mtr', {
      mtr: mtr
    })}</p>
      </div>
    </div>

    <section style="margin-bottom: 10px;" class="gerador-container">
    <table style="width:100%">
      <tr>
        <th colspan="10" style="border: none;"><strong>${I18n.t('printer.mtrPortal.generatorData.title').toUpperCase()}</strong></th>
      </tr>
      <tr colspan="10">
        <td colspan="6">${I18n.t('printer.mtrPortal.generatorData.name', {
      name: dados?.dadosGerador?.nomeCliente ?? ''
    })}</td>
        <td colspan="4">${I18n.t('printer.mtrPortal.generatorData.document', {
      document: dados?.dadosGerador?.cpfcnpj ?? ''
    })}</td>
      </tr>
      <tr colspan="10">
          <td colspan="3">${I18n.t('printer.mtrPortal.generatorData.address', {
      address: enderecoFormatado({
        bairro: dados?.dadosGerador?.bairro ?? '',
        rua: dados?.dadosGerador?.rua ?? '',
        numero: dados?.dadosGerador?.numero,
        cidade: dados?.dadosGerador?.municipio ?? '',
        uf: dados?.dadosGerador?.estado ?? ''
      })
    })}</td>
          <td colspan="3">${I18n.t('printer.mtrPortal.generatorData.phone', {
      phone: dados?.dadosGerador?.telefone ?? ''
    })}</td>
        <td colspan="4" rowspan="4" style="text-align: center;">
          <p style="text-align: left;">${I18n.t('printer.mtrPortal.generatorData.signatureDate', {
      date: formatarData(new Date(), 'DD/MM/YYYY')
    })}</p>
          ${dados?.dadosGerador?.assinaturaBase64 && dados.dadosGerador.assinaturaBase64?.length > 0 ? `
            <img style="border-bottom: 1px solid #1d1d1d" src="${!dados.dadosGerador.assinaturaBase64.includes('data:image')
              ? `data:image/png;base64, ${dados.dadosGerador.assinaturaBase64}`
              : dados.dadosGerador.assinaturaBase64}" width="150px" height="75px" alt="" />
          ` : '<br> _____________________'}
            <br> ${I18n.t('printer.mtrPortal.generatorData.signature')}
        </td>
      </tr>
      <tr colspan="10">
        <td colspan="2">${I18n.t('printer.mtrPortal.generatorData.city', {
      city: dados?.dadosGerador?.municipio ?? ''
    })}</td>
        <td colspan="1">${I18n.t('printer.mtrPortal.generatorData.uf', {
      uf: dados?.dadosGerador?.estado ?? ''
    })}</td>
        <td colspan="3">${I18n.t('printer.mtrPortal.generatorData.cel', {
      cel: dados?.dadosGerador?.celular ?? ''
    })}</td>
      </tr>
      <tr colspan="10">
        <td colspan="3">${I18n.t('printer.mtrPortal.generatorData.responsibleName', {
      responsible: dados?.dadosGerador?.nomeResponsavel ?? ''
    })}</td>
        <td colspan="3">${I18n.t('printer.mtrPortal.generatorData.responsiblePosition', {
      position: dados?.dadosGerador?.funcaoResponsavel ?? ''
    })}</td>
      </tr>
    </table>
  </section>

    <section style="margin-bottom: 10px;" class="transportador-container">
      <table style="width:100%">
        <tr>
          <th colspan="10" style="border: none"><strong>${I18n.t('printer.mtrPortal.conveyorData.title')}</strong></th>
        </tr>
        <tr colspan="10">
          <td colspan="6">${I18n.t('printer.mtrPortal.conveyorData.name', {
      name: dados?.dadosTransportador?.nomeTransportador ?? ''
    })}</td>
          <td colspan="4">${I18n.t('printer.mtrPortal.conveyorData.document', {
      document: dados?.dadosTransportador?.cpfcnpj ?? ''
    })}</td>
        </tr>
        <tr colspan="10">
          <td colspan="3">${I18n.t('printer.mtrPortal.conveyorData.address', {
      address: enderecoFormatado({
        bairro: dados?.dadosTransportador?.bairro ?? '',
        rua: dados?.dadosTransportador?.rua ?? '',
        numero: dados?.dadosTransportador?.numero ?? 0,
        cidade: dados?.dadosTransportador?.municipio ?? '',
        uf: dados?.dadosTransportador?.estado ?? ''
      })
    })}</td>
          <td  colspan="3">${I18n.t('printer.mtrPortal.conveyorData.phone', {
      phone: dados?.dadosTransportador?.telefone ?? ''
    })}</td>
          <td colspan="4" rowspan="4" style="text-align: center;">
            <p style="text-align: left;">${I18n.t('printer.mtrPortal.conveyorData.signatureDate', {
      date: formatarData(new Date(), 'DD/MM/YYYY')
    })}</p>
            <br> _____________________
            <br> ${I18n.t('printer.mtrPortal.conveyorData.signature')}
          </td>
        </tr>
        <tr>
          <td colspan="2">${I18n.t('printer.mtrPortal.conveyorData.city', {
      city: dados?.dadosTransportador?.municipio ?? ''
    })}</td>
          <td colspan="1">${I18n.t('printer.mtrPortal.conveyorData.uf', {
      uf: dados?.dadosTransportador?.estado ?? ''
    })}</td>
          <td colspan="3">${I18n.t('printer.mtrPortal.conveyorData.cel', {
      cel: dados?.dadosTransportador?.celular ?? ''
    })}</td>
        </tr>
        <tr>
          <td colspan="3">${I18n.t('printer.mtrPortal.conveyorData.driverName', {
      driver: dados?.dadosTransportador?.motorista ?? ''
    })}</td>
          <td colspan="3">${I18n.t('printer.mtrPortal.conveyorData.board', {
      board: formatarPlaca(placa ?? '')
    })}</td>
        </tr>
      </table>
    </section>
    
    <section style="margin-bottom: 10px;" class="destinador-container">
      <table style="width:100%">
        <tr>
          <th colspan="10" style="border: none"><strong>${I18n.t('printer.mtrPortal.addresseeData.title')}</strong></th>
        </tr>
        <tr colspan="10">
          <td colspan="6">${I18n.t('printer.mtrPortal.addresseeData.name', {
      name: dados?.dadosDestinador?.NomeDestinador ?? ''
    })}</td>
          <td colspan="4">${I18n.t('printer.mtrPortal.addresseeData.document', {
      document: dados?.dadosDestinador?.cpfcnpj ?? ''
    })}</td>
        </tr>
        <tr colspan="10">
          <td colspan="3">${I18n.t('printer.mtrPortal.addresseeData.address', {
      address: enderecoFormatado({
        bairro: dados?.dadosDestinador?.bairro ?? '',
        rua: dados?.dadosDestinador?.rua ?? '',
        numero: dados?.dadosDestinador?.numero ?? 0,
        cidade: dados?.dadosDestinador?.municipio ?? '',
        uf: dados?.dadosDestinador?.estado ?? ''
      })
    })}</td>
          <td  colspan="3">${I18n.t('printer.mtrPortal.addresseeData.phone', {
      phone: dados?.dadosDestinador?.telefone ?? ''
    })}</td>
          <td colspan="4" rowspan="4" style="text-align: center;">
            <p style="text-align: left;">${I18n.t('printer.mtrPortal.addresseeData.signatureDate', {
      date: formatarData(new Date(), 'DD/MM/YYYY')
    })}</p>
            <br> _____________________
            <br> ${I18n.t('printer.mtrPortal.addresseeData.signature')}
          </td>
        </tr>
        <tr>
          <td colspan="2">${I18n.t('printer.mtrPortal.addresseeData.city', {
      city: dados?.dadosDestinador?.municipio ?? ''
    })}</td>
          <td colspan="1">${I18n.t('printer.mtrPortal.addresseeData.uf', {
      uf: dados?.dadosDestinador?.estado ?? ''
    })}</td>
          <td colspan="3">${I18n.t('printer.mtrPortal.addresseeData.cel', {
      cel: dados?.dadosDestinador?.celular ?? ''
    })}</td>
        </tr>
        <tr>
          <td colspan="3">${I18n.t('printer.mtrPortal.addresseeData.responsibleName', {
      responsible: dados?.dadosDestinador?.responsavel ?? ''
    })}</td>
          <td colspan="3">${I18n.t('printer.mtrPortal.addresseeData.responsiblePosition', {
      position: dados?.dadosDestinador?.cargoResponsavel ?? ''
    })}</td>
        </tr>
      </table>
    </section>

    <section style="margin-bottom: 10px;" class="residuos-container">
      <table style="width:100%">
        <tr>
          <th colspan="8"><strong>${I18n.t('printer.mtrPortal.residuesData.title')}</strong></th>
        </tr>
        ${dados?.residuos && dados.residuos?.length > 0 ? `
          <tr style="border-bottom: 1px solid #1d1d1d;">
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column1')}</strong></th>
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column2')}</strong></th>
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column3')}</strong></th>
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column4')}</strong></th>
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column5')}</strong></th>
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column6')}</strong></th>
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column7')}</strong></th>
            <th style="border: none"><strong>${I18n.t('printer.mtrPortal.residuesData.columns.column8')}</strong></th>
          </tr>
          ${dados.residuos.map((residuo, index) => `
            <tr style="border-bottom: 1px solid #1d1d1d;">
              <td style="border: none; vertical-align: top;">${index + 1}.</td>
              <td style="border: none; vertical-align: top;">${capitalize(residuo?.descricaoResiduoSite ?? '-')}</td>
              <td style="border: none; vertical-align: top;">${capitalize(String(residuo?.estadoFisicoSite ?? '-'))}</td>
              <td style="border: none; vertical-align: top;">${capitalize(residuo?.classeSite ?? '-')}</td>
              <td style="border: none; vertical-align: top;">${capitalize(residuo?.acondicionamento ?? '-')}</td>
              <td style="border: none; vertical-align: top;">${residuo?.quantidade ?? 0}</td>
              <td style="border: none; vertical-align: top;">${capitalize(residuo?.unidade ?? '-')}</td>
              <td style="border: none; vertical-align: top;">${capitalize(residuo?.tecnologia ?? '-')}</td>
            </tr>
          `)}
        ` : `
          <tr>
            <td colspan="10" style="text-align: center;">Nenhum resíduo encontrado</td>
          </tr>
        `}
      </table>
    </section>
    <div style="display: flex; flex: 1; align-items: center; justify-content: center; flex-direction: column;">
      <h4>${I18n.t('printer.mtrPortal.footer.message', {
      os: codigoOS,
      date: formatarDataHora(new Date(), 'DD/MM/YYYY : HH:mm')
    })}</h4>
      <h4 style="color: #d40303; margin-top: 5px;">${I18n.t('printer.mtrPortal.footer.messageAlert')}</h4>
    </div>
  </main> `;

  html += styles;

  // .residuos-container {
  //   page-break-before: always;
  // }

  return html;
};
