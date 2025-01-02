import I18n from 'i18n-js';

const DifferentMobileException = (message?: string) => new Error(message ?? I18n.t('exceptions.differentMobile'));

export default DifferentMobileException;