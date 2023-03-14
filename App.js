import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const apiKey = '0ed7ba15154fe0fb60857c4649cc8604';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${apiKey}`
      )
        .then(response => response.json())
        .then(data => {
          setWeather(data);
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${apiKey}`
          )
            .then(response => response.json())
            .then(data => setForecast(data.list))
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    })();
  }, []);

  const renderItem = ({ item }) => {
    // const iconurl = item.weather[0].icon
    //   ? `http://openweathermap.org/img/w/${item.weather[0].icon}.png` // j'ai fais sa mais sa marche pas pour tous donc bizzare
    //   : '';
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    const time = date.toLocaleTimeString(undefined, { timeStyle: 'short' });

    return (
      <View style={styles.card}>
        <Text style={styles.date}>
          {day}, {time}
        </Text>
        <Text style={styles.temperature}>{item.main.temp}°C</Text>
        {/* <Image style={styles.icon} source={{ uri: iconurl }} /> */}
        <Text style={styles.title}>{item.weather[0].main}</Text>
        <Text style={styles.description}>{item.weather[0].description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {weather && (
        <View style={styles.card}>
          <Text style={styles.temperature}>{weather.name}</Text>
          <Text style={styles.temperature}>{weather.main.temp}°C</Text>
          {/* <Image style={styles.icon} source={{ uri: iconurl }} /> */}
          <Text style={styles.title}>{weather.weather[0].main}</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>
        </View>
      )}
      {forecast && (
        <FlatList
          data={forecast}
          keyExtractor={item => item.dt.toString()}
          renderItem={renderItem}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
})