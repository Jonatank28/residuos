export interface IDadosDispositivo {
  totalClientes?: number;
  totalRascunhos?: number;
  totalColetasHoje?: number;
  totalColetasPendentesHoje?: number;
  totalColetasRealizadasHoje?: number;
  totalColetasPendentes?: number;
  ultimaSincronizacao?: Date;
}