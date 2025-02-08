import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Book } from '../models/Entity';


interface ClientEntityItemProps {
  book: Book;
  version: number;
  onReserve: () => void;
  onBorrow: () => void;

}
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EntityItem: React.FC<ClientEntityItemProps> = ({ book, version, onReserve, onBorrow }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{book.title}</Text>
      <Text>{book.author}</Text>
      <Text>{book.genre}</Text>
      <Text>{book.reserved} reserved</Text>
      <Text>{book.quantity} available</Text>
      {/* <Text>{book.quantity}</Text>
      <Text>{book.reserved}</Text> */}
      {/* <Text>
        {formatDate(new Date(book.date))}
      </Text>
      <Text>{book.notes}</Text>      
      <View style={styles.actions}> */} 
        {/* <Button title="Reserve" onPress={onEdit} /> */}
        {(version == 1) && <Button title="Reserve" onPress={onReserve} color='red' />}
        {(version == 2) && <Button title="Borrow" onPress={onBorrow} color='green' />}
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 10, margin: 10, backgroundColor: '#f9f9f9', borderRadius: 8, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default EntityItem;
