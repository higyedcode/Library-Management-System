import React, { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { Meal } from '../models/Meal';
import { getTrips, addTrip, updateTrip, deleteTrip, initializeDatabase } from '../database/db';
import { Alert } from 'react-native';

type TripContextType = {
  trips: Meal[];
  addTrip: (trip: Meal) => void;
  updateTrip: (trip: Meal) => void;
  deleteTrip: (id: number) => void;
};

export const TripContext = createContext<TripContextType | undefined>(undefined);

type TripProviderProps = {
  children: ReactNode;
};

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Meal[]>([]);

  useEffect(() => {
    try{
      initializeDatabase();
      fetchTrips();
      console.log("Trips initialised")
    }
    catch(error)
    {
      console.log("Error when initialising the trips ", error)
      Alert.alert("Error when initialising the trips ".split("Error code ‼")[1])
    }
    
  }, []);

  const fetchTrips = async () => {
   try{    
    await getTrips((fetchedTrips) => {
      setTrips(fetchedTrips);
    });
  }
  catch(error)
  {
    console.log("Error when fetching the trips ", error)
    Alert.alert("Error when fetching the trips ".split("Error code ‼")[1])
  }
  };

  const handleAddTrip = async (trip: Meal) => {
    try{
      await addTrip(trip);
    setTrips((prevTrips) => [...prevTrips, trip]);
  }
  catch(error)
  {
    
      console.log("Error when adding the trip ", error)
      Alert.alert("Error when adding the trip ")    
  }
  };

  const handleUpdateTrip = async (updatedTrip: Meal) => {
    try{
      await updateTrip(updatedTrip);
    setTrips((prevTrips) => prevTrips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
  }
  catch(error)
  {
    console.log("Error when updating the trips ", error)
    Alert.alert("Error when updating the trips ")
  }
  };

  const handleDeleteTrip = async (id: number) => {
    try{
      await deleteTrip(id);
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
  }
  catch(error)
  {
    console.log("Error when deleting the trip ", error)
    Alert.alert("Error when deleting the trip ")
  }
  };

  return (
    <TripContext.Provider value={{ trips, addTrip: handleAddTrip, updateTrip: handleUpdateTrip, deleteTrip: handleDeleteTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};