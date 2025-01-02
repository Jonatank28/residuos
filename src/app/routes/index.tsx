import * as React from 'react';
import AuthRotas from './authNavegacao';
import { useAuth } from '../contextos/authContexto';
import AppRotas from './appNavegacao';
import TelaCarregamento from '../paginas/telaCarregamento';
import { useDatabase } from '../contextos/databaseContexto';
import { useUser } from '../contextos/usuarioContexto';
import { auditar } from '../../core/auditoriaHelper';

const Rotas = () => {
  const { logado } = useAuth();
  const { loading } = useDatabase();
  const { usuario } = useUser();

  const [mostrou, setMostrou] = React.useState(false);

  React.useEffect(() => {
    auditar(`loading:${loading},logado:${logado},usuario:${usuario?.codigo}`, 'useEffect rotas', 'INFO');

    if (!loading) {
      setMostrou(true);
    }
  }, [loading, logado, usuario]);

  if ((!mostrou && loading)) {
    return <TelaCarregamento />;
  }
  return usuario?.codigo ? <AuthRotas /> : <AppRotas />;
};

export default Rotas;
