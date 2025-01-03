import React from 'react';
import { IScreenAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import Controller, { ParadaTypes } from './Controller';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Cabecalho from '../../../componentes/cabecalho';
import { FlatList, View } from 'react-native';
import FeaterIcon from 'react-native-vector-icons/Feather'



// Componente do Cartão
const CartaoParada = ({ data }: { data: ParadaTypes }) => {
  return (
    <Styles.CartaoParadaContainer>
      <Styles.Descricao>Motivo: {data.motivo}</Styles.Descricao>
      <Styles.Info>obervacao: {data.observacao || 'Nao informado'}</Styles.Info>
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



  return (
    <>
      <Cabecalho titulo={I18n.t('screens.listStops.title')} temIconeDireita={false} />
      <Styles.Container>
        {/* Listagem das paradas */}
        <FlatList
          data={controller.dataList}
          renderItem={({ item }) => <CartaoParada data={item} />}
          keyExtractor={(item, index) => item.id.toString() + index.toString()}
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