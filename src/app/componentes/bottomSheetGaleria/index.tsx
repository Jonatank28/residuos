import * as React from 'react';
import * as Styles from './styles';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

const BottomSheetGaleria: React.FC<Props> = ({ bottomSheetRef, goToCamera, goToGaleraFotos }) => {
  const snapPoints = React.useMemo(() => ['40%', '45%'], []);

  const onPressFecharBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      enableDismissOnClose={true}
      snapPoints={snapPoints}
      style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
      <BottomSheetScrollView>
        <Styles.TituloSheetContainer activeOpacity={0.5} onPress={onPressFecharBottomSheet}>
          <Styles.Titulo>Selecione a opção desejada</Styles.Titulo>
          <FeatherIcon name="x" size={26} />
        </Styles.TituloSheetContainer>

        <Styles.BottomSheetItem
          activeOpacity={0.5}
          onPress={() => {
            onPressFecharBottomSheet();
            goToCamera();
          }}>
          <Styles.BottomSheetItemTexto>Abrir Camera</Styles.BottomSheetItemTexto>
        </Styles.BottomSheetItem>
        <Styles.BottomSheetItem
          activeOpacity={0.5}
          onPress={() => {
            onPressFecharBottomSheet();
            goToGaleraFotos();
          }}>
          <Styles.BottomSheetItemTexto>Abrir Galeria</Styles.BottomSheetItemTexto>
        </Styles.BottomSheetItem>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

type Props = {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  goToCamera: () => void;
  goToGaleraFotos: () => void;
};

export default BottomSheetGaleria;
