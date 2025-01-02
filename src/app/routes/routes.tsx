import { IVeiculo, IRegiao, IPhoto } from "vision-common";
import { IGrupo, IPergunta } from "vision-questionario";
import { IBalanca } from "../../core/domain/entities/balanca/balanca";
import { ICliente } from "../../core/domain/entities/cliente";
import { IContainer } from "../../core/domain/entities/container";
import { IEquipamento } from "../../core/domain/entities/equipamento";
import { IEstado } from "../../core/domain/entities/estado";
import { IFiltro } from "../../core/domain/entities/filtro";
import { IMotivo } from "../../core/domain/entities/motivo";
import { IMtr } from "../../core/domain/entities/mtr";
import { IObra } from "../../core/domain/entities/obra";
import { IOrder } from "../../core/domain/entities/order";
import { IResiduo } from "../../core/domain/entities/residuo";
import { IImobilizado } from "../../core/domain/entities/imobilizado";

export type AppNavigatorParamsList = {
  [AppRoutes.Home]: undefined;
  [CommonRoutes.ConfiguracaoInicial]: undefined;
}

export type AuthNavigatorParamsList = {
  [AuthRoutes.Home]: undefined;
  [AuthRoutes.MeusDados]: { photo: IPhoto };
  [AuthRoutes.ListaEstadosMTR]: { mtrs: IMtr[], screen: string };
  [AuthRoutes.AdicionarMTR]: { hasSinir: boolean, estado: IEstado, screen: string, scanData: string };
  [AuthRoutes.QuestionarioRotas]: undefined;
  [AuthRoutes.AdicionarRegioes]: { veiculo?: IVeiculo, regiao?: IRegiao, isChange: boolean };
  [AuthRoutes.Regioes]: { regioes: IRegiao[], isChange: boolean };
  [AuthRoutes.Impressoras]: { ordem: IOrder };
  [AuthRoutes.ColetasAgendadas]: { codigoOSEnviada: number, filtros?: IFiltro, scanData?: string };
  [AuthRoutes.ColetaResponsavel]: {
    coleta: IOrder,
    photo: IPhoto,
    assinatura: string,
    scanData: string,
    novaColeta: boolean,
    mtr: IMtr
  };
  [AuthRoutes.DetalhesDaColeta]: { coletaID: number, motivo: IMotivo };
  [AuthRoutes.DetalhesDaColetaLocal]: { coleta: IOrder, codigoOS: number, codigoCliente: number | string };
  [AuthRoutes.DetalhesDoResiduoLocal]: { residuo: IResiduo };
  [AuthRoutes.DetalhesDoEquipamentoLocal]: { equipamento: IEquipamento };
  [AuthRoutes.ListaResiduosLocal]: { residuos: IResiduo[] };
  [AuthRoutes.ListaObras]: { clienteID: number, placa: string };
  [AuthRoutes.ListaEquipamentosLocal]: { equipamentos: IEquipamento[], equipamentosRetirados: IEquipamento[] };
  [AuthRoutes.ResumoDaColeta]: { coleta: IOrder, novaColeta: boolean };
  [AuthRoutes.Checklist]: { coleta: IOrder };
  [AuthRoutes.ResiduosDaColeta]: { coleta?: IOrder, residuo: IResiduo, novaColeta: boolean };
  [AuthRoutes.EquipamentosDaColeta]: {
    coleta: IOrder;
    equipamento: IEquipamento;
    scanData: string;
    novaColeta: boolean;
    equipamentoRemovidoParams?: IEquipamento;
  };
  [AuthRoutes.Residuo]: {
    residuo: IResiduo;
    photo: IPhoto;
    balanca: IBalanca;
    adicionado: boolean;
    duplicado: boolean;
    isEdit: boolean;
    codigoColeta?: string | number,
    codigoCliente?: string | number,
    novaColeta: boolean;
    residuos?: IResiduo[];
    imobilizado?: IImobilizado;
  };
  [AuthRoutes.ListaResiduos]: {
    screen: string;
    residuos: IResiduo[];
    contratoID: number;
    clienteID: number;
    codigoColeta?: string | number,
    novaColeta: boolean;
    imobilizadoPesagem?: IEquipamento;
  };
  [AuthRoutes.ListaBalancasTCP]: { screen: string; ehEdicao?: boolean };
  [AuthRoutes.ListaEquipamentos]: {
    screen: string,
    scanData: string,
    equipamentoSubstituir: IEquipamento,
    equipamentos: IEquipamento[],
    coleta: IOrder,
    codigoColeta?: string | number,
    codigoCliente?: string | number,
    novaColeta: boolean,
    residuo?: IResiduo
  };
  [AuthRoutes.Imobilizados]: { codigosOS: string };
  [AuthRoutes.FiltrarColetas]: {
    cliente: ICliente,
    obra: IObra,
    placa: string,
    filtros: IFiltro,
    screen: string,
    isHistico?: boolean
  };
  [AuthRoutes.Clientes]: { isSelect: boolean, screen: string };
  [AuthRoutes.Motivos]: { screen: string };
  [AuthRoutes.MotivosParada]: { screen: string };
  [AuthRoutes.AdicionarParadas]: { screen: string };
  [AuthRoutes.ListaParadas]: { screen: string };
  [AuthRoutes.ClienteContainers]: { containers: IContainer[] };
  [AuthRoutes.DetalhesDoCliente]: { clienteID: number };
  [AuthRoutes.Rascunhos]: { rascunhoDeletado: IOrder };
  [AuthRoutes.DetalhesDoRascunho]: { rascunho: IOrder };
  [AuthRoutes.HistoricoDeColetas]: { filtros: IFiltro | null, scanData: string };
  [AuthRoutes.NovaColeta]: { cliente: ICliente, obra: IObra, motivo: IMotivo };
  [AuthRoutes.ObrasNovaColeta]: { isSelect: boolean, screen: string, obraSelecionada?: IObra, clienteID: number };
  [AuthRoutes.Configuracoes]: undefined;
  [AuthRoutes.Relatorio]: undefined;
  [AuthRoutes.AlterarSenha]: undefined;
  [CommonRoutes.ConfiguracaoInicial]: undefined;
  [AuthRoutes.AlterarPlaca]: { screen: string, isSelect: boolean };
  [AuthRoutes.Backup]: undefined;
  [AuthRoutes.Camera]: { message: string, isFront: boolean, screen: string };
  [AuthRoutes.Scanner]: { message: string, scanType: 'qr' | 'code39' | '', screen: string };
  [AuthRoutes.Assinatura]: {
    screen: string,
    novaColeta: boolean,
    coleta: IOrder,
    motivo: IMotivo,
    grupos: IGrupo[],
    codigoQuestionario: number,
    perguntas: IPergunta[],
    placa: string,
  };
  [AuthRoutes.RecusaDeAssinatura]: { coleta: IOrder, novaColeta: boolean };
}

