import * as React from 'react';
import * as Styles from './styles';
import { useTheme } from 'styled-components/native';
import { IColumnConf, IReport } from '../../../core/domain/entities/report';
import CustomActiveIndicator from '../customActiveIndicator';

const ItemRelatorio = (props: Props) => {
  const { border } = useTheme();

  const findConf = (index: number, confs?: IColumnConf[]): IColumnConf => {
    const value: IColumnConf = {
      align: undefined,
      flex: undefined,
      index: undefined
    };

    if (confs && confs?.length > 0) {
      const newConfs = confs.filter((conf) => conf.index === index);

      if (newConfs?.length > 0) return newConfs[0];
    }

    return value;
  }

  return (
    <Styles.Container
      marginTop={props?.marginTop}
      marginBottom={props?.marginBottom}
      marginLeft={props?.marginLeft}
      marginRight={props?.marginRight}
      backgroundColor={props?.backgroundColor}
      activeOpacity={props?.onPress ? 0.5 : 1}
      onPress={props?.onPress}
    >
      <Styles.TituloContainer>
        <Styles.Titulo>{props?.report?.title ?? ''}</Styles.Titulo>
      </Styles.TituloContainer>
      {!props.loadingData ? (
        <Styles.DescricaoContainer>
          {props.report?.columns && props.report?.columns?.length > 0 && (
            <Styles.ColumnContainer>
              {props.report.columns.map((column, columnIndex, columnArray) => (
                <Styles.ColumnTituloContainer
                  key={String(columnIndex + Math.random())}
                  paddingLeft={columnIndex === 0 ? 5 : 0}
                  paddingRight={(columnArray && columnArray?.length - 1) ? 5 : 0}
                  flex={findConf(columnIndex, props.report?.colunmsConf).flex}
                >
                  <Styles.Titulo>{column ?? '-'}</Styles.Titulo>
                </Styles.ColumnTituloContainer>
              ))}
            </Styles.ColumnContainer>
          )}
          <Styles.RowsContainer>
            {props.report?.rows && props.report?.rows?.length > 0 ? (
              props.report.rows.map((row, rowIndex) => (
                <Styles.RowContainer
                  key={String(rowIndex + Math.random())}
                  hasColor={!!(rowIndex % 2 === 0)}
                  hasBorder={!!(props.report.rows && rowIndex === props.report.rows?.length - 1)}
                >
                  {
                    Object.values(row).map((value, valueIndex, array) => (
                      (props.report?.columns && valueIndex < props.report.columns?.length) && (
                        <Styles.RowDescricaoContainer
                          key={String(valueIndex + Math.random())}
                          flex={findConf(valueIndex, props.report?.colunmsConf).flex}
                          paddingLeft={valueIndex === 0 ? 5 : 0}
                          paddingRight={(array && array?.length - 1) ? 5 : 0}
                          alignItems={findConf(valueIndex, props.report?.colunmsConf).align}
                        >
                          <Styles.Descricao numberOfLines={1}>{String(value ?? '')}</Styles.Descricao>
                        </Styles.RowDescricaoContainer>
                      )
                    ))
                  }
                </Styles.RowContainer>
              ))
            ) : (
              <Styles.RowContainer>
                {props.report?.columns?.map((_, index) => (
                  <Styles.RowDescricaoContainer
                    key={String(index + Math.random())}
                    flex={findConf(index, props.report?.colunmsConf).flex}
                  >
                    <Styles.Descricao numberOfLines={1}>-</Styles.Descricao>
                  </Styles.RowDescricaoContainer>
                ))}
              </Styles.RowContainer>)}
          </Styles.RowsContainer>
        </Styles.DescricaoContainer>
      ) : (
        <Styles.LoadingContainer>
          <CustomActiveIndicator color={border.color} />
        </Styles.LoadingContainer>
      )}
    </Styles.Container >
  );
}

type Props = {
  report: IReport;
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: number;
  marginRight?: number;
  backgroundColor?: string;
  loadingData?: boolean;
  onPress?:()=>void;
};

export default ItemRelatorio;
