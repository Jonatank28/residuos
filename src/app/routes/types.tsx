import * as React from 'react';
import { IScreenProps, IControllerProps } from 'vision-common';
import { AppNavigatorParamsList, AuthNavigatorParamsList } from './routes';

// APP
export type IScreenApp<RouteName extends string> = React.FC<IScreenProps<AppNavigatorParamsList, RouteName>>;

export type IControllerApp<RouteName extends string> = IControllerProps<AppNavigatorParamsList, RouteName>;

// AUTH
export type IScreenAuth<RouteName extends string> = React.FC<IScreenProps<AuthNavigatorParamsList, RouteName>>;

export type IControllerAuth<RouteName extends string> = IControllerProps<AuthNavigatorParamsList, RouteName>;
