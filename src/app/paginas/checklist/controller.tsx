import * as React from 'react';
import { useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import { IGrupo } from '../../../core/domain/entities/grupo';
import { IPergunta } from '../../../core/domain/entities/pergunta';
import { optionsChecklist } from '../../utils/enums';
import { useRascunho } from '../../contextos/rascunhoContexto';
import { AuthRoutes } from '../../routes/routes';
import { useUser } from '../../contextos/usuarioContexto';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.Checklist> { }

export default function Controller({ navigation, params }: Props) {
  const { dispatchSnack } = useVSSnack();
  const { configuracoes } = useUser();
  const { rascunho, atualizarGravarRascunho } = useRascunho();
  const [grupos, setGrupos] = React.useState<IGrupo[]>([]);
  const [perguntasRespondidas, setPerguntasRespondidas] = React.useState<IPergunta[]>([]);

  const perguntasObrigatorias: IPergunta[] = [];

  const verificaClassificacao = (pergunta: IPergunta) => {
    let founded = false;
    let classificacoes: string[] = [];

    if (params.coleta?.residuos && params.coleta.residuos?.length > 0 && pergunta) {
      if (pergunta?.classificacoes && pergunta?.classificacoes.includes(';')) {
        classificacoes = pergunta.classificacoes.split(';');
      } else {
        classificacoes.push(pergunta?.classificacoes ?? '');
      }

      params.coleta.residuos.filter((residuo) => {
        classificacoes.filter((classificacao) => {
          if (Number(classificacao) === residuo.classificacao) {
            founded = true;
            perguntasObrigatorias.push(pergunta);
          }
        });
      });

      return founded;
    }

    return false;
  };

  const setObjectColeta = () => (rascunho ? {
    ...rascunho,
    perguntasRespondidas,
  } : {
    ...params.coleta,
    perguntasRespondidas,
  });

  const navigateTo = async () => {
    let isOK = [];

    perguntasRespondidas.filter((respondida) => {
      if (perguntasObrigatorias.length > 0) {
        perguntasObrigatorias.filter((obrigatoria) => {
          if (respondida.codigo === obrigatoria.codigo) {
            if (respondida.resposta === 0 || respondida.resposta === 1 || respondida.resposta === 2) {
              isOK.push(respondida);
            } else isOK = [];
          }
        });
      }
    });

    if (isOK.length === perguntasObrigatorias.length) {
      const newColeta = setObjectColeta();

      await atualizarGravarRascunho(newColeta);

      if (params.coleta?.checklist !== null && params.coleta?.checklist?.momentoExibicao === optionsChecklist.INICIAR) {
        navigation.navigate(AuthRoutes.ResiduosDaColeta, { coleta: newColeta, novaColeta: !!!(params.coleta?.codigoOS && params.coleta?.codigoOS !== 0), residuo: {  } });
      } else if (configuracoes?.permiteMovimentarContainerAPP) {
        navigation.navigate(AuthRoutes.EquipamentosDaColeta, { coleta: newColeta, equipamento: {}, novaColeta: false, scanData: '' });
      } else {
        navigation.navigate(AuthRoutes.ColetaResponsavel, { coleta: newColeta, assinatura: '', mtr: {}, novaColeta: false, photo: {}, scanData: '' });
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.checklist.questionsRequired'),
      });
    }
  };

  const goBackFunction = async () => {
    if (rascunho && (rascunho.codigoCliente || rascunho.codigoOS)) {
      const newColeta = setObjectColeta();

      await atualizarGravarRascunho(newColeta);
    }

    navigation.goBack();
  };

  const gravarRespostaGrupo = async (pergunta: IPergunta) => {
    if (pergunta && pergunta.codigo) {
      const exist = perguntasRespondidas.filter((item: IPergunta) => item.codigo === pergunta.codigo);

      if (exist && exist.length > 0) {
        const newRespostas = perguntasRespondidas.map((item) => (item.codigo !== pergunta.codigo ? item : pergunta));
        setPerguntasRespondidas(newRespostas);
      } else {
        setPerguntasRespondidas([...perguntasRespondidas, pergunta]);
      }
    } else {
      dispatchSnack({
        type: 'open',
        alertType: 'info',
        message: I18n.t('screens.checklist.invalidQuestion'),
      });
    }
  };

  React.useEffect(() => {
    if (params.coleta?.checklist && params.coleta?.checklist?.grupos?.length > 0) {
      setGrupos(params.coleta.checklist.grupos);
    }
  }, [params.coleta]);

  return {
    grupos,
    goBackFunction,
    navigateTo,
    verificaClassificacao,
    gravarRespostaGrupo
  };
}
