import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';

const WalletPage = () => {
  const [balance] = useState(1000);
  const [transactions] = useState([
    { tutorName: 'Mnelisi Mabuza', amount: 200, date: '2024-08-14' },
    { tutorName: 'Jane Doe', amount: 150, date: '2024-08-13' },
  ]);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+123456789');

  const handleSaveProfile = () => {
    Alert.alert('Profile Updated', 'Your contact information has been updated.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Wallet Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet Information</Text>
        <Text style={styles.balance}>Balance: {balance} units</Text>
        <Text style={styles.transactionsTitle}>Transaction History:</Text>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <Text key={index} style={styles.transaction}>
              {transaction.date} - {transaction.tutorName} - {transaction.amount} units
            </Text>
          ))
        ) : (
          <Text style={styles.noTransactions}>No transactions yet.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Button title="Save Profile" onPress={handleSaveProfile} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  balance: {
    fontSize: 18,
    marginBottom: 10,
  },
  transactionsTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  transaction: {
    fontSize: 16,
    marginBottom: 5,
  },
  noTransactions: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default WalletPage;
