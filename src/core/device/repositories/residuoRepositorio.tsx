import { timezoneDate, removerQuebrasLinha, IPaginationParams, AsyncSQLiteConnection, wait } from 'vision-common';
import { IContainer } from '../../domain/entities/container';
import { IEquipamento } from '../../domain/entities/equipamento';
import { IImobilizado } from '../../domain/entities/imobilizado';
import { IResiduo } from '../../domain/entities/residuo';
import { IDeviceResiduoRepositorio } from '../../domain/repositories/device/residuoRepositorio';
import { IPegarEquipamentosClienteDeviceUseCaseParams } from '../../domain/usecases/device/database/pegarEquipamentosClienteUseCase';
import { IPegarImobilizadosUseCaseParams } from '../../domain/usecases/device/database/pegarImobilizadosContratosUseCase';
import { IPegarImobilizadosUseCaseParametros } from '../../domain/usecases/device/database/pegarImobilizadosUseCase';
import { IPegarTodosImobilizadosUseCaseParametros } from '../../domain/usecases/device/database/pegarTodosImobilizadosUseCase';

export default class DeviceResiduoRepositorio implements IDeviceResiduoRepositorio {
  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) {}

  async criarTabelaResiduos() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS RESIDUOS (
        ID                             INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_RESIDUO                     INTEGER,
        CD_USUARIO                     INTEGER,
        DS_VINCULO                     TEXT,
        DS_RESIDUO                     TEXT,
        DS_UNIDADE                     TEXT,
        NR_QUANTIDADE                  INTEGER,
        DS_GRUPO                       TEXT,
        DS_OBSERVACAO                  TEXT,
        X_NAO_CONFORME                 INTEGER,
        X_EXECESSO                     INTEGER,
        DT_CADASTRO                    DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                 DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,

      'RESIDUOS',
    );

    return response;
  }

  async criarTabelaResiduosPesagem() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS RESIDUOS_SECUNDARIOS_PESAGEM (
        ID                             INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_RESIDUO                     INTEGER,
        CD_USUARIO                     INTEGER,
        CD_ID_RESIDUO_GENERICO         INTEGER,
        DS_VINCULO                     TEXT,
        DS_RESIDUO                     TEXT,
        DS_UNIDADE                     TEXT,
        CD_CONTRATO                    INTEGER,
        CD_SERVICO                     INTEGER,
        CD_CLIENTE                     INTEGER,
        NR_QUANTIDADE                  INTEGER,
        DS_GRUPO                       TEXT,
        DS_OBSERVACAO                  TEXT,
        X_NAO_CONFORME                 INTEGER,
        X_RESIDUO                      INTEGER,
        X_EXECESSO                     INTEGER,
        DT_CADASTRO                    DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                 DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'RESIDUOS_SECUNDARIOS_PESAGEM',
    );

    return response;
  }

  async criarTabelaResiduosContrato() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS RESIDUOS_CONTRATO (
        ID                             INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_RESIDUO                     INTEGER,
        CD_USUARIO                     INTEGER,
        DS_VINCULO                     TEXT,
        DS_RESIDUO                     TEXT,
        DS_UNIDADE                     TEXT,
        CD_CONTRATO                    INTEGER,
        CD_SERVICO                     INTEGER,
        CD_CLIENTE                     INTEGER,
        NR_QUANTIDADE                  INTEGER,
        DS_GRUPO                       TEXT,
        DS_OBSERVACAO                  TEXT,
        X_NAO_CONFORME                 INTEGER,
        X_RESIDUO                      INTEGER,
        X_EXECESSO                     INTEGER,
        DT_CADASTRO                    DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                 DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'RESIDUOS_CONTRATO',
    );

    return response;
  }

  async criarTabelaResiduosBase() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS RESIDUOS_BASE (
        ID                             INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_RESIDUO                     INTEGER,
        CD_USUARIO                     INTEGER,
        DS_VINCULO                     TEXT,
        DS_RESIDUO                     TEXT,
        DS_UNIDADE                     TEXT,
        CD_CONTRATO                    INTEGER,
        CD_SERVICO                     INTEGER,
        CD_CLIENTE                     INTEGER,
        NR_QUANTIDADE                  INTEGER,
        DS_GRUPO                       TEXT,
        DS_OBSERVACAO                  TEXT,
        X_NAO_CONFORME                 INTEGER,
        X_RESIDUO                      INTEGER,
        X_EXECESSO                     INTEGER,
        DT_CADASTRO                    DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                 DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'RESIDUOS_BASE',
    );

    return response;
  }

  async criarTabelaContainers() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS CONTAINERS (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_ORDEM_SERVICO              INTEGER,
        CD_CLIENTE                    INTEGER,
        CD_CONTAINER                  INTEGER,
        CD_MOVIMENTACAO               INTEGER,
        DS_CONTAINER                  TEXT,
        DT_COLOCACAO                  TEXT,
        DT_RETIRADA                   TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'CONTAINERS',
    );

    return response;
  }

  async criarTabelaEquipamentos() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS EQUIPAMENTOS (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        DS_VINCULO                    TEXT,
        CD_USUARIO                    INTEGER,
        CD_CLIENTE                    INTEGER,
        CD_CONTAINER                  INTEGER,
        CD_MOVIMENTACAO               INTEGER,
        DS_CONTAINER                  TEXT,
        DS_IDENTIFICACAO              TEXT,
        DT_COLOCACAO                  TEXT,
        DT_RETIRADA                   TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'EQUIPAMENTOS',
    );

    return response;
  }

  async criarTabelaEquipamentosPendentesLiberacao() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS EQUIPAMENTOS_MOVIMENTACAO_PENDENTES_LIBERACAO (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_MATERIAL                   INTEGER,
        CD_ETAPA                      INTEGER,
        CD_ORDSERVICO                 INTEGER,
        X_LIBERADO                    INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'EQUIPAMENTOS_MOVIMENTACAO_PENDENTES_LIBERACAO',
    );

    return response;
  }

  async criarTabelaEquipamentosClientes() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS EQUIPAMENTOS_CLIENTES (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_CLIENTE                    INTEGER,
        CD_CONTAINER                  INTEGER,
        CD_MOVIMENTACAO               INTEGER,
        DS_CONTAINER                  TEXT,
        DS_IDENTIFICACAO              TEXT,
        DT_COLOCACAO                  TEXT,
        DT_RETIRADA                   TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'EQUIPAMENTOS_CLIENTES',
    );

    return response;
  }

  async criarTabelaImobilizados() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS IMOBILIZADOS (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        DS_VINCULO                    TEXT,
        CD_USUARIO                    INTEGER,
        CD_IMOBILIZADO                INTEGER,
        DS_IMOBILIZADO                TEXT,
        DS_UNIDADE                    TEXT,
        DS_IDENTIFICACAO              TEXT,
        CD_QUANTIDADE                 INTEGER,
        X_MOVIMENTADO                 INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'IMOBILIZADOS',
    );

    return response;
  }

  async criarTabelaTodosImobilizados() {
    const response = await this._conn.create(
      `
      CREATE TABLE IF NOT EXISTS IMOBILIZADOS_TODOS (
        ID                              INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_IMOBILIZADO                  INTEGER,
        DS_IMOBILIZADO                  TEXT,
        NR_TARA                         INTEGER,
        NR_PESO_LIQUIDO                 INTEGER,
        DS_VINCULO                      TEXT,
        DT_CADASTRO                     DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                  DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'IMOBILIZADOS_TODOS',
    );
    return response;
  }

  async criarTabelaImobilizadosContratos() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS IMOBILIZADOS_CONTRATOS (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_IMOBILIZADO                INTEGER,
        CD_CONTRATO                   INTEGER,
        DS_IMOBILIZADO                TEXT,
        DS_IDENTIFICACAO              TEXT,
        X_NAO_GERAR_MOVIMENTACAO      INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'IMOBILIZADOS_CONTRATOS',
    );

    return response;
  }

  async criarTabelaImobilizadoGenericoContratos() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS IMOBILIZADOS_GENERICOS_CONTRATOS(
        ID                          INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                  INTEGER,
        CD_CONTRATO                 INTEGER,
        CD_IMOBILIZADO_GENERICO     INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME'))
      )`,
      'IMOBILIZADOS_GENERICOS_CONTRATOS',
    );
    return response;
  }

  async inserirImobilizado(imobilizado: IImobilizado) {
    const response = await this._conn.insert(
      `INSERT INTO IMOBILIZADOS (
        CD_USUARIO,
        CD_IMOBILIZADO,
        DS_IMOBILIZADO,
        DS_UNIDADE,
        DS_IDENTIFICACAO,
        CD_QUANTIDADE,
        X_MOVIMENTADO,
        X_NAO_GERAR_MOVIMENTACAO,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO,
        NR_VALOR_UNITARIO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        imobilizado.codigo,
        imobilizado.descricao,
        imobilizado.unidade,
        imobilizado.identificacao,
        imobilizado.quantidade,
        imobilizado.movimentado ? 1 : 0,
        imobilizado?.naoGerarMovimentacao ? 1 : 0,
        imobilizado?.xPesoEResiduoImobilizado ? 1 : 0,
        imobilizado?.valorUnitario ?? 0,
      ],
    );

    return response;
  }

  async inserirResiduoSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO RESIDUOS (
        CD_USUARIO,
        CD_RESIDUO,
        CD_ID_RESIDUO,
        X_EXIGE_INTEIRO,
        DS_VINCULO,
        DS_RESIDUO,
        DS_COR,
        DS_UNIDADE,
        NR_QUANTIDADE,
        DS_GRUPO,
        DS_OBSERVACAO,
        X_NAO_CONFORME,
        X_EXECESSO,
        CD_IBAMA,
        CD_ESTADO_FISICO,
        CD_SUB_GRUPO,
        CD_ACONDICIONAMENTO,
        CD_UNIDADE,
        CD_FORMA_TRATAMENTO,
        CD_HASH_RESIDUO,
        X_SERVICO_PRE_CADASTRO_REFERENCIA,
        NR_VALOR_UNITARIO,
        NR_PESO_BRUTO_TARA,
        NR_PESO_BRUTO,
        NR_CUBAGEM,
        X_IMOBILIZADO_GENERICO,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirResiduoPesagem(residuo: IResiduo, codigoVinculo: string) {
    const response = await this._conn.insert(
      `INSERT INTO RESIDUOS_SECUNDARIOS_PESAGEM (
        CD_USUARIO,
        CD_RESIDUO,
        CD_ID_RESIDUO,
        X_EXIGE_INTEIRO,
        DS_VINCULO,
        DS_RESIDUO,
        DS_COR,
        DS_UNIDADE,
        NR_QUANTIDADE,
        DS_GRUPO,
        DS_OBSERVACAO,
        X_NAO_CONFORME,
        X_EXECESSO,
        CD_IBAMA,
        CD_ESTADO_FISICO,
        CD_SUB_GRUPO,
        CD_ACONDICIONAMENTO,
        CD_UNIDADE,
        CD_FORMA_TRATAMENTO,
        CD_HASH_RESIDUO,
        X_SERVICO_PRE_CADASTRO_REFERENCIA,
        NR_VALOR_UNITARIO,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO_TARA,
        NR_PESO_BRUTO,
        NR_CUBAGEM,
        X_IMOBILIZADO_GENERICO,
        CD_IMOBILIZADO_REAL,
        CD_ID_RESIDUO_GENERICO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        residuo.codigo,
        residuo.codigoIDResiduo,
        residuo.xExigeInteiro ? 1 : 0,
        codigoVinculo,
        residuo.descricao,
        residuo.cor,
        residuo.unidade,
        residuo.quantidade,
        residuo.subGrupo,
        removerQuebrasLinha(residuo?.observacao ?? ''),
        residuo.naoConforme,
        residuo.excesso,
        residuo?.codigoIbama ?? null,
        residuo?.codigoEstadoFisico ?? null,
        residuo?.codigoSubGrupo ?? null,
        residuo?.codigoAcondicionamento ?? null,
        residuo?.codigoUnidade ?? null,
        residuo?.codigoFormaTratamento ?? null,
        residuo?.codigoHashResiduo ?? null,
        residuo?.preCadastroReferencia ? 1 : 0,
        residuo?.valorUnitario,
        residuo?.codigoImobilizadoGenerico ?? null,
        residuo?.tara ?? null,
        residuo?.pesoBruto ?? null,
        residuo?.cubagem ?? null,
        residuo?.xImobilizadoGenerico ? 1 : 0,
        residuo?.codigoImobilizadoReal ?? 0,
        residuo.codigoIDResiduoGenerico ?? 0,
      ],
    );

    return response;
  }

  async inserirResiduo(residuo: IResiduo, codigoVinculo: string | number) {
    const response = await this._conn.insert(
      `INSERT INTO RESIDUOS (
        CD_USUARIO,
        CD_RESIDUO,
        CD_ID_RESIDUO,
        X_EXIGE_INTEIRO,
        DS_VINCULO,
        DS_RESIDUO,
        DS_COR,
        DS_UNIDADE,
        NR_QUANTIDADE,
        DS_GRUPO,
        DS_OBSERVACAO,
        X_NAO_CONFORME,
        X_EXECESSO,
        CD_IBAMA,
        CD_ESTADO_FISICO,
        CD_SUB_GRUPO,
        CD_ACONDICIONAMENTO,
        CD_UNIDADE,
        CD_FORMA_TRATAMENTO,
        CD_HASH_RESIDUO,
        X_SERVICO_PRE_CADASTRO_REFERENCIA,
        NR_VALOR_UNITARIO,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO_TARA,
        NR_PESO_BRUTO,
        NR_CUBAGEM,
        X_IMOBILIZADO_GENERICO,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO,
        CD_IMOBILIZADO_REAL
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        residuo.codigo,
        residuo.codigoIDResiduo,
        residuo.xExigeInteiro ? 1 : 0,
        codigoVinculo,
        residuo.descricao,
        residuo.cor,
        residuo.unidade,
        residuo.quantidade,
        residuo.subGrupo,
        removerQuebrasLinha(residuo?.observacao ?? ''),
        residuo.naoConforme,
        residuo.excesso,
        residuo?.codigoIbama ?? null,
        residuo?.codigoEstadoFisico ?? null,
        residuo?.codigoSubGrupo ?? null,
        residuo?.codigoAcondicionamento ?? null,
        residuo?.codigoUnidade ?? null,
        residuo?.codigoFormaTratamento ?? null,
        residuo?.codigoHashResiduo ?? null,
        residuo?.preCadastroReferencia ? 1 : 0,
        residuo?.valorUnitario,
        residuo?.codigoImobilizadoGenerico ?? null,
        residuo?.tara ?? null,
        residuo?.pesoBruto ?? null,
        residuo?.cubagem ?? null,
        residuo?.xImobilizadoGenerico ? 1 : 0,
        residuo?.xColetarSomenteComEquipamento ? 1 : 0,
        residuo?.codigoImobilizadoReal ?? 0,
      ],
    );

    return response;
  }

  async inserirResiduoContrato(residuo: IResiduo) {
    const response = await this._conn.insert(
      `INSERT INTO RESIDUOS_CONTRATO (
        CD_USUARIO,
        CD_RESIDUO,
        X_EXIGE_INTEIRO,
        CD_CONTRATO,
        CD_SERVICO,
        CD_CLIENTE,
        DS_RESIDUO,
        DS_COR,
        DS_UNIDADE,
        NR_QUANTIDADE,
        DS_GRUPO,
        DS_OBSERVACAO,
        X_RESIDUO,
        X_NAO_CONFORME,
        X_EXECESSO,
        CD_IBAMA,
        CD_ESTADO_FISICO,
        CD_SUB_GRUPO,
        CD_ACONDICIONAMENTO,
        CD_UNIDADE,
        CD_FORMA_TRATAMENTO,
        NR_VALOR_UNITARIO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        residuo.codigo,
        residuo.xExigeInteiro ? 1 : 0,
        residuo.codigoContrato && residuo.codigoContrato !== 0 ? residuo.codigoContrato : null,
        residuo.codigoServico && residuo.codigoServico !== 0 ? residuo.codigoServico : null,
        residuo.codigoCliente && residuo.codigoCliente !== 0 ? residuo.codigoCliente : null,
        residuo.descricao,
        residuo.cor,
        residuo.unidade,
        residuo.quantidade,
        residuo.subGrupo,
        removerQuebrasLinha(residuo?.observacao ?? ''),
        residuo.xResiduo ? 1 : 0,
        residuo.naoConforme,
        residuo.excesso,
        residuo?.codigoIbama ?? null,
        residuo?.codigoEstadoFisico ?? null,
        residuo?.codigoSubGrupo ?? null,
        residuo?.codigoAcondicionamento ?? null,
        residuo?.codigoUnidade ?? null,
        residuo?.codigoFormaTratamento ?? null,
        residuo?.valorUnitario ?? 0,
      ],
    );

    return response;
  }

  async inserirContainer(container: IContainer) {
    const response = await this._conn.insert(
      `INSERT INTO CONTAINERS (
        CD_USUARIO,
        CD_ORDEM_SERVICO,
        CD_CLIENTE,
        CD_CONTAINER,
        CD_MOVIMENTACAO,
        DS_CONTAINER,
        DT_COLOCACAO,
        DT_RETIRADA
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        container.codigoOS,
        container.codigoCliente,
        container.codigoContainer,
        container.codigoMovimentacao,
        container.descricaoContainer,
        container.dataColocacao,
        container.dataRetirada,
      ],
    );

    return response;
  }

  async deletarResiduo(codigoVinculo: string | number) {
    const response = await this._conn.delete('DELETE FROM RESIDUOS WHERE DS_VINCULO = ? AND CD_USUARIO = ?', [
      codigoVinculo,
      this.userID,
    ]);

    return response;
  }

  async deletarResiduoSecundarioPesagem(codigoVinculo: string) {
    const response = await this._conn.delete(
      "DELETE FROM RESIDUOS_SECUNDARIOS_PESAGEM WHERE COALESCE(DS_VINCULO, '') LIKE ? AND CD_USUARIO = ?",
      [`%${codigoVinculo}%`, this.userID],
    );

    return response;
  }

  async deletarRascunhoResiduoSecundarioPesagem(codigoVinculo: string) {
    const response = await this._conn.delete(
      `DELETE FROM RESIDUOS_SECUNDARIOS_PESAGEM WHERE COALESCE(DS_VINCULO, '') LIKE '%${codigoVinculo}%'`,
      [],
    );

    return response;
  }

  async deletarResiduos() {
    const response = await this._conn.delete('DELETE FROM RESIDUOS WHERE CD_USUARIO = ? AND DS_VINCULO IS NULL', [this.userID]);

    return response;
  }

  async deletarResiduosBase() {
    const response = await this._conn.delete('DELETE FROM RESIDUOS_BASE WHERE CD_USUARIO = ?', [this.userID]);

    return response;
  }

  async deletarResiduosContrato() {
    const response = await this._conn.delete('DELETE FROM RESIDUOS_CONTRATO WHERE CD_USUARIO = ?', [this.userID]);

    return response;
  }
  async deletarTodosImobilizados() {
    const response = await this._conn.delete('DELETE FROM IMOBILIZADOS_TODOS', []);
    return response;
  }

  async inserirEquipamentoSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO EQUIPAMENTOS (
        CD_USUARIO,
        DS_VINCULO,
        CD_CLIENTE,
        CD_OBRA,
        CD_CONTAINER,
        CD_MOVIMENTACAO,
        DS_CONTAINER,
        DS_IDENTIFICACAO,
        DT_COLOCACAO,
        DT_RETIRADA,
        X_NAO_GERAR_MOVIMENTACAO,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO_TARA,
        NR_PESO_BRUTO,
        NR_CUBAGEM,
        X_ETAPA_PENDENTE
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirImobilizadosSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO IMOBILIZADOS (
        CD_USUARIO,
        CD_IMOBILIZADO,
        DS_IMOBILIZADO,
        DS_UNIDADE,
        DS_IDENTIFICACAO,
        CD_QUANTIDADE,
        X_MOVIMENTADO,
        X_NAO_GERAR_MOVIMENTACAO,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO_TARA,
        NR_PESO_BRUTO,
        NR_CUBAGEM,
        NR_VALOR_UNITARIO
      ) VALUES ${sqlParams}`,
      [],
    );
    return response;
  }
  async inserirTodosImobilizadosSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO IMOBILIZADOS_TODOS (
        CD_IMOBILIZADO,
        DS_IMOBILIZADO,
        NR_TARA,
        NR_PESO_LIQUIDO,
        DS_VINCULO
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirEquipamentosPendentesLiberacaoSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO EQUIPAMENTOS_MOVIMENTACAO_PENDENTES_LIBERACAO (
        CD_USUARIO,
        CD_MATERIAL,
        CD_ETAPA,
        CD_ORDSERVICO,
        X_LIBERADO
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirImobilizadosContratosSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO IMOBILIZADOS_CONTRATOS (
        CD_USUARIO,
        CD_IMOBILIZADO,
        CD_CONTRATO,
        DS_IMOBILIZADO,
        DS_IDENTIFICACAO,
        X_NAO_GERAR_MOVIMENTACAO,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO_TARA,
        NR_PESO_BRUTO,
        NR_CUBAGEM
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirImobilizadosGenericosContratosSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO IMOBILIZADOS_GENERICOS_CONTRATOS (
        CD_USUARIO,
        CD_CONTRATO,
        CD_IMOBILIZADO_GENERICO
      ) VALUES ${sqlParams}`,
      [],
    );
    return response;
  }

  async inserirEquipamento(equipamento: IEquipamento, codigoVinculo: number | string) {
    const response = await this._conn.insert(
      `INSERT INTO EQUIPAMENTOS (
        CD_USUARIO,
        DS_VINCULO,
        CD_CLIENTE,
        CD_OBRA,
        CD_CONTAINER,
        CD_MOVIMENTACAO,
        DS_CONTAINER,
        DS_IDENTIFICACAO,
        DT_COLOCACAO,
        DT_RETIRADA,
        X_NAO_GERAR_MOVIMENTACAO,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO,
        X_ETAPA_PENDENTE,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO_TARA,
        NR_PESO_BRUTO,
        NR_CUBAGEM
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        codigoVinculo,
        equipamento.codigoCliente,
        equipamento?.codigoObra,
        equipamento.codigoContainer,
        equipamento.codigoMovimentacao,
        equipamento.descricaoContainer,
        equipamento.identificacao,
        equipamento.dataColocacao ? timezoneDate(equipamento.dataColocacao) : timezoneDate(new Date()),
        equipamento.dataRetirada ? timezoneDate(equipamento.dataRetirada) : null,
        equipamento?.naoGerarMovimentacao ? 1 : 0,
        equipamento?.xPesoEResiduoImobilizado ? 1 : 0,
        equipamento?.xEtapaPendente ? 1 : 0,
        equipamento?.codigoImobilizadoGenerico,
        equipamento?.tara,
        equipamento?.pesoBruto,
        equipamento?.cubagem,
      ],
    );

    return response;
  }

  async inserirEquipamentoCliente(equipamento: IEquipamento) {
    const response = await this._conn.insert(
      `INSERT INTO EQUIPAMENTOS_CLIENTES (
        CD_USUARIO,
        CD_CLIENTE,
        CD_OBRA,
        CD_CONTAINER,
        CD_MOVIMENTACAO,
        DS_CONTAINER,
        DS_IDENTIFICACAO,
        DT_COLOCACAO,
        DT_RETIRADA,
        X_ETAPA_PENDENTE
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        this.userID,
        equipamento.codigoCliente,
        equipamento?.codigoObra,
        equipamento.codigoContainer,
        equipamento.codigoMovimentacao,
        equipamento.descricaoContainer,
        equipamento.identificacao,
        equipamento.dataColocacao ? timezoneDate(equipamento.dataColocacao) : timezoneDate(new Date()),
        equipamento.dataRetirada ? equipamento.dataRetirada : null,
        equipamento?.xEtapaPendente ? 1 : 0,
      ],
    );

    return response;
  }

  async deletarEquipamento(codigoVinculo: string | number) {
    const response = await this._conn.delete('DELETE FROM EQUIPAMENTOS WHERE DS_VINCULO = ? AND CD_USUARIO = ?', [
      codigoVinculo,
      this.userID,
    ]);

    return response;
  }

  async deletarEquipamentosClientes() {
    const response = await this._conn.delete('DELETE FROM EQUIPAMENTOS_CLIENTES WHERE CD_USUARIO = ?', [this.userID]);

    return response;
  }

  async deletarEquipamentosPendentesLiberacao() {
    const response = await this._conn.delete('DELETE FROM EQUIPAMENTOS_MOVIMENTACAO_PENDENTES_LIBERACAO WHERE CD_USUARIO = ?', [
      this.userID,
    ]);

    return response;
  }

  async deletarImobilizados() {
    const response = await this._conn.delete('DELETE FROM IMOBILIZADOS WHERE CD_USUARIO = ?', [this.userID]);

    return response;
  }

  async deletarImobilizadosContratos() {
    const response = await this._conn.delete('DELETE FROM IMOBILIZADOS_CONTRATOS WHERE CD_USUARIO = ?', [this.userID]);

    return response;
  }

  async deletarImobilizadosGenericosContratos() {
    const response = await this._conn.delete('DELETE  FROM IMOBILIZADOS_GENERICOS_CONTRATOS WHERE CD_USUARIO = ?', [this.userID]);

    return response;
  }

  async pegarContainers(codigoCliente: number) {
    const response = await this._conn.query<IContainer>(
      `SELECT
        CD_ORDEM_SERVICO      AS codigoOS,
        CD_CLIENTE            AS codigoCliente,
        CD_CONTAINER          AS codigoContainer,
        CD_MOVIMENTACAO       AS codigoMovimentacao,
        DS_CONTAINER          AS descricaoContainer,
        DT_COLOCACAO          AS dataColocacao,
        DT_RETIRADA           AS dataRetirada
      FROM CONTAINERS
      WHERE CD_CLIENTE = ? AND CD_USUARIO = ?`,
      [codigoCliente, this.userID],
    );

    return response;
  }

  async pegarEquipamentos(codigoVinculo: string | number) {
    const response = await this._conn.query<IEquipamento>(
      `SELECT
        DS_VINCULO                        AS codigoVinculo,
        CD_CLIENTE                        AS codigoCliente,
        CD_CONTAINER                      AS codigoContainer,
        CD_OBRA                           AS codigoObra,
        CD_MOVIMENTACAO                   AS codigoMovimentacao,
        DS_IDENTIFICACAO                  AS identificacao,
        DS_CONTAINER                      AS descricaoContainer,
        DT_COLOCACAO                      AS dataColocacao,
        DT_RETIRADA                       AS dataRetirada,
        X_NAO_GERAR_MOVIMENTACAO          AS naoGerarMovimentacao,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO   AS xPesoEResiduoImobilizado,
        X_ETAPA_PENDENTE                  AS xEtapaPendente,
        CD_IMOBILIZADO_GENERICO           AS codigoImobilizadoGenerico,
        NR_PESO_BRUTO_TARA                AS tara,
        NR_PESO_BRUTO                     AS pesoBruto,
        NR_CUBAGEM                        AS cubagem
      FROM EQUIPAMENTOS
      WHERE DS_VINCULO = ? AND CD_USUARIO = ?`,
      [codigoVinculo, this.userID],
    );

    return response;
  }

  async pegarEquipamentosCliente(params: IPegarEquipamentosClienteDeviceUseCaseParams) {
    const response = await this._conn.query<IEquipamento>(
      `SELECT
        CD_CLIENTE                AS codigoCliente,
        CD_CONTAINER              AS codigoContainer,
        CD_OBRA                   AS codigoObra,
        CD_MOVIMENTACAO           AS codigoMovimentacao,
        DS_IDENTIFICACAO          AS identificacao,
        DS_CONTAINER              AS descricaoContainer,
        DT_COLOCACAO              AS dataColocacao,
        DT_RETIRADA               AS dataRetirada,
        X_ETAPA_PENDENTE          AS xEtapaPendente
      FROM EQUIPAMENTOS_CLIENTES
      WHERE CD_CLIENTE = ? AND CD_USUARIO = ?
      AND (CAST(? AS INTEGER) = 0 OR CAST(CD_OBRA AS INTEGER) = CAST(? AS INTEGER))
      AND (CAST(? AS INTEGER) = 0 OR (CD_OBRA IS NULL OR CD_OBRA = 0))`,
      [params.clienteID, this.userID, params?.obraID ?? 0, params?.obraID ?? 0, params?.semObra ? 1 : 0],
    );

    return response;
  }

  async pegarImobilizados(parametros: IPegarImobilizadosUseCaseParametros, codigosEquipamentosJaAdicionados?: number[]) {
    const response = await this._conn.query<IImobilizado>(
      `SELECT
        CD_IMOBILIZADO                    AS codigo,
        DS_IMOBILIZADO                    AS descricao,
        DS_UNIDADE                        AS unidade,
        DS_IDENTIFICACAO                  AS identificacao,
        CD_QUANTIDADE                     AS quantidade,
        X_MOVIMENTADO                     AS movimentado,
        X_NAO_GERAR_MOVIMENTACAO          AS naoGerarMovimentacao,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO   AS xPesoEResiduoImobilizado,
        X_ETAPA_PENDENTE                  AS xEtapaPendente,
        CD_IMOBILIZADO_GENERICO           AS codigoImobilizadoGenerico,
        NR_PESO_BRUTO_TARA                AS tara,
        NR_PESO_BRUTO                     AS pesoBruto,
        NR_CUBAGEM                        AS cubagem,
        NR_VALOR_UNITARIO                 AS valorUnitario
      FROM IMOBILIZADOS
      WHERE (
        CD_IMOBILIZADO LIKE ?
        OR DS_IMOBILIZADO LIKE ?
      ) AND CD_USUARIO = ? AND DS_VINCULO IS NULL
      AND (CAST(? AS INTEGER) = 0 OR CD_IMOBILIZADO NOT IN (
      	SELECT CD_MATERIAL FROM EQUIPAMENTOS_MOVIMENTACAO_PENDENTES_LIBERACAO MOVIMENTACAO WHERE MOVIMENTACAO.CD_USUARIO = ?
      ))
      ${
        !!codigosEquipamentosJaAdicionados?.length
          ? `AND CD_IMOBILIZADO NOT IN (${codigosEquipamentosJaAdicionados.join(',')})`
          : ''
      }
      ORDER BY CD_IMOBILIZADO
      LIMIT ? OFFSET ?`,
      [
        parametros.paginacao.search?.length > 0 ? `%${parametros.paginacao.search}%` : '%',
        parametros.paginacao.search?.length > 0 ? `%${parametros.paginacao.search}%` : '%',
        this.userID,
        parametros.xSomenteEquipamentosLiberados ? 1 : 0,
        this.userID,
        parametros.paginacao.amount ?? 10,
        parametros.paginacao.page !== 0 ? `${10 * (parametros.paginacao.page - 1)}` : parametros.paginacao.page ?? 0,
      ],
    );

    return response;
  }

  async pegarTodosImobilizados(parametros: IPegarTodosImobilizadosUseCaseParametros) {
    const response = await this._conn.query<IImobilizado>(
      `SELECT
        CD_IMOBILIZADO                    AS codigo,
        DS_IMOBILIZADO                    AS descricao,
        NR_TARA                           AS tara,
        NR_PESO_LIQUIDO                   AS pesoBruto,
        DS_VINCULO                        AS codigoVinculo
      FROM IMOBILIZADOS_TODOS
      WHERE
        (CD_IMOBILIZADO LIKE ?
        OR DS_IMOBILIZADO LIKE ?)
        AND DS_VINCULO = ''
      ORDER BY CD_IMOBILIZADO
      LIMIT ? OFFSET ?`,

      [
        parametros.paginacao.search?.length > 0 ? `%${parametros.paginacao.search}%` : '%',
        parametros.paginacao.search?.length > 0 ? `%${parametros.paginacao.search}%` : '%',
        parametros.paginacao.amount ?? 10,
        parametros.paginacao.page !== 0 ? `${10 * (parametros.paginacao.page - 1)}` : parametros.paginacao.page ?? 0,
      ],
    );
    return response;
  }

  async vincularImobilizadoNoResiduo(parametros: { codigoVinculo: string | number; imobilizado: IImobilizado }) {
    try {
      const imobilizado = this.pegarImobilizadoDoResiduoVinculo(parametros.codigoVinculo);

      if ((await imobilizado)._array.length) {
        const response = await this._conn.update(
          `UPDATE IMOBILIZADOS_TODOS
          SET
          CD_IMOBILIZADO = ?,
          DS_IMOBILIZADO =     ?,
          NR_TARA        =    ?,
          NR_PESO_LIQUIDO =   ?,
          DS_VINCULO       = ?
          WHERE DS_VINCULO = ?
          `,
          [
            parametros.imobilizado.codigo,
            parametros.imobilizado.descricao,
            parametros.imobilizado.tara,
            parametros.imobilizado.pesoLiquido,
            parametros.codigoVinculo,
            parametros.codigoVinculo,
          ],
        );
        return;
      } else {
        const response = await this._conn.insert(
          `INSERT INTO IMOBILIZADOS_TODOS
        (
          CD_IMOBILIZADO,
          DS_IMOBILIZADO,
          NR_TARA,
          NR_PESO_LIQUIDO,
          DS_VINCULO
          )
          VALUES
          (?,?,?,?,?)

          `,
          [
            parametros.imobilizado.codigo,
            parametros.imobilizado.descricao,
            parametros.imobilizado.tara,
            parametros.imobilizado.pesoLiquido,
            parametros.codigoVinculo,
          ],
        );
        return;
      }
    } catch (e: any) {
      return new Error(e);
    }
  }
  async pegarImobilizadoDoResiduoVinculo(codigoVinculo: string | number) {
    const response = await this._conn.query<IImobilizado>(
      `SELECT
        CD_IMOBILIZADO                    AS codigo,
        DS_IMOBILIZADO                    AS descricao,
        NR_TARA                           AS tara,
        NR_PESO_LIQUIDO                   AS pesoBruto,
        DS_VINCULO                        AS codigoVinculo
      FROM IMOBILIZADOS_TODOS
      WHERE DS_VINCULO = ?
      ORDER BY CD_IMOBILIZADO
      LIMIT 1`,
      [codigoVinculo],
    );

    return response;
  }

  async pegarImobilizadosContratos(params: IPegarImobilizadosUseCaseParams, codigosEquipamentosJaAdicionados?: number[]) {
    const response = await this._conn.query<IImobilizado>(
      `SELECT
        CD_IMOBILIZADO                    AS codigo,
        DS_IMOBILIZADO                    AS descricao,
        DS_IDENTIFICACAO                  AS identificacao,
        CD_CONTRATO                       AS contratoID,
        X_NAO_GERAR_MOVIMENTACAO          AS naoGerarMovimentacao,
        X_PESO_E_RESIDUO_DO_IMOBILIZADO   AS xPesoEResiduoImobilizado,
        X_ETAPA_PENDENTE                  AS xEtapaPendente,
        CD_IMOBILIZADO_GENERICO           AS codigoImobilizadoGenerico,
        NR_PESO_BRUTO_TARA                AS tara,
        NR_PESO_BRUTO                     AS pesoBruto,
        NR_CUBAGEM                        AS cubagem
      FROM IMOBILIZADOS_CONTRATOS
      WHERE (
        CD_IMOBILIZADO LIKE ?
        OR DS_IMOBILIZADO LIKE ?
      ) AND CD_USUARIO = ? AND (CD_CONTRATO = ? OR CD_CONTRATO = 0)
      AND (CAST(? AS INTEGER) = 0 OR CD_IMOBILIZADO NOT IN (
      	SELECT CD_MATERIAL FROM EQUIPAMENTOS_MOVIMENTACAO_PENDENTES_LIBERACAO MOVIMENTACAO WHERE MOVIMENTACAO.CD_USUARIO = ?
      ))
      AND (CAST(? AS INTEGER) = 0 OR CD_IMOBILIZADO_GENERICO IN (
      	SELECT CD_IMOBILIZADO_GENERICO FROM IMOBILIZADOS_GENERICOS_CONTRATOS  WHERE CD_USUARIO = ?
         --AND IMOBILIZADOS_CONTRATOS.CD_CONTRATO = 0
        AND IMOBILIZADOS_GENERICOS_CONTRATOS.CD_CONTRATO = ?
      ))
      ${
        !!codigosEquipamentosJaAdicionados?.length
          ? `AND CD_IMOBILIZADO NOT IN (${codigosEquipamentosJaAdicionados.join(',')})`
          : ''
      }
      ORDER BY CD_IMOBILIZADO
      LIMIT ? OFFSET ?`,
      [
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        this.userID,
        params.contratoID,
        params.xSomenteEquipamentosLiberados ? 1 : 0,
        this.userID,
        params.somenteEquipamentosGenericos ? 1 : 0,
        this.userID,
        params.contratoID,
        params.pagination.amount ?? 10,
        params.pagination.page !== 0 ? `${10 * (params.pagination.page - 1)}` : params.pagination.page ?? 0,
      ],
    );

    return response;
  }

  async pegarResiduosVinculo(codigoVinculo: string | number) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        ID                                  AS codigoIDResiduoGenerico,
        CD_RESIDUO                          AS codigo,
        CD_ID_RESIDUO                       AS codigoIDResiduo,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        CD_HASH_RESIDUO                     AS codigoHashResiduo,
        X_SERVICO_PRE_CADASTRO_REFERENCIA   AS preCadastroReferencia,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        NR_CUBAGEM                          AS cubagem,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto
      FROM RESIDUOS
      WHERE DS_VINCULO LIKE ? AND CD_USUARIO = ?
      ORDER BY CD_RESIDUO`,
      [codigoVinculo, this.userID],
    );

    return response;
  }

  async pegarResiduosContratoServico(clienteID: number) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        CD_RESIDUO                          AS codigo,
        CD_SERVICO                          AS codigoServico,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        CD_CONTRATO                         AS codigoContrato,
        CD_CLIENTE                          AS codigoCliente,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_RESIDUO                           AS xResiduo,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        NR_CUBAGEM                          AS cubagem,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento
      FROM RESIDUOS_CONTRATO
      WHERE CD_USUARIO = ? AND CD_CLIENTE = ? AND X_RESIDUO = 0`,
      [this.userID, clienteID],
    );

    return response;
  }

  async pegarResiduosPeloContratoOrSemContrato(clienteID: number, contratoID: number) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        CD_RESIDUO                          AS codigo,
        CD_SERVICO                          AS codigoServico,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        CD_CONTRATO                         AS codigoContrato,
        CD_CLIENTE                          AS codigoCliente,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_RESIDUO                           AS xResiduo,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        NR_CUBAGEM                          AS cubagem,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento
      FROM RESIDUOS_CONTRATO
      WHERE CD_USUARIO = ?
        AND CD_CLIENTE = ?
        AND X_RESIDUO = 1
        AND CD_CONTRATO IS NOT NULL
        AND (CD_CONTRATO = 0 OR CD_CONTRATO = ?)`,
      [this.userID, clienteID, contratoID],
    );

    return response;
  }

  async pegarResiduosSemContratoPorClienteServico(clienteID: number) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        CD_RESIDUO                          AS codigo,
        CD_SERVICO                          AS codigoServico,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        CD_CONTRATO                         AS codigoContrato,
        CD_CLIENTE                          AS codigoCliente,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_RESIDUO                           AS xResiduo,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        NR_CUBAGEM                          AS cubagem,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento
      FROM RESIDUOS_CONTRATO
      WHERE CD_USUARIO = ?
        AND CD_CLIENTE = ?
        AND X_RESIDUO = 1
        AND (CD_CONTRATO IS NOT NULL OR CD_CONTRATO IS NULL)`,
      [this.userID, clienteID],
    );

    return response;
  }

  async pegarResiduosComContratoServico(clienteID: number, contratoID: number) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        CD_RESIDUO                          AS codigo,
        CD_SERVICO                          AS codigoServico,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        CD_CONTRATO                         AS codigoContrato,
        CD_CLIENTE                          AS codigoCliente,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_RESIDUO                           AS xResiduo,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        NR_CUBAGEM                          AS cubagem,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento
      FROM RESIDUOS_CONTRATO
      WHERE CD_USUARIO = ?
        AND CD_CLIENTE = ?
        AND X_RESIDUO = 0
        AND CD_CONTRATO = ?`,
      [this.userID, clienteID, contratoID],
    );

    return response;
  }

  async pegarResiduosBase() {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        CD_RESIDUO                          AS codigo,
        CD_SERVICO                          AS codigoServico,
        CD_CONTRATO                         AS codigoContrato,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        CD_CLIENTE                          AS codigoCliente,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_RESIDUO                           AS xResiduo,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento
      FROM RESIDUOS_BASE
      WHERE CD_USUARIO = ?`,
      [this.userID],
    );

    return response;
  }

  async pegarResiduosGenericosPesagem(codigoVinculo: number | string) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        CD_RESIDUO                          AS codigo,
        CD_SERVICO                          AS codigoServico,
        CD_CONTRATO                         AS codigoContrato,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        CD_CLIENTE                          AS codigoCliente,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_RESIDUO                           AS xResiduo,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto,
        NR_CUBAGEM                          AS cubagem,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal
      FROM RESIDUOS
      WHERE CD_USUARIO = ? AND DS_VINCULO = ? AND X_IMOBILIZADO_GENERICO = 1`,
      [this.userID, codigoVinculo],
    );

    return response;
  }

  async pegarResiduosSecundariosPesagem(codigoVinculo: number | string) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        CD_RESIDUO                          AS codigo,
        CD_SERVICO                          AS codigoServico,
        CD_CONTRATO                         AS codigoContrato,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        CD_CLIENTE                          AS codigoCliente,
        CD_ID_RESIDUO_GENERICO              AS codigoIDResiduoGenerico,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_RESIDUO                           AS xResiduo,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto,
        NR_CUBAGEM                          AS cubagem,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico
      FROM RESIDUOS_SECUNDARIOS_PESAGEM
      WHERE CD_USUARIO = ? AND DS_VINCULO = ?`,
      [this.userID, codigoVinculo],
    );

    return response;
  }

  async pegarResiduosSemVinculo(params: IPaginationParams) {
    const response = await this._conn.query<IResiduo>(
      `SELECT
        ID                                  AS id,
        CD_RESIDUO                          AS codigo,
        CD_ID_RESIDUO                       AS codigoIDResiduo,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        CD_HASH_RESIDUO                     AS codigoHashResiduo,
        X_SERVICO_PRE_CADASTRO_REFERENCIA   AS preCadastroReferencia,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento,
        NR_PESO_BRUTO_TARA                  AS tara,
        NR_PESO_BRUTO                       AS pesoBruto,
        NR_CUBAGEM                          AS cubagem,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico
      FROM RESIDUOS
      WHERE (
        CD_RESIDUO LIKE ?
        OR DS_RESIDUO LIKE ?
      ) AND CD_USUARIO = ? AND DS_VINCULO IS NULL ORDER BY DS_RESIDUO
      LIMIT ? OFFSET ?`,
      [
        params.search?.length > 0 ? `%${params.search}%` : '%',
        params.search?.length > 0 ? `%${params.search}%` : '%',
        this.userID,
        params.amount ?? 10,
        params.page !== 0 ? `${10 * (params.page - 1)}` : params.page ?? 0,
      ],
    );

    return response;
  }

  async pegarImobilizadoGenericoPorCodigo(residuoID: number, nomeTabela: string) {
    const response = await this._conn.queryFisrt<IResiduo>(
      `SELECT
        CD_RESIDUO                          AS codigo,
        CD_ID_RESIDUO                       AS codigoIDResiduo,
        X_EXIGE_INTEIRO                     AS xExigeInteiro,
        DS_VINCULO                          AS codigoVinculo,
        DS_RESIDUO                          AS descricao,
        DS_COR                              AS cor,
        DS_UNIDADE                          AS unidade,
        NR_QUANTIDADE                       AS quantidade,
        DS_GRUPO                            AS subGrupo,
        DS_OBSERVACAO                       AS observacao,
        X_NAO_CONFORME                      AS naoConforme,
        X_EXECESSO                          AS excesso,
        CD_IBAMA                            AS codigoIbama,
        CD_ESTADO_FISICO                    AS codigoEstadoFisico,
        CD_SUB_GRUPO                        AS codigoSubGrupo,
        CD_ACONDICIONAMENTO                 AS codigoAcondicionamento,
        CD_UNIDADE                          AS codigoUnidade,
        CD_FORMA_TRATAMENTO                 AS codigoFormaTratamento,
        CD_HASH_RESIDUO                     AS codigoHashResiduo,
        X_SERVICO_PRE_CADASTRO_REFERENCIA   AS preCadastroReferencia,
        NR_VALOR_UNITARIO                   AS valorUnitario,
        X_IMOBILIZADO_GENERICO              AS xImobilizadoGenerico,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO   AS xColetarSomenteComEquipamento,
        NR_PESO_BRUTO                       AS tara,
        NR_CUBAGEM                          AS cubagem,
        CD_IMOBILIZADO_REAL                 AS codigoImobilizadoReal,
        CD_IMOBILIZADO_GENERICO             AS codigoImobilizadoGenerico
      FROM ${nomeTabela}
      WHERE CD_USUARIO = ? AND CD_RESIDUO = ? AND DS_VINCULO IS NULL`,
      [this.userID, residuoID],
    );

    return response;
  }

  async pegarTotalLinhasResiduos() {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        COUNT(CD_RESIDUO) AS TOTAL
      FROM RESIDUOS
      WHERE CD_USUARIO = ? AND DS_VINCULO IS NULL`,
      [this.userID],
      'TOTAL',
    );

    return response;
  }

  async pegarTotalLinhasImobilizados(codigosEquipamentosJaAdicionados?: number[]) {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        COUNT(CD_IMOBILIZADO) AS TOTAL
      FROM IMOBILIZADOS
      WHERE CD_USUARIO = ? AND DS_VINCULO IS NULL
      ${
        !!codigosEquipamentosJaAdicionados?.length
          ? `AND CD_IMOBILIZADO NOT IN (${codigosEquipamentosJaAdicionados.join(',')})`
          : ''
      }
      `,
      [this.userID],
      'TOTAL',
    );

    return response;
  }

  async pegarTotalLinhasImobilizadosContratos(
    params: IPegarImobilizadosUseCaseParams,
    codigosEquipamentosJaAdicionados?: number[],
  ) {
    const response = await this._conn.queryFisrt<number>(
      `
      SELECT
        COUNT(*) AS TOTAL
      FROM IMOBILIZADOS_CONTRATOS
      WHERE (
        CD_IMOBILIZADO LIKE ?
        OR DS_IMOBILIZADO LIKE ?
      ) AND CD_USUARIO = ? AND (CD_CONTRATO = ? OR CD_CONTRATO = 0)
      AND (CAST(? AS INTEGER) = 0 OR CD_IMOBILIZADO NOT IN (
      	SELECT CD_MATERIAL FROM EQUIPAMENTOS_MOVIMENTACAO_PENDENTES_LIBERACAO MOVIMENTACAO WHERE MOVIMENTACAO.CD_USUARIO = ?
      ))
      AND (CAST(? AS INTEGER) = 0 OR CD_IMOBILIZADO_GENERICO IN (
      	SELECT CD_IMOBILIZADO_GENERICO FROM IMOBILIZADOS_GENERICOS_CONTRATOS  WHERE CD_USUARIO = ?
         --AND IMOBILIZADOS_CONTRATOS.CD_CONTRATO = 0
        AND IMOBILIZADOS_GENERICOS_CONTRATOS.CD_CONTRATO = ?
      ))
      ${
        !!codigosEquipamentosJaAdicionados?.length
          ? `AND CD_IMOBILIZADO NOT IN (${codigosEquipamentosJaAdicionados.join(',')})`
          : ''
      }
      `,
      [
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        params.pagination.search?.length > 0 ? `%${params.pagination.search}%` : '%',
        this.userID,
        params.contratoID,
        params.xSomenteEquipamentosLiberados ? 1 : 0,
        this.userID,
        params.somenteEquipamentosGenericos ? 1 : 0,
        this.userID,
        params.contratoID,
      ],
      'TOTAL',
    );

    return response;
  }

  async inserirResiduosContratoSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO RESIDUOS_CONTRATO (
        CD_USUARIO,
        CD_RESIDUO,
        X_EXIGE_INTEIRO,
        CD_CONTRATO,
        CD_SERVICO,
        CD_CLIENTE,
        DS_RESIDUO,
        DS_COR,
        DS_UNIDADE,
        NR_QUANTIDADE,
        DS_GRUPO,
        DS_OBSERVACAO,
        X_RESIDUO,
        X_NAO_CONFORME,
        X_EXECESSO,
        CD_IBAMA,
        CD_ESTADO_FISICO,
        CD_SUB_GRUPO,
        CD_ACONDICIONAMENTO,
        CD_UNIDADE,
        CD_FORMA_TRATAMENTO,
        NR_VALOR_UNITARIO,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO,
        NR_CUBAGEM,
        X_IMOBILIZADO_GENERICO,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirResiduosBaseSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO RESIDUOS_BASE (
        CD_USUARIO,
        CD_RESIDUO,
        X_EXIGE_INTEIRO,
        CD_CONTRATO,
        CD_SERVICO,
        CD_CLIENTE,
        DS_RESIDUO,
        DS_COR,
        DS_UNIDADE,
        NR_QUANTIDADE,
        DS_GRUPO,
        DS_OBSERVACAO,
        X_RESIDUO,
        X_NAO_CONFORME,
        X_EXECESSO,
        CD_IBAMA,
        CD_ESTADO_FISICO,
        CD_SUB_GRUPO,
        CD_ACONDICIONAMENTO,
        CD_UNIDADE,
        CD_FORMA_TRATAMENTO,
        NR_VALOR_UNITARIO,
        CD_IMOBILIZADO_GENERICO,
        NR_PESO_BRUTO,
        NR_CUBAGEM,
        X_IMOBILIZADO_GENERICO,
        X_COLETAR_SOMENTE_COM_EQUIPAMENTO
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async inserirContainersSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO CONTAINERS (
        CD_USUARIO,
        CD_ORDEM_SERVICO,
        CD_CLIENTE,
        CD_CONTAINER,
        CD_MOVIMENTACAO,
        DS_CONTAINER,
        DT_COLOCACAO,
        DT_RETIRADA
      ) VALUES ${sqlParams}`,
      [],
    );

    return response;
  }

  async verificarReisiduoGenerico(codigoVinculo: string | number) {
    const response = await this._conn.queryFisrt<number>(
      `SELECT
        COUNT(ID) AS TOTAL
      FROM RESIDUOS
      WHERE CD_USUARIO = ? AND DS_VINCULO = ?`,
      [this.userID, codigoVinculo],
      'TOTAL',
    );

    return response;
  }
}
