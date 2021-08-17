
import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Alert,
  Text,
  View,
  Image,
  Linking,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import app from "@react-native-firebase/app"
import database from "@react-native-firebase/database";
import storage from '@react-native-firebase/storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import { RootStackParamList } from './RootStackPrams';
import GetLocation from 'react-native-get-location';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import MapView, { Marker } from 'react-native-maps';
import { useRef } from 'react';
import { FC } from 'react';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// import messaging from '@react-native-firebase/messaging';
// import PushNotification from "react-native-push-notification";
// import PushNotificationIOS from '@react-native-community/push-notification-ios';

type detailsScreenProp = StackNavigationProp<RootStackParamList, 'Details'>


type TabParamList = {
  Details: {
    rid: string;
    rname: string;
    rlastname: string;
    rimage: string;
  };
};

const edite: FC = () => {


  const navigation = useNavigation<detailsScreenProp>();
  const route = useRoute<RouteProp<TabParamList, 'Details'>>();


  const [id, setid] = useState<any>()
  const [name, setname] = useState<string>()
  const [lastname, setlastname] = useState<string>()
  const [image, setimage] = useState<string>()
  const [filename, setfilename] = useState<string>()
  const [lat, setlat] = useState<number>()
  const [long, setlong] = useState<number>()
  const [token, settoken] = useState()
  const mapRef = useRef()

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Details')
          }>
          <Image style={{ marginRight: 30 }} source={require('./srcImage/plus.png')}></Image>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);


  const firebaseApi = (id: null, name: string, lastname: string, image: string, lat: number, long: number) => {
    return new Promise(function async(resolve, reject) {
      let key;
      if (id != null) {
        key = id
      } else {
        key = database().ref().push().key;
      }


      let datasave = {
        id: key,
        name: name,
        lastname: lastname,
        image: image,
        lat: lat,
        long: long
      }

      app.database().ref('users/' + key).set(datasave).then((snapshote) => {
        resolve(snapshote)
      }).catch(err => {
        reject(err);
      })

      const ref = storage().ref('users/' + key).child('profilepic')

      ref.putFile(image).then((snapshot) => {

        console.log(`${filename} has been successfully uploaded.`);
      }).catch((e) => console.log('uploading image error => ', e));
    })
  }


  const saveUser = () => {
    firebaseApi(id!, name!, lastname!, image!, lat!, long!).then((res) => {
      setid(null);
      setname('');
      setlastname('');
      setimage('');

    }).catch((error) => {
      console.log(error)
    })
  }

  const clear = () => {
    setid(null);
    setname('');
    setlastname('');
    setimage('')
  }

  //   async function requestUserPermission() {
  //     const authStatus = await messaging().requestPermission({
  //       sound: true,
  //       alert: true,
  //       badge: true
  //     });
  //     const enabled =
  //       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //     if (enabled) {
  //       console.log('Authorization status:', authStatus);
  //     }
  //   }



  useEffect(() => {
     GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 2000,
    })
      .then(location => {
        let lt = location.latitude;
        let lg = location.longitude
        setlat(lt)
        setlong(lg)

      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        if (Platform.OS === 'ios') {
          Alert.alert(
            'Alert',
            'App need to run your location, please open your devices location', // <- this part is optional, you can pass an empty string
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'OK', onPress: () => {
                  Linking.openURL('App-Prefs:Privacy&path=LOCATION')
                }
              }
            ],
            { cancelable: false },
          );
        }
        else {
          // RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          //   interval: 10000,
          //   fastInterval: 5000,
          // })
          //   .then((data) => {

          //   })
          //   .catch((err) => {
          //     // 
          //   });
        }
        throw error;
      })
    // requestUserPermission()


    // // Register the device with FCM
    // await messaging().registerDeviceForRemoteMessages();

    // messaging().onMessage(async remoteMessage => {
    //   console.log(remoteMessage)
    //   PushNotification.localNotification({
    //     channelId:'fcm_fallback_notification_channel',
    //     message: remoteMessage.notification.body,
    //     title: remoteMessage.notification.title,
    //     data: remoteMessage.data
    //   }
    //   );  
    // })

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   // console.log('Message handled in the background!', remoteMessage);
    //   navigation.navigate(remoteMessage.data?.screen);

    // });


    // PushNotification.configure({
    //   onRegister: function (token) {
    //     console.log("TOKEN:", token);
    //   },
    //   onNotification: function (notification) {

    //     if (notification.foreground) {
    //       if(notification.userInteraction)
    //       {
    //           console.log('NOTIFICATION touched:', notification);
    //           navigation.navigate(notification.data?.screen);
    //       }
    //       else{
    //           console.log('NOTIFICATION foreground userInteraction:', notification.userInteraction);

    //       }
    //   }
    //   else {
    //       if(notification.userInteraction)
    //       {
    //           console.log('NOTIFICATION touched:', notification);
    //           navigation.navigate(notification.data?.screen);

    //       }
    //       else{
    //           console.log('NOTIFICATION userInteraction:', notification.userInteraction);

    //       }

    //   }
    //     notification.finish(PushNotificationIOS.FetchResult.NoData);
    //   },
    //   onAction: function (notification) {
    //     console.log("ACTION:", notification.action);
    //     console.log("NOTIFICATION:", notification);
    //   },
    //   onRegistrationError: function (err) {
    //     console.error(err.message, err);
    //   },

    //   permissions: {
    //     alert: true,
    //     badge: true,
    //     sound: true,
    //   },
    //   popInitialNotification: true,
    //   requestPermissions: true,
    // });

    if (route.params?.rid, route.params?.rname, route.params?.rlastname, route.params?.rimage) {
      const { rid, rname, rlastname, rimage } = route.params
      setid(rid);
      setname(rname);
      setlastname(rlastname);
      setimage(rimage)
    }
  }, [route.params?.rid, route.params?.rname, route.params?.rlastname, route.params?.rimage])



  const cameraopen = () => {
    ImageCropPicker.openCamera({ width: 1200, height: 780, cropping: true, }).then((image) => {
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setimage(imageUri);
    });
  }

  // GetLocation.getCurrentPosition({
  //   enableHighAccuracy: true,
  //   timeout: 2000,
  // })
  //   .then(location => {
  //     let lt = location.latitude;
  //     let lg = location.longitude
  //     setlat(lt)
  //     setlong(lg)

  //   })




  const select = () => {
    ImageCropPicker.openPicker({ width: 1200, height: 780, cropping: true, }).then((image) => {
      const iUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      setimage(iUri)
      let filen = image.filename;
      setfilename(filen)
    })
  }


  return (
    <SafeAreaView >

      <ScrollView>

        <View style={{ flexDirection: "column" }}>

          <View style={{ flexDirection: 'row', margin: 20 }}>

            <TouchableOpacity onPress={select}>
              <View>
                <Image style={{ height: 80, width: 80, borderRadius: 40, borderColor: "gray", borderWidth: 1 }} source={{ uri: image }}></Image>
              </View>
            </TouchableOpacity>


            <View style={{ flexDirection: 'column', margin: 5, width: '80%' }}>
              <View style={{ borderWidth: 1, borderColor: 'black', borderRadius: 10, width: '80%', padding: 5 }}>
                <TextInput
                  placeholder="Name"
                  onChangeText={(text) => {
                    setname(text)
                  }}
                  value={name}
                  style={{ fontSize: 15, marginLeft: 8, width: "90%" }}
                />
              </View>

              <View style={{ borderRadius: 10, borderColor: "black", borderWidth: 1, width: '80%', marginTop: 10, padding: 5 }}>
                <TextInput
                  placeholder="Last Name"
                  onChangeText={(text) => {
                    setlastname(text)
                  }}
                  value={lastname}
                  style={{ fontSize: 15, marginLeft: 8, width: "90%" }}
                />
              </View >

              <View style={{ borderRadius: 10, borderColor: "black", borderWidth: 1, width: '80%', marginTop: 10, padding: 5 }}>

                <Text style={{ width: '80%' }}>{lat}</Text>
              </View >

              <View style={{ borderRadius: 10, borderColor: "black", borderWidth: 1, width: '80%', marginTop: 10, padding: 5 }}>
                <Text style={{ width: '80%' }}>{long}</Text>
              </View >

              <View style={{ marginTop: 5, width: "80%", backgroundColor: 'black' }}>
                <Button
                  onPress={cameraopen}
                  title="camera"
                  color='red'

                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignSelf: 'center' }}>
            <View style={{ margin: 10, width: "40%", backgroundColor: "black" }}>
              <Button
                onPress={saveUser}
                title="Save"
                color='red'
              />
            </View>
            <View style={{ margin: 10, width: "40%", marginRight: 10, backgroundColor: "black" }}>
              <Button
                onPress={clear}
                title="clear"
                color='red'

              />
            </View>
          </View>
          {/* <View style={{ margin: 10, borderColor: 'black', borderWidth: 1, borderRadius: 5 }}>
            <MapView style={{ width: "100%", alignSelf: "center", height: 500 }}
              ref={mapRef}
              maxZoomLevel={1}
              followsUserLocation={true}
              initialRegion={{
                latitude: lat,
                longitude: long,
                latitudeDelta: 9.5,
                longitudeDelta: 9.5,
              }}> */}

          {/* <MapView.Marker
                coordinate={{
                  latitude: lat,
                  longitude: long
                }}
                ref={mapRef}
                title={"this my location"}
                description={"happy with this location"}
              />
            </MapView> */}

          {/* </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default edite;
