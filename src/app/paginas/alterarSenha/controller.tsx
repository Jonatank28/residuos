import * as React from 'react';
import * as Yup from 'yup';
import { usePresenter, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import { useLoading } from '../../contextos/loadingContexto';
import Presenter from './presenter';
import { AuthRoutes } from '../../routes/routes';
import { IControllerAuth } from '../../routes/types';

interface Props extends IControllerAuth<AuthRoutes.AlterarSenha> { }

export default function Controller({ navigation }: Props) {
  const formRef = React.useRef<any>();
  const presenter = usePresenter(() => new Presenter());
  const { dispatchSnack } = useVSSnack();
  const { dispatchLoading } = useLoading();

  const alterarSenha = async (data: any) => {
    dispatchLoading({ type: 'open' });

    try {
      const schema = Yup.object().shape({
        senhaAtual: Yup.string().required(I18n.t('yup.required.currentpassword')),
        novaSenha: Yup.string().min(4, I18n.t('yup.required.minimumPassword')).required(I18n.t('yup.newPassword')),
        confirmarNovaSenha: Yup.string().required(I18n.t('yup.required.repeatPassword'))
          .oneOf([Yup.ref('novaSenha'), ''], I18n.t('yup.required.passwordEquals')),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const response = await presenter.alterarSenha(data.senhaAtual, data.novaSenha);

      if (response instanceof Error) {
        dispatchSnack({
          type: 'open',
          alertType: 'error',
          message: response.message,
        });
      } else {
        navigation.goBack();

        dispatchSnack({
          type: 'open',
          alertType: 'success',
          message: I18n.t('screens.changePassword.chageSuccess'),
        });
      }

      formRef.current.setErrors({});
    } catch (e) {
      if (e instanceof Yup.ValidationError) {
        const mensagensErros: any = {};

        e.inner.forEach((erro) => {
          mensagensErros[erro.path] = erro.message;
          dispatchSnack({
            type: 'open',
            alertType: 'error',
            message: erro.message,
          });
        });

        formRef.current.setErrors(mensagensErros);
      }
    }

    dispatchLoading({ type: 'close' });
  };

  return {
    formRef,
    alterarSenha,
  };
}
