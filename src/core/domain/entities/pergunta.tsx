export interface IPergunta {
  codigo?: number;
  criterio?: string;
  descricao?: string;
  codigoSequencia?: number;
  resposta?: number;
  codigoResposta?: number;
  bloqueia?: boolean;
  numeroDiasPrazo?: number;
  respostaPadrao?: boolean;
  classificacoes?: string;
  habilitaObservacao?: boolean;
  observacao?: string;
  codigoDepartamentoResponsavel?: number;
}
