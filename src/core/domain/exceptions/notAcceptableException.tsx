import I18n from 'i18n-js';

const NotAcceptableException = (message?: string) => new Error(message ?? I18n.t('exceptions.customs.currentPassword'));

export default NotAcceptableException;
