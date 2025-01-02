import * as React from 'react';
import { useTheme } from 'styled-components/native';
import { capitalize } from 'vision-common';
import { IEndereco } from '../../../core/domain/entities/endereco';
import Cores from '../../styles/colors';

export default function Controller(endereco?: IEndereco, status?: number, isHistory?: boolean, isOffline?: boolean) {
  const { StatusCores } = Cores();
  const { colors } = useTheme();
  const [statusStyle, setStatusStyle] = React.useState({ color: colors.white });

  const callStatus = React.useCallback(() => {
    switch (status) {
      case 1:
        setStatusStyle({ color: isOffline ? StatusCores.entrega : StatusCores.coleta });
        break;
      case 2:
        setStatusStyle({ color: isHistory ? isOffline ? StatusCores.entrega : StatusCores.coleta : StatusCores.entrega });
        break;
      case 3:
        setStatusStyle({ color: StatusCores.entrega });
        break;
      case 4:
        setStatusStyle({ color: colors.accent });
        break;
      case 5:
        setStatusStyle({ color: colors.accent });
        break;
      default:
        setStatusStyle({ color: colors.white });
        break;
    }
  }, []);

  React.useEffect(() => {
    if (status) {
      callStatus();
    }
  }, [status]);

  const enderecoFormatado = React.useMemo(() => {
    if (endereco) {
      return `${capitalize(endereco?.rua ?? '')}, ${endereco.numero ?? 'SN'}${endereco.letra ? ` - ${capitalize(endereco.letra)}` : ''}${endereco.bairro ? ` - ${capitalize(endereco.bairro)}` : ''}${endereco.complemento ? ` - ${capitalize(endereco.complemento)}` : ''}`;
    }

    return '';
  }, [endereco]);

  return {
    statusStyle,
    enderecoFormatado
  };
}
