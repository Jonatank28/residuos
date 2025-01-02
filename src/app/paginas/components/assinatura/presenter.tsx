import { IQuestionarioRepositorio } from 'vision-questionario';
import QuestionarioRepositorio from 'vision-questionario/src/core/data/repositories/questionarioRepositorio';
import EnviarPerguntasQuestionarioUseCase from 'vision-questionario/src/core/domain/usecases/enviarPerguntasQuestionarioUseCase';
import { IGrupo } from '../../../../core/domain/entities/grupo';

export default class AssinaturaPresenter {
  private readonly iQuestionarioRepositorio: IQuestionarioRepositorio;

  private readonly enviarPerguntasQuestionarioUseCase: EnviarPerguntasQuestionarioUseCase;

  constructor() {
    this.iQuestionarioRepositorio = new QuestionarioRepositorio();

    this.enviarPerguntasQuestionarioUseCase = new EnviarPerguntasQuestionarioUseCase(this.iQuestionarioRepositorio);
  }

  enviarQuestionario = async (questionarioID: number, placa: string, grupos: IGrupo[], signature: string) => this.enviarPerguntasQuestionarioUseCase.execute({ questionarioID, placa, grupos, assinatura: signature });
}
