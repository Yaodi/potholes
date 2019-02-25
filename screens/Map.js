import React, { Component } from 'react';
import { Platform, Text, View, ActivityIndicator } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';

export default class Map extends Component {
 state = { location: { coords: {} }, errorMessage: null };

 componentWillMount() {
  if (Platform.OS === `android` && !Constants.isDevice) {
   this.setState({
    errorMessage: `this does not work on android emulator. use device to test this out!`,
   });
  } else {
   this._getLocationAsync();
  }
 }

 _getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  console.log(status, `status`);
  if (status !== `granted`) {
   this.setState({
    errorMessage: `Permission to access location was denied`,
   });
  }
  let location = await Location.getCurrentPositionAsync({});
  this.setState({ location });
 };

 handleLongPress(e) {
  console.log(`longpress`, e.nativeEvent);
 }

 render() {
  let { latitude, longitude } = this.state.location.coords;
  console.log(`TCL: Map -> render -> latitude`, latitude);
  console.log(`TCL: Map -> render -> longitude`, longitude);
  console.log(this.state.errorMessage, `lkdsfj`);
  return !this.state.errorMessage ? (
   latitude ? (
    <MapView
     style={{ flex: 1 }}
     region={{
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.0025,
     }}
     onLongPress={this.handleLongPress}
    >
     <MapView.Marker
      coordinate={this.state.location.coords}
      title="My Marker"
      description="Some description"
      pinColor="blue"
     />
    </MapView>
   ) : (
    //conditionally renders if fetched location coordinates are still undefined
    <View>
     <ActivityIndicator size="large" color="#0000ff" />
     <Text>Loading Map...</Text>
    </View>
   )
  ) : (
   <Text>{this.state.errorMessage}</Text>
  );
 }
}
