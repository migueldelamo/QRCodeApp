import AsyncStorage from '@react-native-async-storage/async-storage';

export type Data = {[key: string]: number[]};
type Response = {data?: any; error: boolean};

const INITIAL_DATA = {
  jornada2: [],
  jornada4: [],
  jornada6: [],
  jornada8: [],
  jornada9: [],
  jornada11: [],
  jornada13: [],
  jornada15: [],
  jornada16: [],
  jornada18: [],
  jornada20: [],
  jornada22: [],
  jornada25: [],
  jornada27: [],
  jornada29: [],
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

  getData: async (): Promise<Response> => {
    try {
      const jsonValue = await AsyncStorage.getItem('@data');
      let data: Data;
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
