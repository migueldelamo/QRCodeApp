import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  ArrowLeft,
  CheckCircle,
  MagnifyingGlass,
  UserCircle,
} from 'phosphor-react-native';
import {useJornada} from '../context/JornadaContext';
import {SheetDataObject} from '../api/sheets';

type RootStackParamList = {
  Scanner: {data: SheetDataObject};
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
  const {data} = route.params;

  const [inputValue, setinputValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState(data[jornada].values);

  const handleSearch = () => {
    if (inputValue == '') {
      setFilteredData(data[jornada].values);
    } else {
      const filtered = data[jornada].values.filter(
        item => item == Number(inputValue),
      );
      setFilteredData(filtered);
    }
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
        style={{flex: 1}}
        resizeMode="cover"
        source={{uri: 'escudo_futsal_villarrobledo'}}>
        <View
          style={{
            flexDirection: 'row',
            padding: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
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

        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 16,
              flex: 1,
            }}>
            {filteredData.map((item, index) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 35,
                  backgroundColor: 'gray',
                  borderColor: 'white',
                  borderWidth: 1,
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  marginVertical: 6,
                  borderRadius: 16,
                }}
                key={`view-${index}`}>
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
            ))}
            {filteredData.length == 0 && (
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 500,
                }}>
                No se ha encontrado ningún socio
              </Text>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default InformationScreen;
