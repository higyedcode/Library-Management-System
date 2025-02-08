import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { Book } from '../models/Entity';
import { getEntities, addEntity, updateEntity, deleteEntity, initializeDatabase, copyEntities, clearEntitiesFromLocalDb } from '../database/db';
import { Alert, View, Text, StyleSheet, Button } from 'react-native';
import io from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { ActivityIndicator} from 'react-native';

type EntityContextType = {
  entities: Book[];
  addEntity: (entity: Book) => void;
  updateEntity: (entity: Book) => void;
  deleteEntity: (id: number) => void;
  fetchReserved: () => Promise<Book[]>;
  reserveBook: (id: number) => void;
  borrowBook: (id: number) => void;
};

export const EntityContext = createContext<EntityContextType | undefined>(undefined);

type EntityProviderProps = {
  children: ReactNode;
};

const API_URL = 'http://192.168.1.8:2429';
const socket = new WebSocket('ws://192.168.1.8:2429');


export const EntityProvider: React.FC<EntityProviderProps> = ({ children }) => {
  const [entities, setEntities] = useState<Book[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bannerMessage, setBannerMessage] = useState<string>('');

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDatabase();
        fetchEntities();
        checkConnectivityAndSync();        
                
        
      
          socket.onopen = () => {
            console.log('WebSocket connection opened');
          };
      
          socket.onmessage = (event) => {
            try {
              const parsedData = JSON.parse(event.data);
              console.log('Received message:', parsedData);
              handleSocketUpdate(parsedData);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          };
      
          socket.onclose = () => {
            console.log('WebSocket connection closed');
          };
      
          socket.onerror = (error) => {
            console.log('WebSocket error:', error);
          };
          
          console.log('entities initialized');
         
        
        
        
        
      } catch (error) {
        console.log('Error when initializing the entities', error);
        Alert.alert('Error when initializing the entities');
      }
    };

    initialize();

    const intervalId = setInterval(checkConnectivityAndSync, 10000);

    return () => {
      socket.close();
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      setIsSyncing(true);
      syncEntities();      
      setIsSyncing(false);            
      // clearEntitiesFromLocalDb();
    }
    else{           
      getEntitiesFromLocalDb().then((localentities) => setEntities(localentities));
    }
  }, [isOnline]);

  const checkConnectivityAndSync = async () => {    
    console.log('SERVER CHECKING...')        
    const state = await NetInfo.fetch();
    // console.log(state)
    if(state.isConnected)
    {
      console.log('Status: ONLINE, Internet Available')
      const serverIsOnline = await fetch(`${API_URL}/books`).then((res) => res.ok).catch(() => false);
      // console.log('Server is online:', serverIsOnline);
      if(serverIsOnline)
      {
        console.log('Device is online');
        setIsOnline(true);             
      }
      else{
        console.log('Server is offline')
        setBannerMessage('Server is Offline');
        setIsOnline(false);
      }
    }
    else
    {
      console.log('Status: OFFLINE, Internet NOT Available');
      setBannerMessage('No Internet Connection');
      setIsOnline(false);     
    } 
  };

  const syncEntities = async () => {
    try {      
      console.log('Syncing entities with server...');
      const localentities = await getEntitiesFromLocalDb();
      for (const entity of localentities) {
        await handleaddEntity(entity);
      }
      console.log('entities synced successfully');
      fetchEntities();
    } catch (error) {
      console.log('Error syncing entities:', error);
    }
  };

  const getEntitiesFromLocalDb = async (): Promise<Book[]> => {
    return new Promise((resolve, reject) => {
      getEntities((entities) => {
        resolve(entities);
      });
    });
  };

  const handleaddEntity = async (entity: Book) => {
    setLoading(true);
    if (isOnline) {
      try {
        console.log('Adding entity:', entity);
        const response = await fetch(`${API_URL}/book`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entity),
        });
        const data = await response.json();
        // also add to local database
        // if(!isSyncing){
        //   await addEntity(entity);
        // }        
        console.log('Entity added successfully:', data);
        

        
      } catch (error) {
        console.log('Error adding entity:', error);
      }
    } else {
      console.log('Device is offline, adding entity to local database:', entity);
      await addEntity(entity);
      getEntitiesFromLocalDb().then((localentities) => setEntities(localentities));
    }
    setLoading(false);
  };

  const handleupdateEntity = async (entity: Book) => {
    // setLoading(true);
    // if (isOnline) {
    //   try {
    //     console.log('Updating entity:', entity);
    //     const response = await fetch(`${API_URL}/entities/${entity.id}`, {
    //       method: 'PUT',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(entity),
    //     });
        
    //     const data = await response.json();
    //     setentities((preventities) => preventities.map((t) => (t.id === entity.id ? entity : t)));
    //     // also update in local database
    //     await updateEntity(entity);
    //     console.log('entity updated successfully:', data);
        
    //   } catch (error) {
    //     console.log('Error updating entity:', error);
    //   }
    // } else {
    //   console.log('Device is offline, updating entity in local database:', entity);
    //   await updateEntity(entity);
    //   // manual update here
    //   setentities((preventities) => preventities.map((t) => (t.id === entity.id ? entity : t)));
    //   getEntitiesFromLocalDb().then((localentities) => setentities(localentities));
    // }
    // setLoading(false);
  };

  const handledeleteEntity = async (id: number) => {
    setLoading(true);
    if (isOnline) {
      try {
        console.log('Deleting entity with id:', id);
        const response = await fetch(`${API_URL}/meal/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        // also delete from local database
        await deleteEntity(id);   
        
        // manual delete here
        setEntities((preventities) => preventities.filter((entity) => entity.id !== id));

        console.log('entity deleted successfully:', data);
                
      } catch (error) {
        console.log('Error deleting entity:', error);
      }
    } else {
      console.log('Device is offline, deleting entity from local database with id:', id);
      await deleteEntity(id);
      
      getEntitiesFromLocalDb().then((localentities) => setEntities(localentities));
    }
    setLoading(false);
  };



  const handleSocketUpdate = (entity: Book) => {
    Toast.show({
      type: 'success',
      text1: 'entity Added',
      text2: `entity "${entity.title}" was added successfully.`
    });
    console.log('Received socket data: '  + entity);

    fetchEntities();
    // add data to local db with returned id
    addEntity(entity);
  }

  const fetchEntities = async () => {
    setLoading(true);
    try {
      // if (!isOnline) {
        
      //   getEntitiesFromLocalDb().then((localentities) => setentities(localentities));
      //   return;

      // }
      console.log('Fetching entities from server...');
      const response = await fetch(`${API_URL}/books`);
      const data = await response.json();
      console.log('entities fetched successfully:', data);
      // data sorting
      data.sort((a: Book, b: Book) => a.quantity - b.quantity);
      data.sort((a: Book, b: Book) => a.genre.localeCompare(b.genre));        
      setEntities(data);
      

      // copy data to local db
      copyEntities(data);
    } catch (error) {
      console.log('Error fetching entities:', error);
    }
    setLoading(false);
  };

    const fetchReserved = async () => {
      if(!isOnline)
      {
       return entities.filter(book => book.reserved > 0) 

      }
      setLoading(true);
      try {
        console.log('Fetching reserved books from server...');
        const response = await fetch(`${API_URL}/reserved`);
        const data = await response.json();
        console.log('Reserved books fetched successfully:', data);
        setLoading(false);  
        return data
      } catch (error) {
      setLoading(false);
        console.log('Error fetching entities:', error);
      }
      
    };

    const reserveBook = async (id: number) => {
      if(!isOnline){
        Toast.show({
          type: 'error',
          text1: 'Error reserving book',
          text2: `Functionality not available while offline.`
        })
        return;
      }
      setLoading(true);
      try {
        console.log('Reserving a book from server...');
        const response = await fetch(`${API_URL}/reserve/${id}`, {method: 'PUT'});
        console.log('Response:', response);
        if(response.status === 404){
          const errorData = await response.json();
          throw new Error(errorData['text']);
        }

        const data = await response.json();
        console.log('Book Reserved successfully:', data);
        Toast.show({
                   type: 'success',
                   text1: 'Successful reservation',
                   text2: `Book with id "${id}" was reserved successfully.`
                 }); 
        //reload reserved books
        fetchEntities();
        setLoading(false);  
        return data
      } catch (error) {
        setLoading(false);
        console.log('Error reserving book:', error);
        Toast.show({
          type: 'error',
          text1: 'Error reserving book',
          text2: `${error}`
      });
      }
      
    };
    const borrowBook = async (id: number) => {
      if(!isOnline){
        Toast.show({
          type: 'error',
          text1: 'Error reserving book',
          text2: `Functionality not available while offline.`
        })
        return;
      }
      setLoading(true);
      try {
        console.log('Borrowing a book from server...');
        const response = await fetch(`${API_URL}/borrow/${id}`, {method: 'PUT'});
        console.log('Response:', response);
        if(response.status === 404){
          const errorData = await response.json();
          throw new Error(errorData['text']);
        }
        const data = await response.json();
        
        console.log('Book borrowed successfully:', data);
        Toast.show({
                   type: 'success',
                   text1: 'Successful borrowing',
                   text2: `Book with id "${id}" was borrowed successfully.`
                 }); 
        //reload reserved books
        fetchEntities();
        setLoading(false);  
        return data
      } catch (error) {
        setLoading(false);
        console.log('Error borrowing book:', error);
        Toast.show({
          type: 'error',
          text1: 'Error borrowing book',
          text2: `${error}`
      });
      }
      
    }

  return (
    <EntityContext.Provider value={{ entities, addEntity: handleaddEntity, updateEntity: handleupdateEntity, deleteEntity: handledeleteEntity, fetchReserved, reserveBook, borrowBook }}>
       {!isOnline && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{bannerMessage}</Text>                 
          <Button title="Retry" onPress={checkConnectivityAndSync}/>
        </View>
      )}
      {children}
      {loading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )}
    </EntityContext.Provider>
  );
};
const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export const useEntityContext = () => {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error('useEntityContext must be used within a entityProvider');
  }
  return context;
};