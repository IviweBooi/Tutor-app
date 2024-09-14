import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { db, auth } from './firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; 

const { width } = Dimensions.get('window');

const WalletPage = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchWalletData = () => {
      const user = auth.currentUser;
      if (!user) {
        navigation.navigate('WelcomePage');
        return;
      }

      const email = user.email;
      if (email) {
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, where('email', '==', email));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              console.log('Fetched user data:', userData); // Log user data
              setBalance(userData.balance || 0);
              setTransactionHistory(userData.transactionHistory || []); 
            });
          } else {
            console.warn('No user details found for email:', email);
            setError('User details not found.');
          }
          setLoading(false);
        }, (error) => {
          console.error('Error fetching wallet details: ', error);
          setError('Failed to fetch wallet details.');
          setLoading(false);
        });
        
        return () => unsubscribe();
      } else {
        console.warn('No email associated with the current user.');
        setError('No email associated with the current user.');
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Processing...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Credit Balance</Text>
        <Text style={styles.balanceText}>R{balance}</Text>
      </View>

      <View style={styles.transactionContainer}>
        <Text style={styles.transactionTitle}>Transaction History</Text>
        {transactionHistory.length > 0 ? (
          transactionHistory.map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <Text style={styles.transactionText}>
                {transaction.description} - R{transaction.amount}
              </Text>
              <Text style={styles.transactionDate}>
                {new Date(transaction.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noTransactionsText}>No transactions available.</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.buttonText}>Deposit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="remove-circle" size={24} color="#fff" />
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="card" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Bank Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text" size={24} color="#fff" />
          <Text style={styles.buttonText}>Generate Statement</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  balanceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  transactionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  transactionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  transactionItem: {
    backgroundColor: '#E8F1FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionText: {
    fontSize: 16,
    color: '#4A90E2',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  noTransactionsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  actionsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    width: width * 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default WalletPage;
