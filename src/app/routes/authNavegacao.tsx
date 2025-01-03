import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuestionarioRotas } from 'vision-questionario';

// Telas
import TelaHome from '../paginas/home';
import TelaColetasAgendadas from '../paginas/coletasAgendadas';
import TelaClientes from '../paginas/cliente/listaClientes';
import TelaRascunhos from '../paginas/rascunhos';
import TelaHistoricoColetas from '../paginas/historicoColetas';
import TelaNovaColeta from '../paginas/coleta/novaColeta';
import TelaConfiguracoes from '../paginas/configuracoes';
import TelaFiltrarColetas from '../paginas/filtrarColetas';
import TelaDetalhesCliente from '../paginas/cliente/clienteDetalhes';
import TelaClienteContainers from '../paginas/cliente/listaClienteContainers';
import TelaImobilizados from '../paginas/imobilizados';
import TelaObrasNovaColeta from '../paginas/cliente/obrasNovaColeta';
import TelaColetaDetalhes from '../paginas/coleta/coletaDetalhes';
import TelaAlterarSenha from '../paginas/alterarSenha';
import TelaConfiguracaoIncial from '../paginas/configuracaoInicial';
import TelaAlterarPlaca from '../paginas/alterarPlaca';
import TelaBackup from '../paginas/backup';
import TelaAdicionarRegioes from '../paginas/adicionarRegioes';
import TelaRegioes from '../paginas/regioes';
import TelaMotivos from '../paginas/motivos';
import TelaColetaResiduos from '../paginas/coleta/coletaResiduos';
import TelaResiduo from '../paginas/residuo';
import TelaListaResiduos from '../paginas/listaResiduos';
import TelaColetaEquipamentos from '../paginas/coleta/coletaEquipamentos';
import TelaListaEquipamentos from '../paginas/listaEquipamentos';
import TelaColetaResponsavel from '../paginas/coleta/coletaResponsavel';
import Assinatura from '../paginas/components/assinatura';
import TelaColetaDetalhesLocal from '../paginas/coletaDevice/coletaDetalhesLocal';
import TelaListaResiduosLocal from '../paginas/coletaDevice/listaResiduosLocal';
import TelaDetalhesResiduoLocal from '../paginas/coletaDevice/detalhesResiduoLocal';
import TelaListaEquipamentosLocal from '../paginas/coletaDevice/listaEquipamentosLocal';
import TelaDetalhesEquipamentoLocal from '../paginas/coletaDevice/detalhesEquipamentoLocal';
import TelaResumoColeta from '../paginas/coleta/resumoColeta';
import TelaChecklist from '../paginas/checklist';
import TelaAdicionarMtr from '../paginas/adicionarMTR';
import TelaEstadosMTR from '../paginas/listarEstadosMTR';
import TelaRascunhoDetalhes from '../paginas/rascunhoDetalhes';
import TelaRecusaAssinatura from '../paginas/recusaAssinatura';
import { AuthNavigatorParamsList, AuthRoutes, CommonRoutes } from './routes';
import TelaListaObras from '../paginas/cliente/listaObras';
import TelaImpressoras from '../paginas/impressoras';
import Camera from '../paginas/components/camera';
import Scanner from '../paginas/components/scanner';
import TelaRelatorio from '../paginas/relatorio';
import TelaMeusDados from '../paginas/meusDados';
import TelaListaBalancasTCP from '../paginas/listarBalancasTCP';
import { IScreenProps } from 'vision-common';
import { BackHandler } from 'react-native';
import { IScreenAuth } from './types';
import TelaListaParadas from '../paginas/paradas/listaParadas';
import TelaAdicionarParadas from '../paginas/paradas/adicionarParadas';
import TelaAdicionarMotivoParadas from '../paginas/paradas/adicionarMotivoParadas';


const AppStack = createStackNavigator<AuthNavigatorParamsList>();

