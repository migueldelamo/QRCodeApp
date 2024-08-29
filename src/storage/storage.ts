import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  setToken: async (value: string) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@token', jsonValue);
    } catch (e) {
      return ['Error', e];
    }
  },

  getToken: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@token');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return ['Error', e];
    }
  },
};
