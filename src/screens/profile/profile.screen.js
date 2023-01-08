import React from "react";
import { useState, useEffect } from "react";
import { Button, StyleSheet, Dimensions, Text, View, Image, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import SafeAreaContainer from "../../components/containers/SafeAreaContainer";
import ProfilePic from "../../components/profilePic/ProfilePic";
import { signOutUser } from "../../firebase/auth.firbase";
import { addOrRemoveFollowers, getAllPosts, getUserDB } from "../../firebase/firestore.firebase";
import { useNavigation } from '@react-navigation/native';

const HeaderSection = ({userData, isOwnProfile, posts, onFollow}) => {
  return (
    <>
      <View style={{ flexDirection: 'row', alignContent: 'center', marginHorizontal: 16 }}>
        <ProfilePic
          source={userData?.profilePicUrl}
          size={60}
          borderColor="#e75583"
        />
        <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'flex-end', alignItems: 'center', marginTop: 20 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 30 }}>
            <Text style={{ fontSize: 20, }}>{posts.length || 0}</Text>
            <Text>Posts</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 30 }}>
            <Text style={{ fontSize: 20, }}>{userData?.followers || 0}</Text>
            <Text>Followers</Text>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 30 }}>
            <Text style={{ fontSize: 20, }}>{userData?.following || 0}</Text>
            <Text>Following</Text>
          </View>
        </View>
      </View>
      <Text style={{ fontSize: 16, textTransform: "capitalize", marginBottom: 10, }}>
        {userData?.name}
      </Text>
      {isOwnProfile ? <Button title="logout" onPress={signOutUser} /> : <Button title="Follow" onPress={onFollow} />}
    </>
  );
};

const ProfileScreen = ({route}) => {
  const uid = route?.params?.uid || null;
  const [user, setUser] = useState(null);
  const [self, setSelf] = useState(useSelector((state) => state.user))
  const isOwnProfile = !uid;
  const userData = uid ? user : self;
  const deviceWidth = Dimensions.get("window").width;
  const [posts, setPosts] = useState([]);
  const nav = useNavigation();

  useEffect(() => {
    if (uid) {
      getUserDB(uid, setUser);
      console.log(user);
    }
    getAllPosts((data) =>
      setPosts(data.filter((e => e.postData.uid === userData?.uid))));
  }, []);

  const renderPost = ({item, index}) => {
    return <Image
    source={{ uri: item.postData.imageUrl }}
    resizeMode="cover"
    style={{ width: (deviceWidth - 34) / 3, height: (deviceWidth - 34) / 3, marginLeft: index % 3 ? 1 : 0, marginTop: 1}}
  />
  };

  if (uid === self?.uid) {
    nav.goBack();
  }

  const onFollow = () =>
    addOrRemoveFollowers(uid, self?.uid, 'add');

  return (
    <SafeAreaContainer style={styles.container}>
      {uid ? <TouchableOpacity style={{marginBottom: 10, backgroundColor: 'cyan'}} onPress={nav.goBack}><Text>Back</Text></TouchableOpacity> : null}
      <HeaderSection userData={userData} isOwnProfile={isOwnProfile} posts={posts} onFollow={onFollow} />
      <FlatList
        data={posts}
        contentContainerStyle={{marginTop: 5}}
        renderItem={renderPost}
        numColumns={3}
        keyExtractor={({item}) => item?.postId}
      />
    </SafeAreaContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container : {
    margin: 16,
    flex: 1,
  }
});
