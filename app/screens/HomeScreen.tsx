import React, { useEffect } from 'react';
import { View, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { useEntityContext } from '../context/TripContextServer';
import { Book } from '../models/Entity';
import { StackScreenProps } from '@react-navigation/stack';
import EntityItem from '../components/EntityItem';
import { List } from 'react-native-paper';

type RootStackParamList = {
  HomeScreen: undefined,
  CreateScreen: {
    onSave : (trip: Book) => void
  },
  UpdateScreen : {
    trip: Book,
    onSave: (updatedTrip: Book) => void
  },
  ManageScreen: undefined,
  ReportsScreen: undefined

}

type HomeScreenProps = StackScreenProps<RootStackParamList, 'HomeScreen'>

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { entities, addEntity, updateEntity, deleteEntity } = useEntityContext();

  

  const handleDelete = (id: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this trip?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteEntity(id) },
    ]);
  };

  const handleCreate = () => {
    navigation.navigate('CreateScreen', {
      onSave: (trip: Book) => {
        addEntity(trip);
      },
    });
  };

  const handleEdit = (trip: Book) => {
    navigation.navigate('UpdateScreen', {
      trip,
      onSave: (updatedTrip: Book) => {
        updateEntity(updatedTrip);
      },
    });
  };

  return (
    <View style={styles.container}>   
     <List.Accordion
        title="Menu"
        left={props => <List.Icon {...props} icon="menu" />}
      >
        <List.Item title="Employee Section" onPress={() => navigation.navigate('HomeScreen')} />
        <List.Item title="Client Section" onPress={() => navigation.navigate('ManageScreen')} />
        {/* <List.Item title="Reports" onPress={() => navigation.navigate('ReportsScreen')} />
          <List.Item title="Profile" onPress={() => console.log('Settings')} /> */}
      </List.Accordion>   
      <FlatList
        data={entities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EntityItem
            book={item}
            onDelete={() => handleDelete(item.id)}
            onEdit={() => handleEdit(item)}
          />
        )}
      />
      <Button title="Add Book" onPress={handleCreate} />            
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1, // Takes up full screen height
    justifyContent: 'space-between', // Distributes space between items
  },
});

export default HomeScreen;