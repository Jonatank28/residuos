import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';

const DropDownOptions: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState<string>('');
  const { border, card, text } = useTheme();

  React.useEffect(() => {
    setValue(String(props?.value ?? ''));
  }, [props?.value]);

  return (
    <Styles.Container
      backgroundColor={props.backgrounColor}
      hasBorder={props.hasBorder}
      marginTop={props.marginTop ?? 0}
      marginBottom={props.marginBottom ?? 45}
      marginLeft={props.marginLeft ?? 0}
      marginRight={props.marginRight ?? 0}
      items={props.items}
      disabled={props.disabled ?? false}
      placeholder={props.placeholder ?? ''}
      defaultValue={props.defaultValue}
      dropDownStyle={{ backgroundColor: card.background }}
      itemStyle={{
        borderBottomColor: border.color,
        borderBottomWidth: 1,
        minHeight: 50,
      }}
      arrowSize={25}
      labelStyle={{
        flex: 0.98,
        color: text.headline.color,
        marginLeft: 10,
        marginRight: 10,
      }}
      onChangeItem={(item) => {
        if (item?.value) {
          setValue(item.value);
        }

        props.onChange(item?.value ?? '');
      }}
    />
  );
};

export interface IDropDownItems {
  label: string | number;
  value: string;
  icon?: () => JSX.Element;
  hidden?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

type Props = {
  value?: string;
  defaultValue?: string;
  items: IDropDownItems[],
  disabled?: boolean;
  onChange: ((item: string) => void);
  backgrounColor?: string;
  marginBottom?: number;
  marginLeft?: number;
  hasBorder?: boolean;
  marginRight?: number;
  marginTop?: number;
  placeholder?: string;
}

export default DropDownOptions;
