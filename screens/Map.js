import React, { Component } from 'react';
import { Platform, Text, View, ActivityIndicator } from 'react-native';
import { MapView, Constants, Location, Permissions } from 'expo';
import { database } from '../firebase/index.js';

export default class Map extends Component {
 state = { location: { coords: {} }, errorMessage: null, markers: [] };

 componentWillMount() {
  if (Platform.OS === `android` && !Constants.isDevice) {
   this.setState({
    errorMessage: `this does not work on android emulator. use device to test this out!`,
   });
  } else {
   this._getLocationAsync();
  }
 }
 async componentDidMount() {
  let markers = await database.ref(`/potholes`).once(`value`);
  markers = markers.val();
  this.setState({ markers });
 }

 _getLocationAsync = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== `granted`) {
   this.setState({
    errorMessage: `Permission to access location was denied`,
   });
  }
  let location = await Location.getCurrentPositionAsync({});
  this.setState({ location });
 };

 handleLongPress = e => {
  database.ref(`/potholes`).push(e.nativeEvent.coordinate);
  this.setState({ hi: `hi` });
 };

 render() {
  let { latitude, longitude } = this.state.location.coords;
  let { errorMessage, markers } = this.state;
  return !errorMessage ? (
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
     {Object.keys(markers).map(key => (
      <MapView.Marker
       key={key}
       coordinate={markers[key]}
       title="My Marker"
       description="Some description"
       pinColor="red"
      />
     ))}
    </MapView>
   ) : (
    //conditionally renders if fetched location coordinates are still undefined
    <View>
     <ActivityIndicator size="large" color="#0000ff" />
     <Text>Loading Map...</Text>
    </View>
   )
  ) : (
   // conditionally renders if location permission is not granted
   <Text>{errorMessage}</Text>
  );
 }
}
