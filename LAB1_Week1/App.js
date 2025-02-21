import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();


export default function App() {
return (
<NavigationContainer>
<Stack.Navigator initialRouteName="Home">
<Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen name="CreateNote" component={CreateNoteScreen} />
<Stack.Screen name="NoteDetails" component={NoteDetailsScreen} />
</Stack.Navigator>
</NavigationContainer>
);
}

function HomeScreen({ navigation, route }) {
const [notes, setNotes] = useState([]);

// Load any stored notes when HomeScreen first mounts
useEffect(() => {
loadNotesFromStorage();
}, []);

// If we come from CreateNoteScreen with a new note, add it to notes
useEffect(() => {
if (route.params?.newNote) {
setNotes((prev) => [...prev, route.params.newNote]);
}
}, [route.params?.newNote]);

// If we come back with an updated note, replace the old one in notes
useEffect(() => {
if (route.params?.updatedNote) {
setNotes((prev) =>
prev.map((note) =>
note.id === route.params.updatedNote.id ? route.params.updatedNote : note
)
);

}
}, [route.params?.updatedNote]);

// If we come back with a note ID to delete, remove that note
useEffect(() => {
if (route.params?.deleteNoteId) {
setNotes((prev) => prev.filter((note) => note.id !== route.params.deleteNoteId));
}
}, [route.params?.deleteNoteId]);

// Each time notes change, save them to AsyncStorage
useEffect(() => {
saveNotesToStorage(notes);
}, [notes]);

// Retrieve notes from AsyncStorage
async function loadNotesFromStorage() {
try {
const storedData = await AsyncStorage.getItem('NOTES_DATA');
if (storedData) {
setNotes(JSON.parse(storedData));
}
} catch (error) {
console.log('Error loading notes:', error);
}
}

// Save notes to AsyncStorage
async function saveNotesToStorage(notesArray) {
try {
await AsyncStorage.setItem('NOTES_DATA', JSON.stringify(notesArray));

} catch (error) {
console.log('Error saving notes:', error);
}
}

// Navigate to note details when a note is tapped
function goToDetails(note) {
navigation.navigate('NoteDetails', { note });
}

return (
<View style={styles.container}>
<Text style={styles.title}>My Notes</Text>

{notes.length === 0 ? (
<Text style={styles.subtitle}>No notes yet. Create one!</Text>
) : (
<FlatList
data={notes}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<TouchableOpacity
style={styles.noteItem}
onPress={() => goToDetails(item)}
>
<Text style={styles.noteText}>{item.title}</Text>
</TouchableOpacity>
)}
/>
)}

<Button
title="Create a New Note"
onPress={() => navigation.navigate('CreateNote')}
/>
</View>
);
}

function CreateNoteScreen({ navigation, route }) {
// If we passed a note in route.params, that means we're editing
const existingNote = route.params?.note;

// Title state: either existing note title or empty
const [title, setTitle] = useState(existingNote ? existingNote.title : '');

function saveNote() {
if (title.trim().length === 0) {
alert('Please enter a note title!');
return;
}

if (existingNote) {

// Editing existing note
const updatedNote = { ...existingNote, title };
navigation.navigate('Home', { updatedNote });
} else {
// Creating a new note
const newNote = {
id: Date.now().toString(),
title,
};
navigation.navigate('Home', { newNote });
}
}

return (
<View style={styles.container}>
<Text style={styles.title}>
{existingNote ? 'Edit Note' : 'Create a New Note'}
</Text>
<TextInput
style={styles.input}
placeholder="Note Title"
value={title}
onChangeText={(text) => setTitle(text)}
/>
<Button title="Save" onPress={saveNote} />
</View>
);
}

function NoteDetailsScreen({ navigation, route }) {
// The note we tapped on in Home
const { note } = route.params;

function editNote() {
// Navigate to create/edit screen with this note
navigation.navigate('CreateNote', { note });
}

function deleteNote() {
// Send deleteNoteId back to Home
navigation.navigate('Home', { deleteNoteId: note.id });
}

return (
<View style={styles.container}>
<Text style={styles.title}>Note Details</Text>
<Text style={{ fontSize: 18, marginBottom: 20 }}>{note.title}</Text>

<Button title="Edit Note" onPress={editNote} />
<View style={{ marginTop: 10 }}>
<Button title="Delete Note" color="red" onPress={deleteNote} />
</View>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 16,
alignItems: 'center',
backgroundColor: '#fff',
justifyContent: 'flex-start',

},
title: {
fontSize: 22,
marginVertical: 10,
},
subtitle: {
marginBottom: 10,
color: 'gray',
},
noteItem: {
backgroundColor: '#c2f9ff',
padding: 10,
marginVertical: 5,
borderRadius: 6,
width: 300,
},
noteText: {
fontSize: 16,
},
input: {
borderWidth: 1,
borderColor: '#ccc',
width: '90%',
padding: 8,
marginVertical: 10,
borderRadius: 4,
},
});
