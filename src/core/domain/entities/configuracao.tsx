export interface IConfiguracao {
  numeroCasasDecimaisResiduos: number;
  habilitaFichaInspecao?: boolean;
  permiteFiltrarCidade?: boolean;
  permiteExcluirResiduos?: boolean;
  obrigarNomeResponsavel?: boolean;
  obrigarFuncaoResponsavel?: boolean;
  naoUsarNomeFuncaoResponsavelColeta?: boolean;
  permiteMovimentarContainerAPP?: boolean;
  habilitarCodIdentificacaoImobilizado?: boolean;
  habilitarAssinaturaQuantidadeTelaResiduos?: boolean;
  permitirResiduosDuplicados?: boolean;
  somenteEquipamentosPontoColeta?: boolean;
  mostrarEquipamentosPontoColetaOuCliente?: boolean;
  mostrarValoresOSResiduos?: boolean;
  obrigarUmaFotoOS?: boolean;
  obrigarInformarMtrOnline?: boolean;
  obrigarAtualizarSincronizacao?: boolean;
  hasMTR?: boolean;
  checkOutAutomatico?: boolean;
  alertaCheckoutOS?: boolean;
  controleEtapaImobilizados?: boolean;
  qrCode?: QRCode;
  alteraDescricaoResiduo?: boolean;
  permitirOsSemResiduos?: boolean;
  checkinObrigatorio?: boolean;
  somenteEquipamentosGenericos?: boolean;
  padraoOffline?: boolean;
  naoMostrarOpcaoGaleriaAoAnexarFoto?: boolean;
  bloqueiaEdicaoTempoColeta?: boolean;
  exibeMensagemInsercaoPeso?: boolean;
  exibeMensagemQuantidadeResiduosAdicionadosOs: boolean;
  mostraImobilizadoTelaResiduosAPP: boolean;
  obrigatorioKmOs: boolean;

}

enum QRCode {
  CLIENTE = 0,
  PONTO = 1,
}
