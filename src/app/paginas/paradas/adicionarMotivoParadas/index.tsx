import React, { useEffect } from 'react';
import { IScreenAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import Controller from './Controller';
import * as Styles from './styles';
import Cabecalho from '../../../componentes/cabecalho';
import { FlatList, Pressable, Text, View } from 'react-native';

export interface MotivoParadaTypes {
  id: number;
  nome: string;
}

const Cartao = ({ data, navigateTo }: { data: MotivoParadaTypes, navigateTo: (data: MotivoParadaTypes) => void }) => {
  return (
    <Pressable
      onPress={() => navigateTo(data)}
      style={{ padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginBottom: 10, borderRadius: 5, borderColor: '#ddd', borderWidth: 1 }}
    >
      <Text>{data.nome}</Text>
    </Pressable>
  );
};

const TelaAdicionarMotivoParadas: IScreenAuth<AuthRoutes.AdicionarMotivoParadas> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });
  const [data, setData] = React.useState<MotivoParadaTypes[]>([{
    id: 1,
    nome: 'Parada 1',
  },
  {
    id: 2,
    nome: 'Parada 2',
  }]
  );

  useEffect(() => {

  }, []);

  return (
    <>
      <Cabecalho titulo="Adicionar motivo" temIconeDireita={false} />
      <Styles.Container>
        {/* Listagem dos motivos*/}
        <FlatList
          data={data}
          renderItem={({ item }) => <Cartao data={item} navigateTo={controller.navigateTo} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      </Styles.Container>
    </>
  );
};

export default TelaAdicionarMotivoParadas;