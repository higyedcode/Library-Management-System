import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { List } from 'react-native-paper';
import { useEntityContext } from '../context/TripContextServer';
import { Book } from '../models/Entity';

const ReportsScreen = () => {
  const [topMeals, setTopMeals] = useState<Book[]>([]);
  const [caloriesByType, setCaloriesByType] = useState<{[key: string]: number}>({});
  const [mealHistory, setMealHistory] = useState<Book[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { entities } = useEntityContext();
  const [showStartdatePicker, setShowStartdatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  

  const getTopMeals = async () => {
    
    return entities
      .sort((a, b) => b.calories - a.calories)
      .slice(0, 10);
  
}

const getCaloriesByType = async () => {  
  return entities
    .reduce((acc: { [key: string]: number }, meal) => {
      if (acc[meal.type]) {
        acc[meal.type] += meal.calories;
      } else {
        acc[meal.type] = meal.calories;
      }
      return acc;
    }, {});
}

const getMealHistory = async (startDate: Date, endDate: Date) => {
    return entities
        .filter((meal) => new Date(meal.date) >= startDate && new Date(meal.date) <= endDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}



  useEffect(() => {
    // Fetch top 10 meals from your data source
    const fetchTopMeals = async () => {
      const meals = await getTopMeals(); // Replace with your data fetching logic
      setTopMeals(meals);
    };

    // Fetch total number of calories for each meal type
    const fetchCaloriesByType = async () => {
      const calories = await getCaloriesByType(); // Replace with your data fetching logic
      setCaloriesByType(calories);
    };

    fetchTopMeals();
    fetchCaloriesByType();
  }, []);

  const fetchMealHistory = async () => {
    // Fetch meal history for the selected date range from your data source
    const history = await getMealHistory(startDate, endDate); // Replace with your data fetching logic
    setMealHistory(history);
  };

  return (
    <View style={styles.container}>
       <List.Accordion
        title="Top 10 Meals"
        left={props => <List.Icon {...props} icon="food" />}
      >
      <FlatList
        data={topMeals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text>{item.name}</Text>
            <Text>{item.calories} calories</Text>
          </View>
        )}
      />
        </List.Accordion>

      
      <List.Accordion title="Total Calories by Type" left={props => <List.Icon {...props} icon="chart-bar" />}>
      <FlatList
        data={Object.entries(caloriesByType).map(([type, totalCalories]) => ({ type, totalCalories }))}
        keyExtractor={(item) => item.type}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text>{item.type}</Text>
            <Text>{item.totalCalories} calories</Text>
          </View>
        )}
      />
      </List.Accordion>

      <List.Accordion title="Meal History" left={props => <List.Icon {...props} icon="history" />}>
      <View style={styles.datePicker}>
        <Text>Start Date:</Text>        
      <TouchableOpacity onPress={() => setShowStartdatePicker(true)}>
        <TextInput style={styles.input} value={formatDate(startDate)} editable={false} />
      </TouchableOpacity>
      {showStartdatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartdatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      </View>
      <View style={styles.datePicker}>
        <Text>End Date:</Text>        
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <TextInput style={styles.input} value={formatDate(endDate)} editable={false} />
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}
      </View>
      <Button title="Fetch Meal History" onPress={fetchMealHistory} />
      <FlatList
        data={mealHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (            
          <View style={styles.mealItem}>    
            <Text>{item.name}</Text>
            <Text>{item.type}</Text>
            <Text>{item.date}</Text>            
            <Text>{item.calories} calories</Text>
          </View>
        )}
      />
        </List.Accordion>
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
  datePicker: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,    
  },

});

export default ReportsScreen;