const ScreenWrapper = ({ navigation, route, component }: any & { component: React.FC<IScreenProps<AuthNavigatorParamsList, any>> }) => {
  React.useEffect(() => {
    const back = () => {
      navigation.goBack()
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', back);
    return () => BackHandler.removeEventListener('hardwareBackPress', back);
  }, []);
  const Component = component;
  return <Component navigation={navigation} route={route} />
};

const components: Record<string, IScreenAuth<''>> = {
  TelaHome: (props: any) => ScreenWrapper({ ...props, component: TelaHome }),
  TelaMeusDados: (props: any) => ScreenWrapper({ ...props, component: TelaMeusDados }),
  TelaEstadosMTR: (props: any) => ScreenWrapper({ ...props, component: TelaEstadosMTR }),
  TelaAdicionarMtr: (props: any) => ScreenWrapper({ ...props, component: TelaAdicionarMtr }),
  QuestionarioRotas: (props: any) => ScreenWrapper({ ...props, component: QuestionarioRotas }),
  TelaAdicionarRegioes: (props: any) => ScreenWrapper({ ...props, component: TelaAdicionarRegioes }),
  TelaRegioes: (props: any) => ScreenWrapper({ ...props, component: TelaRegioes }),
  TelaImpressoras: (props: any) => ScreenWrapper({ ...props, component: TelaImpressoras }),
  TelaColetasAgendadas: (props: any) => ScreenWrapper({ ...props, component: TelaColetasAgendadas }),
  TelaColetaResponsavel: (props: any) => ScreenWrapper({ ...props, component: TelaColetaResponsavel }),
  TelaColetaDetalhes: (props: any) => ScreenWrapper({ ...props, component: TelaColetaDetalhes }),
  TelaColetaDetalhesLocal: (props: any) => ScreenWrapper({ ...props, component: TelaColetaDetalhesLocal }),
  TelaDetalhesResiduoLocal: (props: any) => ScreenWrapper({ ...props, component: TelaDetalhesResiduoLocal }),
  TelaDetalhesEquipamentoLocal: (props: any) => ScreenWrapper({ ...props, component: TelaDetalhesEquipamentoLocal }),
  TelaListaResiduosLocal: (props: any) => ScreenWrapper({ ...props, component: TelaListaResiduosLocal }),
  TelaListaEquipamentosLocal: (props: any) => ScreenWrapper({ ...props, component: TelaListaEquipamentosLocal }),
  TelaResumoColeta: (props: any) => ScreenWrapper({ ...props, component: TelaResumoColeta }),
  TelaChecklist: (props: any) => ScreenWrapper({ ...props, component: TelaChecklist }),
  TelaColetaResiduos: (props: any) => ScreenWrapper({ ...props, component: TelaColetaResiduos }),
  TelaColetaEquipamentos: (props: any) => ScreenWrapper({ ...props, component: TelaColetaEquipamentos }),
  TelaResiduo: (props: any) => ScreenWrapper({ ...props, component: TelaResiduo }),
  TelaListaResiduos: (props: any) => ScreenWrapper({ ...props, component: TelaListaResiduos }),
  TelaListaBalancasTCP: (props: any) => ScreenWrapper({ ...props, component: TelaListaBalancasTCP }),
  TelaListaObras: (props: any) => ScreenWrapper({ ...props, component: TelaListaObras }),
  TelaListaEquipamentos: (props: any) => ScreenWrapper({ ...props, component: TelaListaEquipamentos }),
  TelaImobilizados: (props: any) => ScreenWrapper({ ...props, component: TelaImobilizados }),
  TelaFiltrarColetas: (props: any) => ScreenWrapper({ ...props, component: TelaFiltrarColetas }),
  TelaClientes: (props: any) => ScreenWrapper({ ...props, component: TelaClientes }),
  TelaMotivos: (props: any) => ScreenWrapper({ ...props, component: TelaMotivos }),
  TelaClienteContainers: (props: any) => ScreenWrapper({ ...props, component: TelaClienteContainers }),
  TelaDetalhesCliente: (props: any) => ScreenWrapper({ ...props, component: TelaDetalhesCliente }),
  TelaRascunhos: (props: any) => ScreenWrapper({ ...props, component: TelaRascunhos }),
  TelaRascunhoDetalhes: (props: any) => ScreenWrapper({ ...props, component: TelaRascunhoDetalhes }),
  TelaHistoricoColetas: (props: any) => ScreenWrapper({ ...props, component: TelaHistoricoColetas }),
  TelaNovaColeta: (props: any) => ScreenWrapper({ ...props, component: TelaNovaColeta }),
  TelaObrasNovaColeta: (props: any) => ScreenWrapper({ ...props, component: TelaObrasNovaColeta }),
  TelaConfiguracoes: (props: any) => ScreenWrapper({ ...props, component: TelaConfiguracoes }),
  TelaAlterarSenha: (props: any) => ScreenWrapper({ ...props, component: TelaAlterarSenha }),
  TelaConfiguracaoIncial: (props: any) => ScreenWrapper({ ...props, component: TelaConfiguracaoIncial }),
  TelaAlterarPlaca: (props: any) => ScreenWrapper({ ...props, component: TelaAlterarPlaca }),
  TelaBackup: (props: any) => ScreenWrapper({ ...props, component: TelaBackup }),
  Camera: (props: any) => ScreenWrapper({ ...props, component: Camera }),
  Scanner: (props: any) => ScreenWrapper({ ...props, component: Scanner }),
  Assinatura: (props: any) => ScreenWrapper({ ...props, component: Assinatura }),
  TelaRecusaAssinatura: (props: any) => ScreenWrapper({ ...props, component: TelaRecusaAssinatura }),
  TelaRelatorio: (props: any) => ScreenWrapper({ ...props, component: TelaRelatorio }),

  // paradas
  TelaListaParadas: (props: any) => ScreenWrapper({ ...props, component: TelaListaParadas }),
  TelaAdicionarParadas: (props: any) => ScreenWrapper({ ...props, component: TelaAdicionarParadas }),
  TelaAdicionarMotivoParadas: (props: any) => ScreenWrapper({ ...props, component: TelaAdicionarMotivoParadas }),

}

const AuthRotas = () => (
  <AppStack.Navigator
    initialRouteName={AuthRoutes.Home}
    headerMode="none"
    mode="modal"
    screenOptions={{
      gestureEnabled: false,
      cardStyle: { backgroundColor: 'transparent' },
      cardStyleInterpolator: ({ current: { progress } }) => ({
        cardStyle: {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          })
        },
        overlayStyle: {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
            extrapolate: 'clamp'
          })
        }
      })
    }}
  >
    <AppStack.Screen name={AuthRoutes.Home} component={components.TelaHome} />
    <AppStack.Screen name={AuthRoutes.MeusDados} component={components.TelaMeusDados} initialParams={{
      photo: {}
    }} />
    <AppStack.Screen name={AuthRoutes.ListaEstadosMTR} component={components.TelaEstadosMTR} initialParams={{
      mtrs: [],
      screen: '',
    }} />
    <AppStack.Screen name={AuthRoutes.AdicionarMTR} component={components.TelaAdicionarMtr} initialParams={{
      hasSinir: false,
      estado: {},
      screen: '',
      scanData: '',
    }} />
    <AppStack.Screen name={AuthRoutes.QuestionarioRotas} component={components.QuestionarioRotas} />
    <AppStack.Screen name={AuthRoutes.AdicionarRegioes} component={components.TelaAdicionarRegioes} initialParams={{
      veiculo: {},
      regiao: {},
      isChange: false,
    }} />
    <AppStack.Screen name={AuthRoutes.Regioes} component={components.TelaRegioes} initialParams={{
      regioes: [], isChange: false
    }} />
    <AppStack.Screen name={AuthRoutes.Impressoras} component={components.TelaImpressoras} initialParams={{
      ordem: {}
    }} />
    <AppStack.Screen name={AuthRoutes.ColetasAgendadas} component={components.TelaColetasAgendadas} initialParams={{
      codigoOSEnviada: 0,
      filtros: undefined,
      scanData: '',
    }} />
    <AppStack.Screen name={AuthRoutes.ColetaResponsavel} component={components.TelaColetaResponsavel} initialParams={{
      coleta: {},
      photo: {},
      assinatura: '',
      scanData: '',
      novaColeta: false,
      mtr: {},
    }} />
    <AppStack.Screen name={AuthRoutes.DetalhesDaColeta} component={components.TelaColetaDetalhes} initialParams={{
      coletaID: 0,
      motivo: {},
    }} />
    <AppStack.Screen name={AuthRoutes.DetalhesDaColetaLocal} component={components.TelaColetaDetalhesLocal} initialParams={{
      coleta: {},
      codigoOS: 0,
      codigoCliente: 0,
    }} />
    <AppStack.Screen name={AuthRoutes.DetalhesDoResiduoLocal} component={components.TelaDetalhesResiduoLocal} initialParams={{
      residuo: {},
    }} />
    <AppStack.Screen name={AuthRoutes.DetalhesDoEquipamentoLocal} component={components.TelaDetalhesEquipamentoLocal} initialParams={{
      equipamento: {},
    }} />
    <AppStack.Screen name={AuthRoutes.ListaResiduosLocal} component={components.TelaListaResiduosLocal} initialParams={{
      residuos: [],
    }} />
    <AppStack.Screen name={AuthRoutes.ListaEquipamentosLocal} component={components.TelaListaEquipamentosLocal} initialParams={{
      equipamentos: [],
      equipamentosRetirados: [],
    }} />
    <AppStack.Screen name={AuthRoutes.ResumoDaColeta} component={components.TelaResumoColeta} initialParams={{
      coleta: {},
    }} />
    <AppStack.Screen name={AuthRoutes.Checklist} component={components.TelaChecklist} initialParams={{
      coleta: {},
    }} />
    <AppStack.Screen name={AuthRoutes.ResiduosDaColeta} component={components.TelaColetaResiduos} initialParams={{
      coleta: {},
      residuo: {},
      novaColeta: false,
    }} />
    <AppStack.Screen name={AuthRoutes.EquipamentosDaColeta} component={components.TelaColetaEquipamentos} initialParams={{
      coleta: {},
      equipamento: {},
      scanData: '',
      novaColeta: false,
    }} />
    <AppStack.Screen name={AuthRoutes.Residuo} component={components.TelaResiduo} initialParams={{
      residuo: {},
      photo: {},
      balanca: {},
      adicionado: false,
      duplicado: false,
      isEdit: false
    }} />
    <AppStack.Screen name={AuthRoutes.ListaResiduos} component={components.TelaListaResiduos} initialParams={{
      screen: '',
      residuos: [],
      contratoID: 0,
      clienteID: 0,
    }} />
    <AppStack.Screen name={AuthRoutes.ListaBalancasTCP} component={components.TelaListaBalancasTCP} initialParams={{
      screen: '', ehEdicao: false,
    }} />
    <AppStack.Screen name={AuthRoutes.ListaObras} component={components.TelaListaObras} initialParams={{
      clienteID: 0,
      placa: '',
    }} />
    <AppStack.Screen name={AuthRoutes.ListaEquipamentos} component={components.TelaListaEquipamentos} initialParams={{
      screen: '',
      scanData: '',
      equipamentoSubstituir: {},
      equipamentos: [],
      coleta: {},
      novaColeta: false,
    }} />
    <AppStack.Screen name={AuthRoutes.Imobilizados} component={components.TelaImobilizados} initialParams={{
      codigosOS: '',
    }} />
    <AppStack.Screen name={AuthRoutes.FiltrarColetas} component={components.TelaFiltrarColetas} initialParams={{
      cliente: {},
      placa: '',
      obra: {},
      filtros: undefined,
      screen: '',
      isHistico: false
    }} />
    <AppStack.Screen name={AuthRoutes.Clientes} component={components.TelaClientes} initialParams={{
      isSelect: false,
      screen: '',
    }} />
    <AppStack.Screen name={AuthRoutes.Motivos} component={components.TelaMotivos} initialParams={{
      screen: '',
    }} />

    {/* paradas */}
    <AppStack.Screen name={AuthRoutes.ListaParadas} component={components.TelaListaParadas} initialParams={{
      screen: '',
    }} />
    <AppStack.Screen name={AuthRoutes.AdicionarParadas} component={components.TelaAdicionarParadas} initialParams={{
      screen: '',
    }} />
    <AppStack.Screen name={AuthRoutes.AdicionarMotivoParadas} component={components.TelaAdicionarMotivoParadas} initialParams={{
      screen: '',
    }} />


    <AppStack.Screen name={AuthRoutes.ClienteContainers} component={components.TelaClienteContainers} initialParams={{
      containers: [],
    }} />
    <AppStack.Screen name={AuthRoutes.DetalhesDoCliente} component={components.TelaDetalhesCliente} initialParams={{
      clienteID: 0,
    }} />
    <AppStack.Screen name={AuthRoutes.Rascunhos} component={components.TelaRascunhos} initialParams={{
      rascunhoDeletado: {}
    }} />
    <AppStack.Screen name={AuthRoutes.DetalhesDoRascunho} component={components.TelaRascunhoDetalhes} initialParams={{
      rascunho: {},
    }} />
    <AppStack.Screen name={AuthRoutes.HistoricoDeColetas} component={components.TelaHistoricoColetas} initialParams={{
      filtros: null,
      scanData: '',
    }} />
    <AppStack.Screen name={AuthRoutes.NovaColeta} component={components.TelaNovaColeta} initialParams={{
      cliente: {},
      obra: {},
      motivo: {},
    }} />
    <AppStack.Screen name={AuthRoutes.ObrasNovaColeta} component={components.TelaObrasNovaColeta} initialParams={{
      isSelect: false,
      screen: ''
    }} />
    <AppStack.Screen name={AuthRoutes.Configuracoes} component={components.TelaConfiguracoes} />
    <AppStack.Screen name={AuthRoutes.AlterarSenha} component={components.TelaAlterarSenha} />
    <AppStack.Screen name={CommonRoutes.ConfiguracaoInicial} component={components.TelaConfiguracaoIncial} />
    <AppStack.Screen name={AuthRoutes.AlterarPlaca} component={components.TelaAlterarPlaca} initialParams={{
      screen: '',
      isSelect: false,
    }} />
    <AppStack.Screen name={AuthRoutes.Backup} component={components.TelaBackup} />
    <AppStack.Screen name={AuthRoutes.Camera} component={components.Camera} initialParams={{
      message: '',
      isFront: false,
      screen: '',
    }} />
    <AppStack.Screen name={AuthRoutes.Scanner} component={components.Scanner} initialParams={{
      message: '',
      scanType: '',
      screen: '',
    }} />
    <AppStack.Screen name={AuthRoutes.Assinatura} component={components.Assinatura} initialParams={{
      screen: '',
      novaColeta: false,
      coleta: {},
      grupos: [],
      motivo: {},
      codigoQuestionario: 0,
      perguntas: [],
      placa: '',
    }} />
    <AppStack.Screen name={AuthRoutes.RecusaDeAssinatura} component={components.TelaRecusaAssinatura} initialParams={{
      coleta: {},
      novaColeta: false,
    }} />
    <AppStack.Screen name={AuthRoutes.Relatorio} component={components.TelaRelatorio} />
  </AppStack.Navigator>
);

export default AuthRotas;
