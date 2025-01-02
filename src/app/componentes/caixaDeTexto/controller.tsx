import * as React from 'react';
import { useField } from '@unform/core';
import {
  maskCEP, maskPhone, maskCPF, maskCNPJ, maskRG, maskIE, maskCPFCNPJ,
} from 'vision-common';

const Controller = (nome: string) => {
  const inputRef = React.useRef<any>(null);
  const {
    fieldName, registerField, defaultValue, error,
  } = useField(nome);

  React.useEffect(() => {
    inputRef.current.value = defaultValue;
  }, [defaultValue]);

  function handleMask(text: string, type: string) {
    let value = '';

    if (type === 'cep') {
      value = maskCEP(text);
    } else if (type === 'phone') {
      value = maskPhone(text);
    } else if (type === 'cpf') {
      value = maskCPF(text);
    } else if (type === 'cnpj') {
      value = maskCNPJ(text);
    } else if (type === 'cpfcnpj') {
      value = maskCPFCNPJ(text);
    } else if (type === 'rg') {
      value = maskRG(text);
    } else if (type === 'ie') {
      value = maskIE(text);
    }

    return value;
  }

  React.useEffect(() => registerField({
    name: fieldName,
    ref: inputRef.current,
    path: 'value',
    clearValue(ref: any) {
      ref.value = '';
      ref.clear();
    },
    setValue(ref: any, value: string) {
      ref.setNativeProps({ text: value });
      inputRef.current.value = value;
    },
    getValue(ref: { value: string; }) {
      return ref.value;
    },
  }), [fieldName, registerField]);

  return {
    inputRef,
    handleMask,
    defaultValue,
    error,
  };
};

export default Controller;
