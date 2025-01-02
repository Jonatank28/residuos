import I18n from 'i18n-js';

const BadRequestException = (message?: string) => new Error(message ?? I18n.t('exceptions.badRequest'));

export default BadRequestException;
