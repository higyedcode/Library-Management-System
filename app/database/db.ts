import * as SQLite from 'expo-sqlite';
import { Book } from '../models/Entity';
import { Alert } from 'react-native';




export const initializeDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('library.db');
        db.execAsync(
            `CREATE TABLE IF NOT EXISTS books (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              author TEXT NOT NULL,
              genre TEXT NOT NULL,
              quantity INTEGER NOT NULL,
              reserved INTEGER NOT NULL
            );`);
            console.log('Table created successfully')        
};

export const getEntities = async (notify: (books: Book[]) => void) => {
  const db = await SQLite.openDatabaseAsync('library.db');  
    const books: Book[] = await db.getAllAsync('SELECT * FROM books');    
    notify(books)
    console.log("books were retrieved successfully from database!")
    // console.log("books were retrieved successfully from database! - " + JSON.stringify(books))
  
    db.closeAsync()
};

export const entityExists = async (id: number) => {
  console.log('Checking if entity exists...' + id)
  const db = await SQLite.openDatabaseAsync('library.db');
  const foundEntity: Book | null = await db.getFirstAsync('SELECT * FROM books WHERE id = ?', id);
  
  db.closeAsync()
  if (foundEntity === null) {
    console.log('Entity does not exist')
    return false;
  }
  else{
    console.log('Entity exists')
    return true;
  }  
}

export const findLocalDbEntity = async (entity: Book) => {
  console.log('Finding entity in local db...' + entity.id)
  const db = await SQLite.openDatabaseAsync('library.db');
  // find after all properties besides id
  const foundEntity = await db.getFirstAsync('SELECT * FROM books WHERE title = ? AND author = ? AND genre = ? AND quantity = ? AND reserved = ?', entity.title, entity.author, entity.genre, entity.quantity, entity.reserved);
  
  db.closeAsync()
  if (foundEntity === null) {
    console.log('Entity does not exist')
    return null;
  }
  else{
    console.log('Entity exists')
    return foundEntity;
  }  
}


export const addEntity = async (Entity: Book) => {
  if (Entity.id == null)
  {
    console.log("Entity id is null, adding AUTOINCREMENT id")
    const db = await SQLite.openDatabaseAsync('library.db');  
    const result = await db.runAsync(
        'INSERT INTO books (title, author, genre, quantity, reserved) VALUES (?, ?, ?, ?, ?)',
         Entity.title, Entity.author, Entity.genre, Entity.quantity, Entity.reserved)                
    // insert id constant to cause an error
      console.log("Add successful: ", result.lastInsertRowId, result.changes);            
    db.closeAsync() 
    return;
  }

  if (await entityExists(Entity.id))
  {    
    return;
  }
  if (await findLocalDbEntity(Entity))
  {
    // upquantity the entity's id in local db
    const db = await SQLite.openDatabaseAsync('library.db');  
    await db.runAsync('UPquantity books SET id = ? WHERE title = ? AND author = ? AND genre = ? AND quantity = ? AND reserved = ?;', Entity.id, Entity.title, Entity.author, Entity.genre, Entity.quantity, Entity.reserved)

  }
  const db = await SQLite.openDatabaseAsync('library.db');  
  
  try{
    const result = await db.runAsync(
      'INSERT INTO books (id, title, author, genre, quantity, reserved) VALUES (?, ?, ?, ?, ?, ?)',
       Entity.id, Entity.title, Entity.author, Entity.genre, Entity.quantity, Entity.reserved)                
       
            console.log("Add successful: ", result.lastInsertRowId, result.changes);              
  }
  catch (error) {
    console.log("Error adding entity: " + error)
  }
  
    db.closeAsync()
};

export const updateEntity = async (Entity: Book) => {

  const db = await SQLite.openDatabaseAsync('library.db');
  
        await db.runAsync(
            'UPDATE books SET title = ?, author = ?, genre = ?, quantity = ?, reserved = ? WHERE id = ?;',
            Entity.title, Entity.author, Entity.genre, Entity.quantity, Entity.reserved, Entity.id)
          console.log('Data updated succesfully')
    await db.closeAsync()  
};

export const deleteEntity = async (id: number) => {
  const db = await SQLite.openDatabaseAsync('library.db');
  // have to sincronize the id of localdb with the id of the server db
  console.log('Deleting object with id from LOCAL DB: ' + id)
  await db.runAsync(
      'DELETE FROM books WHERE id = ?;',
      id)
      console.log("Successfully deleted object")  
    await db.closeAsync()  
};

export const clearEntitiesFromLocalDb = async () =>  {
  const db = await SQLite.openDatabaseAsync('library.db');
  await db.runAsync('DELETE FROM books');
  console.log("Successfully cleared table")
  await db.closeAsync()
}

export const copyEntities = async (books: Book[]) => {
  console.log("!!! Copying books to local db " + books.length)  
for (let index = 0; index < books.length; index++) 
{    
  await addEntity(books[index])

}
}