import axios from "axios";
import Config from "react-native-config";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = Config.API_KEY;

axiosClient.defaults.timeout = Number(Config?.API_TIMEOUT_KEY ?? 5000);

axiosClient.defaults.withCredentials = true;

export default axiosClient;