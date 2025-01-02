import * as Yup from 'yup';
import * as React from 'react';
import { usePresenter, useVSSnack } from 'vision-common';
import I18n from 'i18n-js';
import { Dimensions } from 'react-native';
import { useAuth } from '../../contextos/authContexto';
import Presenter from './presenter';
import { useLoading } from '../../contextos/loadingContexto';
import { useUser } from '../../contextos/usuarioContexto';
import { AppRoutes, CommonRoutes } from '../../routes/routes';
import { IControllerApp } from '../../routes/types';

interface Props extends IControllerApp<AppRoutes.Home> { }

export default function Controller({ navigation }: Props) {
  const formRef = React.useRef(null);
  const presenter = usePresenter(() => new Presenter());
  const { setToken } = useAuth();
  const { height } = Dimensions.get('screen');
  const { dispatchLoading } = useLoading();
  const { dispatchSnack } = useVSSnack();
  const { pegarUsuario } = useUser();

  const navigateToConfiguracaoInicial = () => navigation.navigate(CommonRoutes.ConfiguracaoInicial);

  const login = async (usuario: string, password: string) => {
    dispatchLoading({ type: 'open' });
    const response = await presenter.logarUsuario(usuario, password);

    if (response instanceof Error) {
      dispatchSnack({
        type: 'open',
        alertType: 'error',
        message: response.message,
      });
    } else {
      setToken(response);
      await pegarUsuario();
    }

    dispatchLoading({ type: 'close' });
  };

  const validacaoLogin = async (data: any) => {
    try {
      const schema = Yup.object().shape({
        usuario: Yup.string().required(I18n.t('yup.required.user')),
        password: Yup.string().required(I18n.t('yup.required.password')),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const usuario = data.usuario.replace(' ', '');
      const { password } = data;

      await login(usuario, password);
      // @ts-ignore
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

        // @ts-ignore
        formRef.current.setErrors(mensagensErros);
      }
    }
  };

  return {
    formRef,
    height,
    validacaoLogin,
    navigateToConfiguracaoInicial
  };
}
