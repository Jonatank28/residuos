import * as React from 'react';
import TcpSocket from 'react-native-tcp-socket';
import { useVSSnack } from 'vision-common';
import { EnumBalancas, EnumTipoConexaoBalanca, IBalanca, IRetornoBalanca } from '../../../core/domain/entities/balanca/balanca';
import { tratarWW3000iR } from './tratamentos';

interface BalancaContextData {
  conectando: boolean;
  handlePeso: (dados: string, tipoBalanca?: EnumBalancas) => IRetornoBalanca;
  connect: (balanca: IBalanca) => TcpSocket.Socket | undefined;
}

type Props = { children?: React.ReactNode };

const BalancaContext = React.createContext<BalancaContextData>({} as BalancaContextData);

export const BalancaProvider: React.FC = ({ children }: Props) => {
  const { dispatchSnack } = useVSSnack();
  const [conectando, setConectando] = React.useState<boolean>(false);

  const connect = (balanca: IBalanca) => {
    if (balanca.tipoConexao === EnumTipoConexaoBalanca.BLUETOOTH) {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: 'Esse tipo de conexão não possui integrações, utilize TCP Client',
      });
    }

    if (!balanca.tcpIP) return;
    if (!balanca.tcpPorta) return;

    setConectando(true);

    const client = TcpSocket.createConnection(
      {
        port: balanca.tcpPorta,
        host: balanca.tcpIP,
      },
      () => console.log('TCP Client inicializado.'),
    );

    client.setTimeout(10 * 1000); // 10s
    client.setEncoding('utf-8');

    client.on('close', () => {
      setConectando(false);
      console.info(`Successfully disconnected`);
    });

    client.on('timeout', () => {
      client.destroy();
    });

    client.on('error', err => {
      if (!client.destroyed) client.destroy();

      setConectando(false);
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: 'Não foi possivel conectar à balança.',
      });
    });

    return client;
  };

  const handlePeso = (dados: string, tipoBalanca?: EnumBalancas): IRetornoBalanca => {
    switch (tipoBalanca) {
      case EnumBalancas.WT3000iR:
        return tratarWW3000iR(dados);
      default:
        return {};
    }
  };

  return <BalancaContext.Provider value={{ conectando, connect, handlePeso }}>{children}</BalancaContext.Provider>;
};

export const useBalanca = () => React.useContext(BalancaContext);
