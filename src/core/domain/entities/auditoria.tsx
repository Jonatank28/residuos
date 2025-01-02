export interface IAuditoria {
  codigoMotorista?: number;
  codigoRegistro?: number;
  tipo?: AUDITORIA_TIPOS;
  data?: Date;
  descricao?: string;
  rotina?: string;
}

type AUDITORIA_TIPOS =
  | 'SINCRONIZACAO'
  | 'BLOQUEIO_LIMITE_ARMAZENAMENTO'
  | 'AVISO_LIMITE_ARMAZENAMENTO'
  | 'COLETA_AGENDADA'
  | 'NOVA_COLETA'
  | 'RASCUNHO'
  | 'CONFIGURACOES'
  | 'LOG_FILA_COLETA'
  | 'ATUALIZACAO_CHECKOUT_OS';
