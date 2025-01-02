import CodigoIDResiduo02092021 from './02092021_codigoIDResiduo';
import QuantidadeInteiraResiduo02122021 from './02122021_quantidadeInteiraResiduo';
import NomeFantasiaOS05112021 from './05112021_nomeFantasiaOS';
import PeriodicidadeOS10122021 from './10122021_periodicidadeOS';
import CorResiduo24082021 from './24082021_corResiduo';
import RoteirizacaoOS21092021 from './24092021_roteirizacaoOS';
import NaoGerarMovimentacao466910 from './466910_naoGerarMovimentacao';
import PDFMtrOnline472203 from './472203_pdfMtrOnline';
import PreCadastroReferencia489228 from './489228_preCadastroReferencia';
import SomanteEquipamentosPontoColeta495995 from './495995_somanteEquipamentosPontoColeta';
import ValorOS501078 from './501078_valorOS';
import VinculaOsCheckin504356 from './504356_vinculaOsCheckin';
import AtualizarCheckoutOS508419 from './508419_AtualizarCheckoutOS';
import EtapasImobilizados512093 from './512093_etapasImobilizados';
import PesoEResiduoImobilizado513876 from './513876_pesoEResiduoImobilizado';
import IdUnicoNovaColeta523641 from './523641_id_unico_nova_coleta';
import ResiduoSomenteComEquipamento535376 from './535376_residuo_somente_com_equipamento';

export const initMigration = async () => {
  const migrationValues = {
    corResiduo24082021: CorResiduo24082021(),
    codigoIDResiduo02092021: CodigoIDResiduo02092021(),
    roteirizacaoOS21092021: RoteirizacaoOS21092021(),
    nomeFantasiaOS05112021: NomeFantasiaOS05112021(),
    quantidadeInteiraResiduo02122021: QuantidadeInteiraResiduo02122021(),
    periodicidadeOS10122021: PeriodicidadeOS10122021(),
    naoGerarMovimentacao466910: NaoGerarMovimentacao466910(),
    pesoEResiduoImobilizado513876: PesoEResiduoImobilizado513876(),
    pdfMtrOnline472203: PDFMtrOnline472203(),
    preCadastroReferencia489228: PreCadastroReferencia489228(),
    somanteEquipamentosPontoColeta495995: SomanteEquipamentosPontoColeta495995(),
    valorOS501078: ValorOS501078(),
    vinculaOsCheckin504356: VinculaOsCheckin504356(),
    atualizarCheckoutOS508419: AtualizarCheckoutOS508419(),
    etapasImobilizados512093: EtapasImobilizados512093(),
    idUnicoNovaColeta523641: IdUnicoNovaColeta523641(),
    residuoSomenteComEquipamento535376: ResiduoSomenteComEquipamento535376()
  };

  for await (const migration of Object.values(migrationValues)) {
    for await (const init of Object.values(migration)) {
      await init();
    }
  }
};
