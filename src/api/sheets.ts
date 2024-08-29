import {authorize} from 'react-native-app-auth';
import {Storage} from '../storage/storage';
import axios from 'axios';

export type SheetDataObject = {
  [key: string]: {colIndex: number; values: number[]};
};
export const SPREADSHEET_ID = '1QJSysDUcGbH5ccZczYhbRZf4zjikmAL16DJFN_p7IUo';
export const API_KEY = 'AIzaSyDv-0tGiushLMx97jnDNwiJntXCw4qACYM';

export const config = {
  issuer: 'https://accounts.google.com',
  clientId:
    '809725300075-3ct5p3b3c7jlqkodg90ishvjce5qda9d.apps.googleusercontent.com', // Tu CLIENT_ID
  redirectUrl:
    'com.googleusercontent.apps.809725300075-3ct5p3b3c7jlqkodg90ishvjce5qda9d:/oauth2redirect', // Usa el REVERSED_CLIENT_ID seguido de `:/oauth2redirect`
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
};

export const getAccessToken = async () => {
  try {
    const result = await authorize(config);
    await Storage.setToken(result.accessToken);
    return result.accessToken;
  } catch (error) {
    console.error('Error al obtener el token:', error);
  }
};

function parseData(values: string[][]): SheetDataObject {
  if (values.length === 0) return {};

  const headers = values[0]; // La primera fila contiene las claves

  const result: SheetDataObject = {};
  // Inicializa las claves con arrays vacíos
  headers.forEach((item, index) => {
    result[item] = {colIndex: index, values: []};
  });

  // Recorre el resto de las filas y llena los arrays correspondientes
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    row.forEach((value, index) => {
      const key = headers[index];
      result[key].values.push(Number(value));
    });
  }
  return result;
}

export const getDataFromSheet = async () => {
  try {
    const token = await Storage.getToken();

    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Principal!A1:O500`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return parseData(response.data.values);
  } catch (error: any) {
    if (error.status == 401 || error.status == 403) {
      await getAccessToken();
      await getDataFromSheet();
    }
  }
};
