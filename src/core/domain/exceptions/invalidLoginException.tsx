import I18n from 'i18n-js';

const InvalidLoginException = (message?: string) => new Error(message ?? I18n.t('exceptions.invalidLogin'));

export default InvalidLoginException;
