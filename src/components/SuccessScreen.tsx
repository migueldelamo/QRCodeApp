import React from 'react';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ArrowLeft, CheckCircle} from 'phosphor-react-native';
import {useJornada} from '../context/JornadaContext';

type RootStackParamList = {
  Scanner: undefined;
  Success: {scannedData: number};
  Failure: {scannedData: number};
};

type SuccessScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Scanner'>;
  route: RouteProp<RootStackParamList, 'Success' | 'Failure'>;
};
const SuccessScreen: React.FC<SuccessScreenProps> = ({navigation, route}) => {
  const {jornada} = useJornada();
  const {scannedData} = route.params;
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
          <ArrowLeft color={'white'} size={24} />
        </Pressable>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 600,
            }}>
            {jornada}
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
          }}></Pressable>
      </View>
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
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          }}
        />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <CheckCircle color="green" size={150} />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 30,
                color: 'green',
                fontWeight: 900,
              }}>
              ¡Adelante, puede pasar!
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'green',
                fontWeight: 600,
                marginTop: 8,
              }}>
              Socio número {scannedData}
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: 'white',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginTop: 40,
            }}
            onPress={() => navigation.navigate('Scanner')}>
            <Text style={{fontSize: 20, fontWeight: 600}}>
              Volver a escanear
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SuccessScreen;
