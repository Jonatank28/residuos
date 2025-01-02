import { capitalize } from 'vision-common';
import { IChecklist } from '../../core/domain/entities/checklist';
import { IEndereco } from '../../core/domain/entities/endereco';

export const verificaDiaChecklist = (checklist?: IChecklist) => {
  const dayOfWeek = new Date().getDay();

  if (checklist) {
    if (checklist.permiteSegundaFeira && dayOfWeek === 1) return true;
    if (checklist.permiteTercaFeira && dayOfWeek === 2) return true;
    if (checklist.permiteQuartaFeira && dayOfWeek === 3) return true;
    if (checklist.permiteQuintaFeira && dayOfWeek === 4) return true;
    if (checklist.permiteSextaFeira && dayOfWeek === 5) return true;
    if (checklist.permiteSabado && dayOfWeek === 6) return true;
    if (checklist.permiteDomingo && dayOfWeek === 0) return true;
  }

  return false;
};

export const primeiroNome = (name: string) => {
  if (typeof name !== 'string') return '';

  const nome = name.toLocaleLowerCase().split(' ').shift();

  if (!nome) return '';

  return nome.substring(0, 1).toUpperCase().concat(nome.substring(1));
};

export const enderecoFormatado = (endereco?: IEndereco): string => {
  if (endereco) {
    return `${capitalize(endereco?.rua ?? '')}, ${endereco?.numero ?? 'SN'} ${endereco?.letra ? ` - ${capitalize(endereco?.letra)}` : ''}\n${capitalize(endereco?.bairro ?? '')}\n${capitalize(endereco?.complemento ?? '')}`;
  }

  return '';
};
