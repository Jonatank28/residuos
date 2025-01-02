import I18n from 'i18n-js';

const NoLocationException = (message?: string) => new Error(message ?? I18n.t('exceptions.locationError'));

export default NoLocationException;
