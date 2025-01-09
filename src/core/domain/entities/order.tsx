import { IPhoto } from 'vision-common';
import { IChecklist } from './checklist';
import { IEndereco } from './endereco';
import { IEquipamento } from './equipamento';
import { IMotivo } from './motivo';
import { IMotivoRecusaAssinatura } from './motivoRecusaAssinatura';
import { IMtr } from './mtr';
import { IPergunta } from './pergunta';
import { IResiduo } from './residuo';
import { Parada } from '../../../app/contextos/coletaContexto';

export interface IOrder {
  codigoOS?: number;
  codigoAntigo?: string
  codigoOrdem?: number;
  codigoUnico?: string;
  codigoVinculo?: string;
  codigoEmpresa?: number;
  codigoDispositivo?: number;
  codigoDestinador?: number;
  codigoMotorista?: number;
  placa?: string;
  assinaturaBase64?: string;
  mtr?: string;
  mtrs?: IMtr[];
  paradas?: Parada[];
  motivo?: IMotivo;
  motivoRecusaAssinatura?: IMotivoRecusaAssinatura;
  codigoBarraMTR?: string;
  ordemColetaPendente?: number;
  isOffline?: boolean;
  coletouPendente?: boolean;
  codigoRoterizacao?: number;
  codigoPonto?: number;
  codigoRota?: number;
  codigoCliente?: number;
  codigoObra?: number;
  codigoContratoObra?: number;
  KMInicial?: number;
  KMFinal?: number;
  nomeObra?: string;
  nomeCliente?: string;
  nomeFantasiaCliente?: string;
  telefoneCliente?: string;
  CNPJCliente?: string;
  CPFCNPJResponsavel?: string;
  nomeResponsavel?: string;
  funcaoResponsavel?: string;
  emailResponsavel?: string;
  dataOS?: Date;
  dataChegada?: Date;
  dataCadastro?: Date;
  dataAtualizacao?: Date;
  observacaoOS?: string;
  periodicidade?: string;
  referenteOS?: string;
  classificacaoOS?: number;
  imobilizados?: string;
  fotos?: IPhoto[];
  enderecoOS?: IEndereco;
  residuos?: IResiduo[];
  checklist?: IChecklist;
  perguntasRespondidas?: IPergunta[];
  equipamentos?: IEquipamento[];
  equipamentosRetirados?: IEquipamento[];
}

export const setOrder = (value: any): IOrder => {
  const order: IOrder = {
    periodicidade: value?.periodicidade,
    codigoOS: value.codigoOS,
    codigoOrdem: value.ordemID,
    codigoRoterizacao: value.codigoRoterizacao,
    codigoRota: value.codigoRota,
    codigoDestinador: value?.codigoDestinador,
    codigoEmpresa: value?.codigoEmpresa,
    codigoPonto: value.codigoPonto,
    codigoCliente: value.codigoCliente,
    placa: value.placa,
    mtr: value.mtr,
    nomeCliente: value.nomeCliente,
    nomeFantasiaCliente: value.nomeFantasiaCliente,
    ordemColetaPendente: value.ordemColetaPendente,
    coletouPendente: value.coletouPendente,
    telefoneCliente: value.telefoneCliente,
    CNPJCliente: value.cnpjCliente,
    CPFCNPJResponsavel: value.cpfcnpjResponsavel,
    nomeResponsavel: value.nomeResponsavel,
    funcaoResponsavel: value.funcaoResponsavel,
    emailResponsavel: value.emailResponsavel,
    codigoObra: value.codigoObra,
    codigoContratoObra: value.codigoContratoObra,
    nomeObra: value.nomeObra,
    dataOS: value.dataOS,
    observacaoOS: value.observacaoOS,
    referenteOS: value.referenteOS,
    classificacaoOS: value.classificacaoOS,
    enderecoOS: {
      bairro: value.bairroOS,
      cidade: value.cidadeOS,
      rua: value.ruaOS,
      letra: value.letraOS,
      numero: value.numeroOS,
      uf: value.estadoOS,
      complemento: value.complementoOS,
      latLng: {
        latitude: value.latitudeOS,
        longitude: value.longitudeOS,
      },
    },
    checklist: value.checklist,
    residuos: value?.residuos,
    equipamentos: value.equipamentos,
  };

  return order;
};
