import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Dashboard</Text>
      <Text style={styles.subtext}>En construcción...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  subtext: {
    color: '#888888',
    fontSize: 16,
    marginTop: 10,
  },
});
