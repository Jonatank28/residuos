import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OfflineContextData {
  offline: boolean,
  toogleOffline: (type: boolean) => Promise<void>
}

type Props = { children?: React.ReactNode }

const OfflineContext = React.createContext<OfflineContextData>({} as OfflineContextData);

export const OfflineProvider: React.FC = ({ children }: Props) => {
  const [offline, setOffline] = React.useState<boolean>(false);

  const getOfflineStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('padraoOffline');
      setOffline(value ? JSON.parse(value) : false);
    } catch (error) {
      console.error('Erro ao recuperar o estado offline:', error);
      setOffline(false);
    }
  };


  const toogleOffline = async (type: boolean) => {
    try {
      await AsyncStorage.setItem('padraoOffline', JSON.stringify(type));

      setOffline(type);
    } catch (error) {
      console.error('Erro ao salvar o estado offline:', error);
    }
  };

  React.useEffect(() => {
    getOfflineStorage();
  }, []);

  return (
    <OfflineContext.Provider
      value={{ offline, toogleOffline }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => React.useContext(OfflineContext);
