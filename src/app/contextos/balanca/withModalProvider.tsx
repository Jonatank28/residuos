import React, { FC } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export const withModalProvider = (Component: FC<any>) => ({ navigation, route }: any) =>
(
  <BottomSheetModalProvider>
    <Component />
  </BottomSheetModalProvider>
);