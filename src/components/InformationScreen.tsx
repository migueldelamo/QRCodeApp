import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ArrowLeft, UserCircle, XCircle} from 'phosphor-react-native';
import {useJornada} from '../context/JornadaContext';
import {Animated} from 'react-native';
import {Data} from '../storage/storage';
import {Storage} from '../storage/storage';

const av = new Animated.Value(0);
av.addListener(() => {
  return;
});

type RootStackParamList = {
  Scanner: {data: Data};
};

type InformationScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Scanner'>;
  route: RouteProp<RootStackParamList, 'Scanner'>;
};
const InformationScreen: React.FC<InformationScreenProps> = ({
  navigation,
  route,
}) => {
  const {jornada} = useJornada();
  const data = useRef(route.params.data);

  const [inputValue, setinputValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState(
    data.current[jornada].filter(item => item > 0 && item < 1000),
  );

  const handleSearch = () => {
    if (inputValue == '') {
      setFilteredData(
        data.current[jornada].filter(item => item > 0 && item < 1000),
      );
    } else {
      const filtered = data.current[jornada].filter(
        item => item === Number(inputValue),
      );
      setFilteredData(filtered);
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
            data.current[jornada] = [];
            await Storage.setData(data.current);
            handleSearch();
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    handleSearch();
  }, [inputValue]);

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
            Asistencia {jornada}
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
        style={{
          flex: 1,
        }}
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
            flexDirection: 'row',
            padding: 16,
          }}>
          <TextInput
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              paddingHorizontal: 16,
              height: 40,
              marginRight: 8,
              flex: 1,
            }}
            placeholder="Buscar socio por número"
            value={inputValue}
            onChangeText={setinputValue}
            keyboardType="numeric"
          />
        </View>
        <ScrollView bounces={false}>
          <View
            style={{
              padding: 16,
              flex: 1,
            }}>
            {filteredData.map((item, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'gray',
                    borderColor: 'white',
                    borderWidth: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginVertical: 6,
                    borderRadius: 16,
                  }}
                  key={`view-${index}`}>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <UserCircle color="white" size={25}></UserCircle>
                    <Text
                      style={{
                        marginLeft: 8,
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 500,
                      }}
                      key={`text-${index}`}>
                      Socio {item}
                    </Text>
                  </View>
                  <Pressable
                    style={{
                      borderRadius: 99,
                    }}
                    onPress={async () => {
                      data.current[jornada] = filteredData.filter(
                        elm => elm != item,
                      );
                      await Storage.setData(data.current);
                      handleSearch();
                    }}>
                    <XCircle color="white" size={25} weight="fill"></XCircle>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </ScrollView>
        <Text
          style={{
            marginTop: 10,
            marginBottom: 20,
            marginRight: 16,
            textAlign: 'right',
            color: 'white',
            fontSize: 16,
          }}>
          {filteredData.length > 0
            ? `${filteredData.length} resultado(s)`
            : 'No se ha encontrado ningún socio'}
        </Text>
        <Pressable
          style={{
            backgroundColor: '#E71C22',
            padding: 20,
            borderRadius: 16,
            width: 250,
            alignItems: 'center',
            alignContent: 'center',
            justifyContent: 'center',
            borderColor: 'white',
            borderWidth: 5,
            alignSelf: 'center',
            marginBottom: 20,
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
            Resetear jornada
          </Text>
        </Pressable>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default InformationScreen;
