import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Book } from '../models/Entity';


interface EntityItemProps {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
}
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EntityItem: React.FC<EntityItemProps> = ({ book, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{book.title}</Text>
      <Text>Author: {book.author}</Text>
      <Text>Genre: {book.genre}</Text>
      <Text>Quantity: {book.quantity}</Text>
      <Text>Nr reserved: {book.reserved}</Text>
      {/* <Text>
        {formatDate(new Date(book.date))}
      </Text>
      <Text>{book.notes}</Text>      
      <View style={styles.actions}> */} 
        {/* <Button title="Edit" onPress={onEdit} /> */}
        {/* <Button title="Delete" onPress={onDelete} color="red" /> */}
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
