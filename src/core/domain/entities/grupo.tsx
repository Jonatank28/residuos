import { IPhoto } from 'vision-common';
import { IPergunta } from './pergunta';

export interface IGrupo {
  codigo?: number;
  descricao?: string;
  ordem?: number;
  perguntas?: IPergunta[];
  fotos?: IPhoto[];
  observacao?: string;
}
