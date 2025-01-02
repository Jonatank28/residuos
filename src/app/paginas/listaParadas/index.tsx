import React from 'react';
import { IScreenAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';
import Controller from './Controller';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Cabecalho from '../../componentes/cabecalho';
import { FlatList, View } from 'react-native';
import FeaterIcon from 'react-native-vector-icons/Feather'

interface ParadaTypes {
  id: number;
  observacao: string;
  motivo: string;
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
}

// Componente do Cartão
const CartaoParada = ({ data }: { data: ParadaTypes }) => {
  return (
    <Styles.CartaoParadaContainer>
      <Styles.Descricao>{data.observacao}</Styles.Descricao>
      <Styles.Info>Motivo: {data.motivo}</Styles.Info>
      <Styles.Info>Início: {data.dataInicio} às {data.horaInicio}</Styles.Info>
      <Styles.Info>Fim: {data.dataFim} às {data.horaFim}</Styles.Info>

      <Styles.ButtonContainer>
        <Styles.EditButton>
          <Styles.FeatherIcone name="edit" size={16} color="#fff" />
          <Styles.ButtonText>Editar</Styles.ButtonText>
        </Styles.EditButton>

        <Styles.DeleteButton>
          <Styles.FeatherIcone name="trash" size={16} color="#fff" />
          <Styles.ButtonText>Excluir</Styles.ButtonText>
        </Styles.DeleteButton>
      </Styles.ButtonContainer>
    </Styles.CartaoParadaContainer>
  );
};


const TelaListaParadas: IScreenAuth<AuthRoutes.ListaParadas> = ({ navigation, route }) => {
  const controller = Controller({ navigation, params: route.params });
  const [data, setData] = React.useState<ParadaTypes[]>([{
    id: 1,
    observacao: 'Parada 1',
    motivo: "almoço",
    dataInicio: "02/01/2025",
    horaInicio: "13:00",
    dataFim: "02/01/2025",
    horaFim: "14:00"
  },
  {
    id: 2,
    observacao: 'Parada 2',
    motivo: "troca de pneu",
    dataInicio: "02/01/2025",
    horaInicio: "15:00",
    dataFim: "02/01/2025",
    horaFim: "18:00"
  }]
  );


  return (
    <>
      <Cabecalho titulo={I18n.t('screens.listStops.title')} temIconeDireita={false} />
      <Styles.Container>
        {/* Listagem das paradas */}
        <FlatList
          data={data}
          renderItem={({ item }) => <CartaoParada data={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />

        {/* Botão de adicionar parada */}
        <View style={{
          position: 'absolute',
          bottom: 20,
          alignSelf: 'center',
        }}>
          <Styles.IconeContainer
            activeOpacity={0.5}
            onPress={controller.navigateToAddStops}
          >
            <FeaterIcon
              name='plus'
              size={30}
              style={{ color: "#ffffff" }}
            >
            </FeaterIcon>
          </Styles.IconeContainer>
        </View>
      </Styles.Container>
    </>
  );
};

export default TelaListaParadas;