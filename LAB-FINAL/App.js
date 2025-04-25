import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Экран входа
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Простая проверка - просто проверяем, что поля не пустые
    if (username.trim() && password.trim()) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход в приложение</Text>
      <TextInput
        style={styles.input}
        placeholder="Имя пользователя"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleLogin} />
    </View>
  );
};

// Главный экран
const HomeScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([
    { id: '1', title: 'Первая заметка', content: 'Это содержание первой заметки' },
    { id: '2', title: 'Вторая заметка', content: 'Это содержание второй заметки' },
  ]);

  const handleAddNote = (newNote) => {
    setNotes([...notes, newNote]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои заметки</Text>
      <Button
        title="Добавить заметку"
        onPress={() => navigation.navigate('CreateNote', { onAddNote: handleAddNote })}
      />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteItem}
            onPress={() => navigation.navigate('NoteDetails', { note: item })}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Экран создания заметки
const CreateNoteScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title,
        content,
      };
      route.params.onAddNote(newNote);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новая заметка</Text>
      <TextInput
        style={styles.input}
        placeholder="Заголовок"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Содержание"
        multiline
        value={content}
        onChangeText={setContent}
      />
      <Button title="Сохранить" onPress={handleSave} />
    </View>
  );
};

// Экран деталей заметки
const NoteDetailsScreen = ({ route }) => {
  const { note } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.detailTitle}>{note.title}</Text>
      <Text style={styles.detailContent}>{note.content}</Text>
    </View>
  );
};

// Основной компонент приложения
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Вход' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Мои заметки' }} />
        <Stack.Screen
          name="CreateNote"
          component={CreateNoteScreen}
          options={{ title: 'Новая заметка' }}
        />
        <Stack.Screen
          name="NoteDetails"
          component={NoteDetailsScreen}
          options={{ title: 'Детали заметки' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  multilineInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  noteItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteTitle: {
    fontSize: 18,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default App;