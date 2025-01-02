import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Telas
import TelaLogin from '../paginas/login';
import TelaConfiguracaoIncial from '../paginas/configuracaoInicial';
import { AppNavigatorParamsList, AppRoutes, CommonRoutes } from './routes';

const AppStack = createStackNavigator<AppNavigatorParamsList>();

const AppRotas = () => (
  <AppStack.Navigator
    initialRouteName={AppRoutes.Home}
    headerMode="none"
    mode="modal"
    screenOptions={{
      gestureEnabled: false,
      cardStyle: { backgroundColor: 'transparent' },
      cardStyleInterpolator: ({ current: { progress } }) => ({
        cardStyle: {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          })
        },
        overlayStyle: {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
            extrapolate: 'clamp'
          })
        }
      })
    }}
  >
    <AppStack.Screen name={AppRoutes.Home} component={TelaLogin} />
    <AppStack.Screen name={CommonRoutes.ConfiguracaoInicial} component={TelaConfiguracaoIncial} />
  </AppStack.Navigator>
);

export default AppRotas;
