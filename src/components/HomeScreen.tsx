import {StackNavigationProp} from '@react-navigation/stack';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useJornada} from '../context/JornadaContext';
import React, {useState, useCallback, useEffect} from 'react';

import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {Storage} from '../storage/storage';
import {Camera} from 'react-native-vision-camera';
import {Animated} from 'react-native';
import {ArrowsCounterClockwise} from 'phosphor-react-native';

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
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  // const accessToken = useRef<string>('');

  // Permiso para usar la cámara
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const getData = async () => {
    const storageData = await Storage.getData();
    if (storageData.error) {
      setError(true);
      return;
    }

    if (storageData.data) {
      setJornadas(Object.keys(storageData.data));
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Resetear jornadas',
      '¿Estás seguro de que quieres resetear todas las jornadas? Esta acción no se podrá deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'default',
        },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            await Storage.resetData();
            await getData();
            setIsLoading(false);
          },
        },
      ],
      {cancelable: false},
    );
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setIsLoading(true);
        await getData();
        setIsLoading(false);
      })();
    }, []),
  );

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
          {jornadas.length > 0 && (
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 20,
                color: 'white',
              }}>
              Selecciona una jornada
            </Text>
          )}
          {isLoading ? (
            <ActivityIndicator size="large" style={{marginTop: 40}} />
          ) : error ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: 600,
                }}>
                No se han podido obtener las jornadas. Haz click para volver a
                cargar
              </Text>
              <Pressable
                style={{
                  justifyContent: 'center',
                  marginTop: 16,
                  backgroundColor: 'white',
                  padding: 16,
                  width: 100,
                  borderRadius: 99,
                  alignItems: 'center',
                }}
                onPress={getData}>
                <ArrowsCounterClockwise color="black"></ArrowsCounterClockwise>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
              }}>
              {jornadas.map((jornada, index) => (
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
                    setJornada(jornada);
                    navigation.navigate('Scanner');
                  }}
                  disabled={!hasCameraPermission}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                    }}>
                    {jornada}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
          <Pressable
            style={{
              backgroundColor: '#E71C22',
              padding: 20,
              marginTop: 20,
              borderRadius: 16,
              width: 250,
              alignItems: 'center',
              borderColor: 'white',
              borderWidth: 5,
            }}
            onPress={() => {
              handleReset();
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 600,
              }}>
              Resetear
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
