import * as React from 'react';

const estadoInicial = {
  type: 'close',
  open: false,
};

type Props = { children?: React.ReactNode }

interface LoadingContextData {
  loadingState: any,
  dispatchLoading: React.Dispatch<any>
}

export const LoadingContexto = React.createContext<LoadingContextData>({} as LoadingContextData);

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'close':
      return {
        ...estadoInicial,
      };
    case 'open':
      return {
        open: true,
      };
    default:
      return {
        ...estadoInicial,
      };
  }
};

export const LoadingProvider: React.FC = ({ children }: Props) => {
  const [loadingState, dispatchLoading] = React.useReducer(reducer, estadoInicial);

  return (
    <LoadingContexto.Provider
      value={{ loadingState, dispatchLoading }}
    >
      {children}
    </LoadingContexto.Provider>
  );
};

export const useLoading = () => React.useContext(LoadingContexto);
