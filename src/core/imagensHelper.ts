import { getAxiosConnection, getConnection } from "vision-common";
import database from "./database";
import DeviceImagemRepositorio from "./device/repositories/imagemRepositorio";
import { addEventListener } from "@react-native-community/netinfo";
import OrdemServicoRepositorio from "./data/repositories/ordemServicoRepositorio";
import axiosClient from "./axios";

export type ImagemPendente = { nome: string; base64: string };

class ImagensHelper {
    private connection = getConnection(database);
    private imgRepo = new DeviceImagemRepositorio(0, this.connection);
    private ordemServicoRepo = new OrdemServicoRepositorio(getAxiosConnection(axiosClient));
    private imagensPendentes: ImagemPendente[] = [];
    private isRunning: boolean = false;
    private isOnline: boolean = false;
    private isFetching: number = 0;
    private timeout: number = 0;

    constructor() {
        this.imgRepo.pegarImagensPendentes().then(imagens => {
            imagens.forEach(({nome}) => {
                this.isFetching ++;
                this.imgRepo.imagemPendente(nome).then(imagem => {
                    if (!imagem) return;
                    this.imagensPendentes.push(imagem as ImagemPendente);
                }).finally(() => {
                    this.isFetching --;
                    this.next();
                });
            });

        });

        addEventListener(async net => {
            this.isOnline = !!net.isConnected
            this.next();
        });

        setInterval(() => {
            if (this.timeout ) this.timeout--
            else this.next();
        },1000)
    }

    public init() {
        this.next();
    }

    public addToQueue = async (imagem: ImagemPendente) => {
        this.timeout = 5;
        this.imagensPendentes.push(imagem);
        await this.imgRepo.imagemPendente(imagem.nome, imagem.base64);
    }

    private next = () => {
        if (!this.imagensPendentes.length || this.isRunning || !this.isOnline || this.isFetching || this.timeout) return;
        this.isRunning = true;
        this.ordemServicoRepo.enviarImagemPendente(this.imagensPendentes[0])
        .then(async () => {
            await this.imgRepo.removerImagemPendente(this.imagensPendentes[0].nome);
            this.imagensPendentes.shift();
        })
        .catch(console.log)
        .finally(() => {
            this.isRunning = false;
            this.next();
        });
    }

}

export const imagensHelper = new ImagensHelper();