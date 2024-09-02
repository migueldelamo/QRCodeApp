import AsyncStorage from '@react-native-async-storage/async-storage';

export type Data = {[key: string]: number[]};
type Response = {data?: any; error: boolean};

const INITIAL_DATA = {
  'Jornada 2': [],
  'Jornada 4': [],
  'Jornada 6': [],
  'Jornada 8': [],
  'Jornada 9': [],
  'Jornada 11': [],
  'Jornada 13': [],
  'Jornada 15': [],
  'Jornada 16': [],
  'Jornada 18': [],
  'Jornada 20': [],
  'Jornada 22': [],
  'Jornada 25': [],
  'Jornada 27': [],
  'Jornada 29': [],
};

export const Storage = {
  setToken: async (value: string) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@token', jsonValue);
    } catch (e) {
      return ['Error', e];
    }
  },

  getToken: async (): Promise<Response> => {
    try {
      const jsonValue = await AsyncStorage.getItem('@token');
      return {
        data: jsonValue != null ? JSON.parse(jsonValue) : null,
        error: false,
      };
    } catch (e) {
      return {error: true};
    }
  },

  setData: async (value: Data) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@data', jsonValue);
    } catch (e) {
      return ['Error', e];
    }
  },
  resetData: async () => {
    await AsyncStorage.setItem('@data', JSON.stringify(INITIAL_DATA));
  },

  getData: async (): Promise<Response> => {
    try {
      const jsonValue = await AsyncStorage.getItem('@data');
      if (jsonValue != null) {
        return {data: JSON.parse(jsonValue), error: false};
      } else {
        // Inicializa el objeto data con valores predeterminados
        await Storage.setData(INITIAL_DATA);
        return {data: INITIAL_DATA, error: false};
      }
    } catch (e) {
      return {data: null, error: true};
    }
  },
};
