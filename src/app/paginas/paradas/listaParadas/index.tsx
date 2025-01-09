import React from 'react';
import { IScreenAuth } from '../../../routes/types';
import { AuthRoutes } from '../../../routes/routes';
import Controller, { ParadaTypes } from './Controller';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Cabecalho from '../../../componentes/cabecalho';
import { FlatList, View } from 'react-native';
import FeaterIcon from 'react-native-vector-icons/Feather'

const formatarDataISO = (data: string) => {
  const [dia, mes, ano] = data.split('/');
  return `${ano}-${mes}-${dia}`; // Retorna no formato ISO
};

// Função para calcular o tempo total
const calcularTempoTotal = (dataInicio: string, horaInicio: string, dataFim: string, horaFim: string) => {
  // Formata as datas para o padrão ISO
  const dataInicioISO = formatarDataISO(dataInicio);
  const dataFimISO = formatarDataISO(dataFim);

  // Combina as datas e horas para criar objetos Date
  const inicio = new Date(`${dataInicioISO}T${horaInicio}`);
  const fim = new Date(`${dataFimISO}T${horaFim}`);

  // Verifica se as datas são válidas
  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return 'Data inválida';
  }

  // Calcula a diferença em milissegundos
  let diferencaMs = fim.getTime() - inicio.getTime();

  // Converte para segundos, minutos e horas
  const segundos = Math.floor((diferencaMs / 1000) % 60);
  const minutos = Math.floor((diferencaMs / (1000 * 60)) % 60);
  const horas = Math.floor((diferencaMs / (1000 * 60 * 60)) % 24);
  const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

  // Formata o resultado
  return `${dias > 0 ? `${dias}d ` : ''}${horas}h ${minutos}m ${segundos}s`;
};

// Componente do Cartão
const CartaoParada = ({ data, handleEdit, handleDelete }: { data: ParadaTypes, handleEdit: (item: ParadaTypes) => void, handleDelete: (id: number) => void }) => {

  const tempoTotal = calcularTempoTotal(data.dataInicio, data.horaInicio, data.dataFim, data.horaFim);

  return (
    <Styles.CartaoParadaContainer>
      <Styles.Descricao>Motivo: {data.motivo}</Styles.Descricao>
      <Styles.Info>obervacao: {data.observacao || 'Nao informado'}</Styles.Info>
      <Styles.Info>Início: {data.dataInicio} às {data.horaInicio}</Styles.Info>
      <Styles.Info>Fim: {data.dataFim} às {data.horaFim}</Styles.Info>
      <Styles.Info>Tempo total: {tempoTotal}</Styles.Info>

      <Styles.ButtonContainer>
        <Styles.EditButton onPress={() => handleEdit(data)}>
          <Styles.FeatherIcone name="edit" size={16} color="#fff" />
          <Styles.ButtonText>Editar</Styles.ButtonText>
        </Styles.EditButton>

        <Styles.DeleteButton onPress={() => handleDelete(data.id)}>
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
          renderItem={({ item }) => <CartaoParada data={item} handleEdit={controller.handleEdit} handleDelete={controller.handleDelete} />}
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