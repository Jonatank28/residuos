import { useNavigation } from '@react-navigation/native';

const Controller = () => {
  const navigation = useNavigation();

  const goBack = () => navigation.goBack();

  const validateGoBack = () => {
    const canGoBack = navigation.canGoBack();

    if (canGoBack) goBack();
  };

  return {
    validateGoBack,
  };
};

export default Controller;
