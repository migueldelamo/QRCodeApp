import {StackNavigationProp} from '@react-navigation/stack';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {useJornada} from '../context/JornadaContext';
import React, {useState, useRef, useCallback, useEffect} from 'react';

import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {Storage} from '../storage/storage';
import {SheetDataObject, getAccessToken, getDataFromSheet} from '../api/sheets';
import {Camera} from 'react-native-vision-camera';
import {Animated} from 'react-native';

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

type RootStackParamList = {
  Scanner: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Scanner'>;
  route: RouteProp<RootStackParamList, 'Scanner'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {setJornada} = useJornada();
  const [jornadas, setJornadas] = useState<string[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useRef<string>('');
  const sheetData = useRef<SheetDataObject>();

  // Solicitar permiso para usar la cámara
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        try {
          setIsLoading(true);
          const token = await Storage.getToken();
          if (token) {
            accessToken.current = token;
          } else {
            const newToken = await getAccessToken();
            if (newToken) {
              accessToken.current = newToken;
              await Storage.setToken(newToken); // Asegúrate de almacenar el nuevo token
            }
          }

          if (accessToken.current) {
            const response = await getDataFromSheet();
            if (response && isActive) {
              sheetData.current = response;
              setJornadas(Object.keys(response));
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          if (isActive) setIsLoading(false);
        }
      })();

      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    if (jornadas.length > 0) setIsLoading(false);
  }, [jornadas]);

  return (
    <SafeAreaView style={{backgroundColor: 'rgba(0, 0, 0, 0.9)', flex: 1}}>
      <ImageBackground
        style={{flex: 1}}
        resizeMode="cover"
        source={{uri: 'escudo_futsal_villarrobledo'}}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginBottom: 20,
              color: 'white',
            }}>
            Selecciona una jornada
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
            }}>
            {isLoading ? (
              <ActivityIndicator size="large" style={{marginTop: 40}} />
            ) : (
              jornadas.map((jornada, index) => (
                <Pressable
                  key={index}
                  style={{
                    backgroundColor: '#4CAF50',
                    padding: 10,
                    marginVertical: 5,
                    borderRadius: 5,
                    width: 250,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (sheetData.current?.[jornada]) {
                      setJornada(jornada);
                      navigation.navigate('Scanner');
                    }
                  }}
                  disabled={!hasPermission}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                    }}>
                    {jornada}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
