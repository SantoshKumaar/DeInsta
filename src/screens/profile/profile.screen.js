import React from "react";
import { useState, useEffect } from "react";
import { Button, StyleSheet, Dimensions, Text, View, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import SafeAreaContainer from "../../components/containers/SafeAreaContainer";
import ProfilePic from "../../components/profilePic/ProfilePic";
import { signOutUser } from "../../firebase/auth.firbase";
import { getAllPosts } from "../../firebase/firestore.firebase";

const HeaderSection = ({userData, isOwnProfile, posts}) => {
  return (
    <>
      <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        <ProfilePic
          source={userData.profilePicUrl}
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
        {userData.name}
      </Text>
      {isOwnProfile ? <Button title="logout" onPress={signOutUser} /> : <Button title="Follow" onPress={() => null} />}
    </>
  );
};

const ProfileScreen = () => {
  const user = null; //get selected user data here
  const userData = user || useSelector((state) => state.user);
  const isOwnProfile = !user;
  const deviceWidth = Dimensions.get("window").width;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getAllPosts((data) => 
      setPosts(data.filter((e => e.postData.uid === userData.uid))));
  }, []);

  const renderPost = ({item, index}) => {
    return <Image
    source={{ uri: item.postData.imageUrl }}
    resizeMode="cover"
    style={{ width: (deviceWidth - 34) / 3, height: (deviceWidth - 34) / 3, marginLeft: index % 3 ? 1 : 0, marginTop: 1}}
  />
  };
  

  return (
    <SafeAreaContainer style={styles.container}>
      <HeaderSection userData={userData} isOwnProfile={isOwnProfile} posts={posts}/>
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
    padding: 16,
    flex: 1,
  }
});
