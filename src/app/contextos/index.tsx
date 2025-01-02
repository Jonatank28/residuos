import * as React from 'react';
import {
  VSSnackProvider, VSConnectionProvider, VSUpdatesProvider, VSAlertProvider,
} from 'vision-common';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './authContexto';
import { ColetaProvider } from './coletaContexto';
import { DatabaseProvider } from './databaseContexto';
import { LoadingProvider } from './loadingContexto';
import { OfflineProvider } from './offilineContexto';
import { RascunhoProvider } from './rascunhoContexto';
import { StorageProvider } from './storageContexto';
import { ThemeProvider } from './themeContexto';
import { UserProvider } from './usuarioContexto';
import { LocalizacaoProvider } from './localizacaoContexto';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BalancaProvider } from './balanca/balancaContexto';
import { CheckinProvider } from './checkinContexto';
import { SincronizacaoProvider } from './sincronizacaoContexto';

function ProviderComposer({ contexts, children }: any) {
  return contexts.reduceRight(
    (kids: any, parent: React.DetailedReactHTMLElement<{ children: any; }, HTMLElement>) => React.cloneElement(parent, {
      children: kids,
    }),
    children,
  );
}

type Props = { children?: React.ReactNode }

function ContextProvider({ children }: Props) {
  return (
    <PaperProvider>
      <ProviderComposer contexts={[
        <ThemeProvider />,
        <VSSnackProvider />,
        <VSConnectionProvider />,
        <LoadingProvider />,
        <CheckinProvider />,
        <AuthProvider />,
        <VSAlertProvider />,
        <UserProvider />,
        <StorageProvider />,
        <DatabaseProvider />,
        <LocalizacaoProvider />,
        <OfflineProvider />,
        <RascunhoProvider />,
        <ColetaProvider />,
        <BalancaProvider />,
        <BottomSheetModalProvider />,
        <VSUpdatesProvider />,
      ]}
      >
        <SincronizacaoProvider >
          {children}
        </SincronizacaoProvider>
      </ProviderComposer>
    </PaperProvider>
  );
}

export default ContextProvider;
