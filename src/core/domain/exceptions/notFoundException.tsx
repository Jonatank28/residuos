import I18n from 'i18n-js';

const NotFoundException = (message?: string) => new Error(message ?? I18n.t('exceptions.notFound'));

export default NotFoundException;
