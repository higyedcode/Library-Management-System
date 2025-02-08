import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Meal } from '../models/Meal';

interface TripContextProps {
  trips: Meal[];
  addTrip: (trip: Meal) => void;
  updateTrip: (trip: Meal) => void;
  deleteTrip: (id: number) => void;
}

interface TripProviderProps {
  children: ReactNode;
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Meal[]>([
    { id: 1, name: 'Beach Vacation', location: 'Malibu', startDate: '2024-01-01', endDate: '2024-01-07', description: 'Relaxing by the beach.' },
    { id: 2, name: 'Ski Trip', location: 'Alps', startDate: '2024-02-10', endDate: '2024-02-20', description: 'Snowboarding fun!' },
  ]);

  const addTrip = (trip: Meal) => {
    setTrips((prevTrips) => [...prevTrips, trip]);
  };

  const updateTrip = (updatedTrip: Meal) => {
    setTrips((prevTrips) => prevTrips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)));
  };

  const deleteTrip = (id: number) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip }}>
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