import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CreateScreen from '../screens/CreateScreen';
import UpdateScreen from '../screens/UpdateScreen';
// import { EntityProvider } from '../context/TripContextDb';
import { EntityProvider } from '../context/TripContextServer';
import { Book } from '../models/Entity';
import Toast from 'react-native-toast-message';
import ManageScreen from '../screens/ManageScreen';
import ReportsScreen from '../screens/ReportsScreen';


// Define the stack parameter list
type RootStackParamList = {
  HomeScreen: undefined;
  CreateScreen: {
    onSave: (trip: Book) => void;
  };
  UpdateScreen: {
    trip: Book;
    onSave: (updatedTrip: Book) => void;
  };
  ManageScreen: undefined;
  ReportsScreen: undefined;
  
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <EntityProvider>      
        <Stack.Navigator 
          initialRouteName="HomeScreen"          
        >
          <Stack.Screen 
            name="HomeScreen" 
            component={HomeScreen} 
            options={{ title : 'Employee Section' }} 
          />
          <Stack.Screen 
            name="CreateScreen" 
            component={CreateScreen} 
            options={{ title: 'Add Book' }} 
          />
          <Stack.Screen 
            name="UpdateScreen" 
            component={UpdateScreen} 
            options={{ title: 'Edit Book' }} 
          />
          <Stack.Screen
          name="ManageScreen"
          component={ManageScreen}
          options={{ title: 'Client Section'}}
          />
          <Stack.Screen
          name="ReportsScreen"
          component={ReportsScreen}
          options={{ title: 'Reports'}}
          />
        </Stack.Navigator> 
        <Toast />     
    </EntityProvider>
  );
};

export default AppNavigator;