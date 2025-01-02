import * as React from 'react';
import * as Styles from './styles';
import I18n from 'i18n-js';
import Controller from './controller';
import { useTheme } from 'styled-components/native';
import { Pergunta, SemConteudo } from 'vision-common';
import { IGrupo } from '../../../core/domain/entities/grupo';
import { IPergunta } from '../../../core/domain/entities/pergunta';
import Botao from '../../componentes/botao';
import Cabecalho from '../../componentes/cabecalho';
import { AuthRoutes } from '../../routes/routes';
import { IScreenAuth } from '../../routes/types';

const TelaChecklist: IScreenAuth<AuthRoutes.Checklist> = ({ navigation, route }) => {
  const { colors, secundary, text } = useTheme();
  const controller = Controller({ navigation, params: route.params });

  return (
    <>
      <Cabecalho
        titulo={I18n.t('screens.checklist.title')}
        onPressIconeEsquerda={controller.goBackFunction}
        temIconeDireita={false}
      />
      <Styles.Container>
        <Styles.ScrollContainer keyboardShouldPersistTaps="always">
          {controller?.grupos?.length > 0 ? (
            controller.grupos.map((grupo: IGrupo, index: number) => (
              <Styles.GrupoContainer key={index}>
                <Styles.Titulo>{grupo?.descricao ?? ''}</Styles.Titulo>
                {grupo?.perguntas && grupo.perguntas?.length > 0
                  ? (grupo.perguntas.map((pergunta: IPergunta, _index: number) => (
                    <Styles.PerguntasContainer key={_index}>
                      <Pergunta
                        marginBottom={0}
                        required={controller.verificaClassificacao(pergunta)}
                        pergunta={pergunta?.descricao ?? ''}
                        onPressResposta={(resposta: any) => {
                          pergunta.resposta = resposta;
                          controller.gravarRespostaGrupo(pergunta);
                        }}
                      />
                      {(Boolean(pergunta?.habilitaObservacao ?? false)) && (
                        <Styles.Input
                          multiline
                          autoCorrect
                          height={70}
                          maxLength={500}
                          textAlignVertical="top"
                          placeholderTextColor={text.input.placeholderColor}
                          placeholder={I18n.t('screens.checklist.observation')}
                          onChangeText={(text: string) => {
                            pergunta.observacao = text;
                            controller.gravarRespostaGrupo(pergunta);
                          }}
                        />
                      )}
                    </Styles.PerguntasContainer>
                  ))) : (
                    <Styles.SemConteudoContainer>
                      <Styles.Descricao>{I18n.t('screens.checklist.questionsNotFound')}</Styles.Descricao>
                    </Styles.SemConteudoContainer>
                  )}
              </Styles.GrupoContainer>
            ))
          ) : (
            <Styles.SemConteudoContainer>
              <SemConteudo
                texto={I18n.t('quiz.questions.notFound')}
                nomeIcone="check"
              />
            </Styles.SemConteudoContainer>
          )}
          <Botao
            texto={I18n.t('screens.checklist.button')}
            corTexto={secundary}
            backgroundColor={colors.orange}
            onPress={controller.navigateTo}
          />
        </Styles.ScrollContainer>
      </Styles.Container>
    </>
  );
}

export default TelaChecklist;
