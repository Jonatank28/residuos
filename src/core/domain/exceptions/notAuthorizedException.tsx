import I18n from 'i18n-js';

const NotAuthorizedException = (message?: string) => new Error(message ?? I18n.t('exceptions.notAuthorized'));

export default NotAuthorizedException;
