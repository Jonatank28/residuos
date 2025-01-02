import I18n from 'i18n-js';

const ForbiddenException = (message?: string) => new Error(message ?? I18n.t('exceptions.forbidden'));

export default ForbiddenException;
