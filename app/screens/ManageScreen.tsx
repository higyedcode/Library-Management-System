import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { List, Snackbar } from 'react-native-paper';
import { useEntityContext } from '../context/TripContextServer';
import { Book } from '../models/Entity';
import ClientEntityItem from '../components/ClientEntityItem';
import Toast from 'react-native-toast-message';


type RootStackParamList = {
  HomeScreen: undefined;
  CreateScreen: undefined;
  ManageScreen: undefined;
};

type ManageScreenProps = StackScreenProps<RootStackParamList, 'ManageScreen'>

const ManageScreen: React.FC<ManageScreenProps> = ({ route, navigation }) => {
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [books, setbooks] = useState<Book[]>([]);
  const [reserved, setReserved] = useState<Book[]>([]);  
  const { entities, addEntity, updateEntity, deleteEntity, fetchReserved, reserveBook, borrowBook  } = useEntityContext();

  // useEffect(() => {
  //   // Fetch meal types from your data source
  //   const fetchMealTypes = async () => {
  //     const types = await fetchTypes(); // Replace with your data fetching logic
  //     setMealTypes(types);
  //   };

  //   fetchMealTypes();
  // }, []);

  useEffect(() => {  
    getReserved();
  }, []);

  
  const getReserved = async () => {    
    const reserved = await fetchReserved(); 
    setReserved(reserved);    
  };

  // const handleDelete = (id: number) => {
  //     Alert.alert('Confirm Delete', 'Are you sure you want to delete this trip?', [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Delete', onPress: () => {deleteEntity(id); getbooksByType(selectedType)} },
  //     ]);
  //   };

  const handleBorrow = async (id: number) => {
    try{
      console.log('Attempting to borrow book with id:', id);
        await borrowBook(id);
        console.log('Book borrowed successfully');
        await getReserved();
        console.log('Reserved books fetched');   
    }
    catch(e){
      console.log('Error borrowing book', e);

    }
  }
  const handleReserve = async (id: number) => {
    try{
      await reserveBook(id);
      await getReserved();
      console.log('Book Reserved');     
    }
    catch(e){
      console.log('Error reserving book', e);      
    }

    
  }
  return (
    <View style={styles.container}>
      <List.Accordion
        title="Available Books"
        left={props => <List.Icon {...props} icon="book" />}
      >
        <FlatList
        data={entities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ClientEntityItem
            book={item}
            version={1}
            onReserve={() => handleReserve(item.id)}  
            onBorrow={() => handleBorrow(item.id)}          
          />
        )}
      />
      </List.Accordion>      
        <View>
          <List.Accordion
            title="Reserved Books"
            left={props => <List.Icon {...props} icon="bookmark" />}
            >          
          <FlatList
            data={reserved}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ClientEntityItem
            book={item}
            version={2}
            onReserve={() => handleReserve(item.id)}  
            onBorrow={() => handleBorrow(item.id)}          
          />
            )}
          />
        </List.Accordion>
        </View>                    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default ManageScreen;