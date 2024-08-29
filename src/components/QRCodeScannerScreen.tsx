import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Pressable} from 'react-native';
import {
  Camera,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera';
import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {ArrowLeft, CameraRotate} from 'phosphor-react-native';
import {useJornada} from '../context/JornadaContext';
import {Storage} from '../storage/storage';
import {
  getDataFromSheet,
  getAccessToken,
  SheetDataObject,
  SPREADSHEET_ID,
} from '../api/sheets';
import {Animated} from 'react-native';

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

type RootStackParamList = {
  Scanner: undefined;
  Success: {scannedData: number};
  Failure: {scannedData: number};
  Information: {data: SheetDataObject};
};

type QRCodeScannerProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Scanner'>;
  route: RouteProp<RootStackParamList, 'Scanner'>;
};

const QRCodeScannerScreen = ({navigation}: QRCodeScannerProps) => {
  const {jornada} = useJornada();
  const accessToken = useRef<string>('');

  const [isScannerActive, setIsScannerActive] = useState(true);

  const data = useRef<SheetDataObject>({});
  const devices = useCameraDevices();
  const [device, setDevice] = useState(devices[0]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await getDataFromSheet();
        if (response) {
          data.current = response;
          setIsScannerActive(true);
        }
        const token = await Storage.getToken();
        if (token) {
          accessToken.current = token;
        } else {
          await getAccessToken();
        }
      })();
    }, []),
  );

  // Configuración del escáner de códigos
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'], // Especifica los tipos de códigos que quieres escanear
    onCodeScanned: async codes => {
      if (codes.length > 0 && data.current) {
        setIsScannerActive(false);
        const value = codes[0].value ?? '';
        const scannedData = parseInt(value);
        // const scannedData = 978;
        if (
          (jornada && data.current[jornada].values.includes(scannedData)) ||
          scannedData < 0 ||
          scannedData > 1000
        ) {
          navigation.navigate('Failure', {scannedData});
        } else {
          try {
            const response = await axios.post(
              `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,

              {
                requests: [
                  {
                    updateCells: {
                      rows: [
                        {
                          values: [
                            {
                              userEnteredValue: {
                                numberValue: scannedData,
                              },
                            },
                          ],
                        },
                      ],
                      start: {
                        sheetId: 0,
                        rowIndex:
                          data.current[jornada].values.filter(item => item > 0)
                            .length + 1, // Índice de la fila (0 para la primera fila, 1 para la segunda, etc.)
                        columnIndex: data.current[jornada].colIndex, // Índice de la columna (0 para la primera columna, 1 para la segunda, etc.)
                      },
                      fields: 'userEnteredValue',
                    },
                  },
                ],
                includeSpreadsheetInResponse: true,
                responseIncludeGridData: false,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken.current}`,
                },
              },
            );
            if (response.status === 200) {
              navigation.navigate('Success', {scannedData});
              getDataFromSheet();
            } else if (response.status === 401) {
              await getAccessToken();
            }
          } catch (error: any) {
            const token = await getAccessToken();
            if (token) accessToken.current = token;
            const dataSheet = await getDataFromSheet();
            if (dataSheet) data.current = dataSheet;
            setIsScannerActive(true);
          }
        }
      }
    },
  });

  // Si la cámara no está disponible (aún cargando dispositivos)
  if (!device) {
    return <Text>Cargando cámara...</Text>;
  }

  return (
    <SafeAreaView style={{backgroundColor: 'rgba(0, 0, 0, 0.9)', flex: 1}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Pressable
          style={{
            backgroundColor: 'rgba(35, 37, 41, 0.5)',
            width: 44,
            height: 44,
            borderRadius: 99,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 16,
            marginTop: 10,
            marginBottom: 10,
          }}
          onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" size={24} />
        </Pressable>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
            }}>
            Escanea un carnet de socio
          </Text>
        </View>
        <Pressable
          style={{
            width: 44,
            height: 44,
            borderRadius: 99,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            marginTop: 10,
            marginBottom: 10,
          }}
          onPress={() => {
            const cameraType = device.name.toLowerCase().includes('front')
              ? 'back'
              : 'front';
            setDevice(
              devices.find(item =>
                item.name.toLowerCase().includes(cameraType),
              ) ?? devices[0],
            );
          }}>
          <CameraRotate color="white" size={32} />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isScannerActive}
          codeScanner={codeScanner}
        />
        <Pressable
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
            bottom: 50,
          }}
          onPress={() => {
            navigation.navigate('Information', {data: data.current});
          }}>
          <Text style={{fontSize: 24, color: 'black'}}>{jornada}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default QRCodeScannerScreen;
