import { ApiException, ILocalStorageConnection } from 'vision-common';
import { UseCase } from 'vision-common/src/app/hooks/usecase';
import { IQuestionario } from 'vision-questionario';
import { $QUESTIONARIO_KEY } from '../../../constants';

export default class GetQuestionarioUseCase implements UseCase<void, IQuestionario | void | Error> {

  constructor(private readonly iLocalStorageConnection: ILocalStorageConnection) { }

  async execute(): Promise<IQuestionario | void | Error> {
    try {
      const response = await this.iLocalStorageConnection.getStorageDataObject<IQuestionario>($QUESTIONARIO_KEY);

      return response;
    } catch (e) {
      return ApiException(e);
    }
  };
}