export enum AppRoutes {
  Home = '/',
}

export enum CommonRoutes {
  ConfiguracaoInicial = '/configuracao-inicial'
}

export enum AuthRoutes {
  Home = '/',
  MeusDados = '/meus-dados',
  ListaEstadosMTR = '/estadosMtr',
  ListaObras = '/listaObras',
  AdicionarMTR = '/addMtr',
  Impressoras = '/impressoras',
  QuestionarioRotas = 'QuestionarioRotas',
  AdicionarRegioes = '/adicionar-regioes',
  Regioes = '/regioes',
  ColetasAgendadas = '/coletas-agendadas',
  ColetaResponsavel = '/responsavel-coleta',
  DetalhesDaColeta = '/detalhes-coleta',
  ResumoDaColeta = '/resumo-coleta',
  Checklist = '/checklist',
  ResiduosDaColeta = '/residuos-coleta',
  EquipamentosDaColeta = '/equipamentos-coleta',
  Residuo = '/residuo',
  ListaResiduos = '/lista-residuos',
  ListaBalancasTCP = '/lista-balancas-tcp',
  ListaEquipamentos = '/lista-equipamentos',
  Imobilizados = '/imobilizados',
  FiltrarColetas = '/filtrar-coletas',
  Clientes = '/clientes',
  Motivos = '/motivos',
  MotivosParada = '/motivosParada',
  AdicionarParadas = '/adicionarParadas',
  ListaParadas = '/listaParadas',
  ClienteContainers = '/cliente-containers',
  DetalhesDoCliente = '/detalhes-cliente',
  HistoricoDeColetas = '/historico-coletas',
  NovaColeta = '/nova-coleta',
  ObrasNovaColeta = '/obras-nova-coleta',
  Configuracoes = '/configuracoes',
  Relatorio = '/relatorio',
  AlterarSenha = '/alterar-senha',
  AlterarPlaca = '/alterar-placa',
  Backup = '/backup',
  BackupAutomatico = 'backupAutomatico',
  Camera = '/camera',
  Scanner = '/scanner',
  Assinatura = '/assinatura',
  RecusaDeAssinatura = '/recusa-assinatura',
  DetalhesDaColetaLocal = '/detalhes-coleta-local',
  DetalhesDoResiduoLocal = '/detalhes-residuo-local',
  DetalhesDoEquipamentoLocal = '/detalhes-equipamento-local',
  ListaResiduosLocal = '/lista-residuos-local',
  ListaEquipamentosLocal = '/lista-equipamentos-local',
  Rascunhos = '/rascunhos',
  DetalhesDoRascunho = '/detalhes-rascunho',
}
