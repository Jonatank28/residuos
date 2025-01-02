import { IPhoto, ISQLRows } from 'vision-common';

export interface IDeviceImagemRepositorio {
  criarTabelaImagens: () => Promise<void>;

  inserirImagem: (foto: IPhoto, codigoVinculo: string | number) => Promise<number>;

  deletarImagem: (codigoVinculo: string | number) => Promise<number>;

  pegarImagens: (codigoVinculo: string | number) => Promise<ISQLRows<IPhoto>>;

  pegarImagemBase64: (id: number) => Promise<string>;

  imagemPendente: (nome:string, base64?:string) => Promise<{nome:string, base64:string} | number>;

  removerImagemPendente: (nome:string) => Promise<number>;

  pegarImagensPendentes: () => Promise<{nome:string}[]>;
}
