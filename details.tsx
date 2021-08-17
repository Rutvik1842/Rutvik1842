import React, { useState } from 'react';
import { useEffect } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  Platform,
  ListRenderItem
} from 'react-native';

import app from "@react-native-firebase/app"
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';
import { FC } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackPrams';

type editeScreenProp = StackNavigationProp<RootStackParamList, 'Edite'>

const details: FC = () => {

  const [user, setuser] = useState<string[]>([])
  const navigation = useNavigation<editeScreenProp>();

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //         <TouchableOpacity
  //         onPress={ navigateMap }>
  //         <Image style ={{marginRight: 30}} source = {require('./srcImage/plus.png')}></Image>
  //         </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);



  //  navigateMap = async()=>{
  //      console.log(user)
  //     await navigation.navigate('Map', {markers : user})

  //  }

  const navigateEdit = (item: any) => {
    navigation.navigate("Edite", { rid: item.id, rname: item.name, rlastname: item.lastname, rimage: item.image });
  }
  //  {rid : item.id,rname : item.name,rlastname : item.lastname,rimage : item.image 
  //  }

  // const userScreen=(item)=>{
  //   navigation.navigate("User",
  //   {rname : item.name, rlastname : item.lastname, rimage : item.image, rlat : item.lat, rlong : item.long
  //  });
  //  }

  const downloadUrl = (item: any) => {
    console.log(item.image)
    const imageRef = storage().ref('users/' + item.id)
    imageRef.child('profilepic').getDownloadURL().then((url) => {
      database()
        .ref('users/' + item.id)
        .update({
          image: url,
        })
        .then(() => console.log('Data updated.'));
    })

  }


  useEffect(() => {
    const userRef = database().ref('/users');
    const on = userRef.on('value', (snapshote) => {
      setuser([]);
      snapshote.forEach(function(childshanpshot) {
        setuser(user => [...user, childshanpshot.val()]);
        // return true;
      })
      return () => {
        userRef.off('value', on)
      }
    })
  }, [])


  const myfunction = ({ item }: any) => {
    return (

      <View style={{
        flex: 1,
        flexDirection: "row", margin: 10
      }}>
        <TouchableOpacity
          onPress={() => downloadUrl(item)}>
          <Image style={{ height: 80, width: 80, borderRadius: 40, borderColor: "gray", borderWidth: 1 }} source={{ uri: item.image }}></Image>
        </TouchableOpacity>
        <TouchableOpacity
        // onPress={()=> userScreen(item)}
        >
          <View style={{ flexDirection: 'column', marginRight: 10 }}>
            <Text style={{ margin: 10 }}>{'name : '}{item.name}</Text>
            <Text style={{ margin: 10 }}>{'lastname : '}{item.lastname}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateEdit(item)}>
          <Image style={{ margin: 30, alignItems: 'flex-end' }} source={require('./srcImage/plus.png')}></Image>
        </TouchableOpacity>
      </View>
    )
  }



  return (
    <SafeAreaView>
      <Text> hello rutvik</Text>

      <FlatList style={{ margin: 10 }}
        scrollEnabled={true}
        data={user}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={myfunction}
      />

    </SafeAreaView>
  );
};


export default details
