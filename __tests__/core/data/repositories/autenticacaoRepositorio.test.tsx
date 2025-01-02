import md5 from 'md5';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Config from "react-native-config";

describe('/login', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should return a token', async () => {
    const token = 'token';

    const user = {
      usuario: 'leonardho',
      senha: md5('123'),
      autenticacao: Config.APP_SLUG_KEY,
    };

    mock.onPost(`${Config.API_KEY}/login`, user).reply(200, token);

    const response = await axios.post(`${Config.API_KEY}/login`, user);

    expect(response.data).toEqual(token);
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toEqual(`${Config.API_KEY}/login`);
  });
});
