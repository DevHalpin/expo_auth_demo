import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, Image, Button, View} from 'react-native';

import * as Google from 'expo-auth-session/providers/google';

const App = () => {
  const [accessToken, setAccessToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: 'Your_ID_HERE',
    expoClientId: 'Your_ID_HERE',
  });

  useEffect(() => {
    if (response && response.type === 'success' && response.authentication) {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  const getUserData = async () => {
    let userInfoResponse = await fetch(
      'https://www.googleapis.com/userinfo/v2/me',
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      },
    );

    userInfoResponse.json().then(data => {
      setUserInfo(data);
    });
  };

  const showUserInfo = () => {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{uri: userInfo.picture}} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {showUserInfo()}
      <Button
        title={accessToken ? 'Get User Info' : 'Login'}
        onPress={
          accessToken
            ? getUserData
            : () => {
                promptAsync({showInRecents: true});
              }
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
  },
});

export default App;
