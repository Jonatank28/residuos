import { IGrupo } from './grupo';

export interface IChecklist {
  codigo?: number,
  momentoExibicao?: string;
  permiteSegundaFeira?: boolean;
  permiteTercaFeira?: boolean;
  permiteQuartaFeira?: boolean;
  permiteQuintaFeira?: boolean;
  permiteSextaFeira?: boolean;
  permiteSabado?: boolean;
  permiteDomingo?: boolean;
  grupos: IGrupo[];
}
