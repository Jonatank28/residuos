import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Cabecalho from '../../componentes/cabecalho';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { Avatar, capitalize } from 'vision-common';
import { IScreenAuth } from '../../routes/types';
import { AuthRoutes } from '../../routes/routes';
import CartaoDados from '../../componentes/cartaoDados';
import BottomSheetGaleria from '../../componentes/bottomSheetGaleria';

const TelaMeusDados: IScreenAuth<AuthRoutes.MeusDados> = ({ navigation, route }) => {
  const { icon } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
      temIconeDireita
      nomeIconeDireita="database"
      corIconeDireita={controller.queueState === `true` ? '#0f0' : '#f00'}
      onPressIconeDireita={controller.toggleQueue}
      titulo={I18n.t('screens.myData.title')} />
      <Styles.Container>
        <Styles.UsuarioContainer>
          <Styles.AvatarContainer onPress={controller.onPressTrocarImagem} activeOpacity={0.5}>
            <Avatar source={controller?.usuario?.fotoBase64} height={80} width={80} />
            <Styles.AvatarCamera name={route.params.photo?.base64 ? 'camera-off' : 'camera'} size={20} color={icon.color} />
          </Styles.AvatarContainer>
          <CartaoDados titulo={I18n.t('screens.myData.name')} descricao={capitalize(controller.usuario?.nome ?? '-')} />
          <CartaoDados titulo={I18n.t('screens.myData.login')} descricao={capitalize(controller.usuario?.login ?? '-')} />
          <CartaoDados titulo={I18n.t('screens.myData.cpf')} descricao={controller.usuario?.cpf ?? '-'} />
          <CartaoDados
            titulo={I18n.t('screens.myData.phone')}
            descricao={
              controller.usuario?.telefone && controller.usuario.telefone?.length > 0
                ? controller.usuario.telefone
                : I18n.t('screens.myData.notInformed')
            }
          />
        </Styles.UsuarioContainer>

        <BottomSheetGaleria
          bottomSheetRef={controller.bottomSheetRef}
          goToCamera={controller.goToCamera}
          goToGaleraFotos={controller.goToGaleraFotos}
        />
      </Styles.Container>
    </>
  );
};

export default TelaMeusDados;
