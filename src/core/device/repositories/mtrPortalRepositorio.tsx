import { AsyncSQLiteConnection } from "vision-common";
import { IGeradorAuxiliar, IResiduoAuxiliar, ITransportadorAuxiliar } from "../../domain/entities/portalMtr/mtrAuxiliar";
import { IDeviceMtrPortalRepositorio } from "../../domain/repositories/device/mtrPortalRepositorio";

export default class DeviceMtrPortalRepositorio implements IDeviceMtrPortalRepositorio {

  constructor(private readonly userID: number, private readonly _conn: AsyncSQLiteConnection) { }

  async criarTabelaConfiguracaoTransportador() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS CONFIGURACAO_TRANSPORTADOR_PORTAL (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_TRANSPORTADOR              INTERGER,
        CD_ESTADO                     INTEGER,
        CD_UNIDADE                    INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'CONFIGURACAO_TRANSPORTADOR_PORTAL'
    );

    return response;
  }

  async criarTabelaConfiguracaoDestinador() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS CONFIGURACAO_DESTINADOR_MTR_SINIR (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_DESTINADOR                 INTEGER,
        CD_ESTADO                     INTEGER,
        CD_UNIDADE                    INTEGER,
        DS_RESPONSAVEL                TEXT,
        DS_CARGO_RESPONSAVEL          TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'CONFIGURACAO_DESTINADOR_MTR_SINIR'
    );

    return response;
  }

  async criarTabelaDadosDestinador() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS DADOS_DESTINADOR_MTR_SINIR (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_DESTINADOR                 INTEGER,
        DS_DESTINADOR                 TEXT,
        NR_CPFCNPJ                    TEXT,
        DS_RUA                        TEXT,
        DS_BAIRRO                     TEXT,
        NR_NUMERO                     INTEGER,
        DS_MUNICIPIO                  TEXT,
        DS_ESTADO                     TEXT,
        DS_TELEFONE                   TEXT,
        DS_CELULAR                    TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'DADOS_DESTINADOR_MTR_SINIR'
    );

    return response;
  }

  async criarTabelaDadosGeradorMtrSinir() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS DADOS_GERADOR_MTR_SINIR (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_GERADOR                    INTERGER,
        CD_ESTADO                     INTEGER,
        CD_UNIDADE                    INTEGER,
        NR_CPJCNPJ                    TEXT,
        CD_OBRA                       INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'DADOS_GERADOR_MTR_SINIR'
    );

    return response;
  }

  async criarTabelaDadosTransportadorMtrSinir() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS DADOS_TRANSPORTADOR_MTR_SINIR (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_TRANSPORTADOR              INTEGER,
        DS_RAZAO_SOCIAL               TEXT,
        NR_CPFCNPJ                    TEXT,
        NR_NUMERO                     TEXT,
        DS_BAIRRO                     TEXT,
        DS_RUA                        TEXT,
        DS_CIDADE                     TEXT,
        DS_UF                         TEXT,
        DS_TELEFONE                   TEXT,
        DS_CELULAR                    TEXT,
        DS_MOTORISTA                  TEXT,
        DS_CARGO_MOTORISTA            TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'DADOS_TRANSPORTADOR_MTR_SINIR'
    );

    return response;
  }

  async criarTabelaEstadosFisicosPortal() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS ESTADOS_FISICOS_PORTAL (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_ESTADO_FISICO              INTEGER,
        CD_ESTADO                     INTEGER,
        CD_ESTADO_FISICO_SITE         INTEGER,
        DS_ESTADO_FISICO_SITE         TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'ESTADOS_FISICOS_PORTAL'
    );

    return response;
  }

  async criarTabelaFormasAcondicionamentoPortal() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS FORMAS_ACONDICIONAMENTO_PORTAL (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_ACONDICIONAMENTO_MTR       INTEGER,
        CD_ESTADO                     INTEGER,
        CD_ACONDICIONAMENTO_SITE      INTEGER,
        DS_ACONDICIONAMENTO_SITE      TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'FORMAS_ACONDICIONAMENTO_PORTAL'
    );

    return response;
  }

  async criarTabelaFormasTratamentoPortal() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS FORMAS_TRATAMENTO_PORTAL (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_FORMA_TRATAMENTO           INTEGER,
        CD_ESTADO                     INTEGER,
        CD_FORMA_TRATAMENTO_SITE      INTEGER,
        DS_FORMA_TRATAMENTO_SITE      TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'FORMAS_TRATAMENTO_PORTAL'
    );

    return response;
  }

  async criarTabelaResiduosPortal() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS RESIDUOS_PORTAL (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_ESTADO                     INTEGER,
        CD_RESIDUO_SITE               TEXT,
        DS_RESIDUO_SITE               TEXT,
        CD_MATERIAL                   INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'RESIDUOS_PORTAL'
    );

    return response;
  }

  async criarTabelaSubGruposPortal() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS SUB_GRUPO_PORTAL (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_SUB_GRUPO                  INTEGER,
        CD_ESTADO                     INTEGER,
        CD_CLASSE_SITE                INTEGER,
        DS_CLASSE_SITE                TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'SUB_GRUPO_PORTAL'
    );

    return response;
  }

  async criarTabelaUnidadesPortal() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS UNIDADE_PORTAL (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_UNIDADE                    INTEGER,
        CD_UNIDADE_SITE               INTEGER,
        DS_UNIDADE_SITE               TEXT,
        CD_ESTADO                     INTEGER,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'UNIDADE_PORTAL'
    );

    return response;
  }

  async criarTabelaLogosEmpresas() {
    const response = await this._conn.create(
      `CREATE TABLE IF NOT EXISTS LOGO_EMPRESA (
        ID                            INTEGER PRIMARY KEY AUTOINCREMENT,
        CD_USUARIO                    INTEGER,
        CD_EMPRESA                    INTEGER,
        DS_LOGO                       TEXT,
        DT_CADASTRO                   DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')),
        DT_ATUALIZACAO                DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))`,
      'LOGO_EMPRESA'
    );

    return response;
  }

  async pegarDadosGeradorMtr(params: { codigoOS: number, clienteID: number, estadoID: number, obraID?: number }) {
    const response = await this._conn.queryFisrt<IGeradorAuxiliar>(
      `SELECT
        CD_UNIDADE 																			                          AS codigoUnidade,
        CLIENTE.DS_RAZAO_SOCIAL 															                    AS nomeCliente,
        IFNULL(GERADOR.NR_CPJCNPJ, CLIENTE.NR_CPFCNPJ) 										        AS cpfcnpj,
        IFNULL(ENDERECO_PENDENTE.DS_RUA, ENDERECO_COLETADA.DS_RUA) 							  AS rua,
        IFNULL(ENDERECO_PENDENTE.DS_BAIRRO, ENDERECO_COLETADA.DS_BAIRRO) 					AS bairro,
        IFNULL(ENDERECO_PENDENTE.NR_NUMERO, ENDERECO_COLETADA.NR_NUMERO) 					AS numero,
        IFNULL(ENDERECO_PENDENTE.DS_CIDADE, ENDERECO_COLETADA.DS_CIDADE) 					AS municipio,
        IFNULL(ENDERECO_PENDENTE.DS_UF, ENDERECO_COLETADA.DS_UF) 							    AS estado,
        CLIENTE.DS_TELEFONE																	                      AS telefone,
        CLIENTE.DS_CELULAR																	                      AS celular,
        IFNULL(ORDEM_PENDENTE.DS_RESPONSAVEL, ORDEM_COLETADA.DS_RESPONSAVEL) 			AS nomeResponsavel,
        IFNULL(ORDEM_PENDENTE.DS_FUNCAO_RESPONSAVEL, ORDEM_COLETADA.DS_FUNCAO_RESPONSAVEL) 	AS funcaoResponsavel,
        IFNULL(ORDEM_PENDENTE.DT_ORDEM, ORDEM_COLETADA.DT_ORDEM) 							AS dataColeta,
        IFNULL(ORDEM_PENDENTE.DS_ASSINATURA_BASE64, ORDEM_COLETADA.DS_ASSINATURA_BASE64) 	AS assinaturaBase64
     FROM DADOS_GERADOR_MTR_SINIR GERADOR
       LEFT JOIN ORDEM_SERVICO_AGENDADAS_PENDENTES ORDEM_PENDENTE ON ORDEM_PENDENTE.CD_ORDEM_SERVICO = ?
          LEFT JOIN ENDERECOS ENDERECO_PENDENTE ON ENDERECO_PENDENTE.DS_VINCULO = ORDEM_PENDENTE.DS_VINCULO
        LEFT JOIN ORDEM_SERVICO_COLETADAS ORDEM_COLETADA ON ORDEM_COLETADA.CD_ORDEM_SERVICO = ?
          LEFT JOIN ENDERECOS ENDERECO_COLETADA ON ENDERECO_COLETADA.DS_VINCULO = ORDEM_COLETADA.DS_VINCULO
        JOIN CLIENTES CLIENTE ON CLIENTE.CD_CLIENTE = GERADOR.CD_GERADOR
     WHERE CLIENTE.CD_CLIENTE = ? AND GERADOR.CD_ESTADO = ? AND (IFNULL(GERADOR.CD_OBRA, 0) = ? OR IFNULL(GERADOR.CD_OBRA, 0) = 0) AND GERADOR.CD_USUARIO = ?
     ORDER BY IFNULL(GERADOR.CD_OBRA, 0) DESC`,
      [
        params.codigoOS,
        params.codigoOS,
        params.clienteID,
        params.estadoID,
        params.obraID,
        this.userID
      ],
      ''
    );

    return response;
  }

  async pegarDadosGeradorNovaColetaMtr(params: { codigoVinculo: number | string, clienteID: number, estadoID: number, obraID?: number }) {
    const response = await this._conn.queryFisrt<IGeradorAuxiliar>(
      `SELECT
      CD_UNIDADE 																			                          AS codigoUnidade,
      CLIENTE.DS_RAZAO_SOCIAL 															                    AS nomeCliente,
      IFNULL(GERADOR.NR_CPJCNPJ, CLIENTE.NR_CPFCNPJ) 										        AS cpfcnpj,
      IFNULL(ENDERECO.DS_RUA, ENDERECO_COLETADA.DS_RUA) 							  AS rua,
      IFNULL(ENDERECO.DS_BAIRRO, ENDERECO_COLETADA.DS_BAIRRO) 					AS bairro,
      IFNULL(ENDERECO.NR_NUMERO, ENDERECO_COLETADA.NR_NUMERO) 					AS numero,
      IFNULL(ENDERECO.DS_CIDADE, ENDERECO_COLETADA.DS_CIDADE) 					AS municipio,
      IFNULL(ENDERECO.DS_UF, ENDERECO_COLETADA.DS_UF) 							    AS estado,
      CLIENTE.DS_TELEFONE																	                      AS telefone,
      CLIENTE.DS_CELULAR																	                      AS celular,
      IFNULL(ORDEM.DS_RESPONSAVEL, ORDEM_COLETADA.DS_RESPONSAVEL) 			AS nomeResponsavel,
      IFNULL(ORDEM.DS_FUNCAO_RESPONSAVEL, ORDEM_COLETADA.DS_FUNCAO_RESPONSAVEL) 	AS funcaoResponsavel,
      IFNULL(ORDEM.DT_ORDEM, ORDEM_COLETADA.DT_ORDEM) 							AS dataColeta,
      IFNULL(ORDEM.DS_ASSINATURA_BASE64, ORDEM_COLETADA.DS_ASSINATURA_BASE64) 	AS assinaturaBase64
     FROM DADOS_GERADOR_MTR_SINIR GERADOR
       LEFT JOIN NOVAS_COLETAS ORDEM ON ORDEM.DS_VINCULO = ?
          LEFT JOIN ENDERECOS ENDERECO ON ENDERECO.DS_VINCULO = ORDEM.DS_VINCULO
       LEFT JOIN ORDEM_SERVICO_COLETADAS ORDEM_COLETADA ON ORDEM_COLETADA.DS_VINCULO = ?
          LEFT JOIN ENDERECOS ENDERECO_COLETADA ON ENDERECO_COLETADA.DS_VINCULO = ORDEM_COLETADA.DS_VINCULO
        JOIN CLIENTES CLIENTE ON CLIENTE.CD_CLIENTE = GERADOR.CD_GERADOR
     WHERE CLIENTE.CD_CLIENTE = ? AND GERADOR.CD_ESTADO = ? AND (IFNULL(GERADOR.CD_OBRA, 0) = ? OR IFNULL(GERADOR.CD_OBRA, 0) = 0) AND GERADOR.CD_USUARIO = ?
     ORDER BY IFNULL(GERADOR.CD_OBRA, 0) DESC`,
      [
        params.codigoVinculo,
        params.codigoVinculo,
        params.clienteID,
        params.estadoID,
        params.obraID,
        this.userID
      ],
      ''
    );

    return response;
  }

  async pegarDadosTransportador(estadoID: number) {
    const response = await this._conn.queryFisrt<ITransportadorAuxiliar>(
      `SELECT
        TRANSPORTADOR.DS_RAZAO_SOCIAL			AS nomeTransportador,
        TRANSPORTADOR.NR_CPFCNPJ				AS cpfcnpj,
        TRANSPORTADOR.DS_RUA					AS rua,
        TRANSPORTADOR.DS_BAIRRO 				AS bairro,
        TRANSPORTADOR.NR_NUMERO					AS numero,
        TRANSPORTADOR.DS_CIDADE					AS municipio,
        TRANSPORTADOR.DS_UF						AS estado,
        TRANSPORTADOR.DS_TELEFONE				AS telefone,
        TRANSPORTADOR.DS_CELULAR				AS celular,
        TRANSPORTADOR.DS_MOTORISTA				AS motorista,
        CONFIGURACAO.CD_UNIDADE					AS codigoUnidade
    FROM DADOS_TRANSPORTADOR_MTR_SINIR TRANSPORTADOR
      JOIN CONFIGURACAO_TRANSPORTADOR_PORTAL CONFIGURACAO ON CONFIGURACAO.CD_TRANSPORTADOR = TRANSPORTADOR.CD_TRANSPORTADOR
    WHERE CONFIGURACAO.CD_ESTADO = ? AND TRANSPORTADOR.CD_USUARIO = ? `,
      [
        estadoID,
        this.userID
      ],
      ''
    );

    return response;
  }

  async pegarDadosDestinador(destinadorID: number, estadoID: number) {
    const response = await this._conn.queryFisrt<ITransportadorAuxiliar>(
      `SELECT
        CONFIGURACAO_DESTINADOR.CD_UNIDADE						AS codigoUnidade,
        DESTINADOR.DS_DESTINADOR								      AS NomeDestinador,
        DESTINADOR.NR_CPFCNPJ									        AS cpfcnpj,
        DESTINADOR.NR_NUMERO									        AS numero,
        DESTINADOR.DS_RUA										          AS rua,
        DESTINADOR.DS_BAIRRO									        AS bairro,
        DESTINADOR.DS_MUNICIPIO									      AS municipio,
        DESTINADOR.DS_ESTADO									        AS estado,
        DESTINADOR.DS_TELEFONE									      AS telefone,
        DESTINADOR.DS_CELULAR									        AS celular,
        CONFIGURACAO_DESTINADOR.DS_RESPONSAVEL				AS responsavel,
        CONFIGURACAO_DESTINADOR.DS_CARGO_RESPONSAVEL	AS cargoResponsavel
    FROM DADOS_DESTINADOR_MTR_SINIR DESTINADOR
      JOIN CONFIGURACAO_DESTINADOR_MTR_SINIR CONFIGURACAO_DESTINADOR ON CONFIGURACAO_DESTINADOR.CD_DESTINADOR = DESTINADOR.CD_DESTINADOR
    WHERE DESTINADOR.CD_DESTINADOR = ? AND CONFIGURACAO_DESTINADOR.CD_ESTADO = ? AND DESTINADOR.CD_USUARIO = ? `,
      [
        destinadorID,
        estadoID,
        this.userID
      ],
      ''
    );

    return response;
  }

  async pegarLogoEmpresa(empresaID: number) {
    const response = await this._conn.queryFisrt<string>(
      'SELECT DS_LOGO FROM LOGO_EMPRESA WHERE CD_EMPRESA = ? AND CD_USUARIO = ?',
      [
        empresaID,
        this.userID,
      ],
      'DS_LOGO'
    );

    return response;
  }

  async pegarResiduosPortal(codigoVinculo: number | string, estadoID: number) {
    const response = await this._conn.query<IResiduoAuxiliar>(
      `SELECT
          PORTAL.CD_RESIDUO_SITE						              AS codigoResiduoSite,
          PORTAL.DS_RESIDUO_SITE						              AS descricaoResiduoSite,
          ESTADO_FISICO.DS_ESTADO_FISICO_SITE			        AS estadoFisicoSite,
          SUBGRUPO.DS_CLASSE_SITE						              AS classeSite,
          ACONDICIONAMENTO.DS_ACONDICIONAMENTO_SITE	      AS acondicionamento,
          RESIDUO.NR_QUANTIDADE						                AS quantidade,
          UNIDADE.DS_UNIDADE_SITE						              AS unidade,
          TRATAMENTO.DS_FORMA_TRATAMENTO_SITE			        AS tecnologia
      FROM RESIDUOS RESIDUO
        JOIN RESIDUOS_PORTAL PORTAL ON PORTAL.CD_MATERIAL = RESIDUO.CD_RESIDUO AND RESIDUO.CD_USUARIO = PORTAL.CD_USUARIO
        JOIN ESTADOS_FISICOS_PORTAL ESTADO_FISICO ON RESIDUO.CD_ESTADO_FISICO = ESTADO_FISICO.CD_ESTADO_FISICO AND RESIDUO.CD_USUARIO = ESTADO_FISICO.CD_USUARIO
        JOIN SUB_GRUPO_PORTAL SUBGRUPO ON RESIDUO.CD_SUB_GRUPO = SUBGRUPO.CD_SUB_GRUPO AND RESIDUO.CD_USUARIO = SUBGRUPO.CD_USUARIO
        JOIN FORMAS_ACONDICIONAMENTO_PORTAL ACONDICIONAMENTO ON RESIDUO.CD_ACONDICIONAMENTO = ACONDICIONAMENTO.CD_ACONDICIONAMENTO_MTR AND RESIDUO.CD_USUARIO = ACONDICIONAMENTO.CD_USUARIO
        JOIN UNIDADE_PORTAL UNIDADE ON RESIDUO.CD_UNIDADE = UNIDADE.CD_UNIDADE AND RESIDUO.CD_USUARIO = UNIDADE.CD_USUARIO
        JOIN FORMAS_TRATAMENTO_PORTAL TRATAMENTO ON RESIDUO.CD_FORMA_TRATAMENTO = TRATAMENTO.CD_FORMA_TRATAMENTO AND RESIDUO.CD_USUARIO = TRATAMENTO.CD_USUARIO
      WHERE DS_VINCULO = ?
        AND PORTAL.CD_ESTADO = ?
          AND ESTADO_FISICO.CD_ESTADO = ?
          AND SUBGRUPO.CD_ESTADO = ?
          AND ACONDICIONAMENTO.CD_ESTADO = ?
          AND UNIDADE.CD_ESTADO = ?
          AND TRATAMENTO.CD_ESTADO = ?
        AND RESIDUO.CD_USUARIO = ? `,
      [
        codigoVinculo,
        estadoID,
        estadoID,
        estadoID,
        estadoID,
        estadoID,
        estadoID,
        this.userID
      ]
    );

    return response;
  }

  async inserirUnidadePortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO UNIDADE_PORTAL (
        CD_USUARIO,
        CD_UNIDADE,
        CD_UNIDADE_SITE,
        DS_UNIDADE_SITE,
        CD_ESTADO
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirSubGrupoPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO SUB_GRUPO_PORTAL (
        CD_USUARIO,
        CD_SUB_GRUPO,
        CD_ESTADO,
        CD_CLASSE_SITE,
        DS_CLASSE_SITE
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirResiduosPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO RESIDUOS_PORTAL (
        CD_USUARIO,
        CD_ESTADO,
        CD_RESIDUO_SITE,
        DS_RESIDUO_SITE,
        CD_MATERIAL
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirLogosEmpresasPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO LOGO_EMPRESA (
        CD_USUARIO,
        CD_EMPRESA,
        DS_LOGO
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirFormasTratamentoPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO FORMAS_TRATAMENTO_PORTAL (
        CD_USUARIO,
        CD_FORMA_TRATAMENTO,
        CD_ESTADO,
        CD_FORMA_TRATAMENTO_SITE,
        DS_FORMA_TRATAMENTO_SITE
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirAcondicionamentoPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO FORMAS_ACONDICIONAMENTO_PORTAL (
        CD_USUARIO,
        CD_ACONDICIONAMENTO_MTR,
        CD_ESTADO,
        CD_ACONDICIONAMENTO_SITE,
        DS_ACONDICIONAMENTO_SITE
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirEstadosFisicosPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO ESTADOS_FISICOS_PORTAL (
          CD_USUARIO,
          CD_ESTADO_FISICO,
          CD_ESTADO,
          CD_ESTADO_FISICO_SITE,
          DS_ESTADO_FISICO_SITE
        ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirDadosTransportadorPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO DADOS_TRANSPORTADOR_MTR_SINIR (
        CD_USUARIO,
        DS_RAZAO_SOCIAL,
        NR_CPFCNPJ,
        NR_NUMERO,
        DS_BAIRRO,
        DS_RUA,
        DS_CIDADE,
        DS_UF,
        DS_TELEFONE,
        DS_CELULAR,
        DS_MOTORISTA,
        DS_CARGO_MOTORISTA,
        CD_TRANSPORTADOR
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirDadosDestinadorPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO DADOS_DESTINADOR_MTR_SINIR (
        CD_USUARIO,
        CD_DESTINADOR,
        DS_DESTINADOR,
        NR_CPFCNPJ,
        DS_RUA,
        DS_BAIRRO,
        NR_NUMERO,
        DS_MUNICIPIO,
        DS_ESTADO,
        DS_TELEFONE,
        DS_CELULAR
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirGeradorPortalSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO DADOS_GERADOR_MTR_SINIR (
        CD_USUARIO,
        CD_GERADOR,
        CD_ESTADO,
        CD_UNIDADE,
        NR_CPJCNPJ,
        CD_OBRA
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirConfiguracoesTransportadorSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO CONFIGURACAO_TRANSPORTADOR_PORTAL (
        CD_USUARIO,
        CD_TRANSPORTADOR,
        CD_ESTADO,
        CD_UNIDADE
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async inserirConfiguracoesDestinadorSincronizacao(sqlParams: string) {
    const response = await this._conn.query<void>(
      `INSERT INTO CONFIGURACAO_DESTINADOR_MTR_SINIR (
        CD_USUARIO,
        CD_DESTINADOR,
        CD_ESTADO,
        CD_UNIDADE,
        DS_RESPONSAVEL,
        DS_CARGO_RESPONSAVEL
      ) VALUES ${sqlParams}`,
      []
    );

    return response;
  }

  async deletarDadosPortal() {
    const response = await this._conn.multipleQuerys(
      [
        'DELETE FROM CONFIGURACAO_TRANSPORTADOR_PORTAL WHERE CD_USUARIO = ?',
        'DELETE FROM DADOS_GERADOR_MTR_SINIR WHERE CD_USUARIO = ?',
        'DELETE FROM DADOS_TRANSPORTADOR_MTR_SINIR WHERE CD_USUARIO = ?',
        'DELETE FROM DADOS_DESTINADOR_MTR_SINIR WHERE CD_USUARIO = ?',
        'DELETE FROM ESTADOS_FISICOS_PORTAL WHERE CD_USUARIO = ?',
        'DELETE FROM FORMAS_ACONDICIONAMENTO_PORTAL WHERE CD_USUARIO = ?',
        'DELETE FROM FORMAS_TRATAMENTO_PORTAL WHERE CD_USUARIO = ?',
        'DELETE FROM RESIDUOS_PORTAL WHERE CD_USUARIO = ?',
        'DELETE FROM SUB_GRUPO_PORTAL WHERE CD_USUARIO = ?',
        'DELETE FROM UNIDADE_PORTAL WHERE CD_USUARIO = ?',
        'DELETE FROM LOGO_EMPRESA WHERE CD_USUARIO = ?',
      ],
      [
        [this.userID], [this.userID], [this.userID], [this.userID],
        [this.userID], [this.userID], [this.userID], [this.userID],
        [this.userID], [this.userID], [this.userID]
      ]
    );

    return response;
  }
}