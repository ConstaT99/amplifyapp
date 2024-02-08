import React, {useEffect, useState} from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {generateClient} from "aws-amplify/api";
import {getUrl, remove, uploadData} from "aws-amplify/storage"
import {Button, Flex, Heading, Image, Text, TextField, View, withAuthenticator,} from "@aws-amplify/ui-react";
import {listNotes} from "./graphql/queries";
import {deleteNote as deleteNoteMutation,} from "./graphql/mutations";
import {fetchAuthSession, getCurrentUser} from 'aws-amplify/auth'
import {invoke} from "./myInvoke";

const client = generateClient();

const App = ({ signOut }) => {
    const [notes, setNotes] = useState([]);
    useState(null);
    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        const apiData = await client.graphql({ query: listNotes });
        let notesFromAPI = apiData.data.listNotes.items;
        let credentials = await fetchAuthSession();
        let currentUser = await getCurrentUser(credentials)
        console.log(notesFromAPI)
        notesFromAPI = notesFromAPI.filter((notesFromAPI) => notesFromAPI.owner === currentUser.username)
        await Promise.all(
            notesFromAPI.map(async (note) =>{
                if( note.image){
                    note.image = (await getUrl({key: note.name, options: {accessLevel: 'guest'}})).url;
                }

                return note;
            })
        );
        setNotes(notesFromAPI);
    }
    async function createNote(event) {
        event.preventDefault();
        const form = new FormData(event.target);
        const image = form.get("image");
        let credentials = await fetchAuthSession();
        let currentUser = await getCurrentUser(credentials)
        console.log(currentUser)
        const data = {
            name: form.get("name"),
            description: form.get("description"),
            image : image.name,
            owner: currentUser.username,
        };

        if(!!data.image) await uploadData({ key : data.name,data : image, options: { accessLevel: 'guest'}});

        await fetchAuthSession()
            .then(async credentials => {
                return await invoke('limitNotes-staging', JSON.stringify(data), credentials);
            })
        // console.log(temp)

        // eslint-disable-next-line no-restricted-globals
        // location.replace(location)
        await fetchNotes();
        event.target.reset();
    }

    async function deleteNote({ id }) {
        const newNotes = notes.filter((note) => note.id !== id);
        const currNotes = notes.filter((note) => note.id === id)
        if(!(currNotes[0].image === null || currNotes[0].image === "")){
            await remove({key: currNotes[0].name, options: { accessLevel: 'guest'}})
        }
        setNotes(newNotes)
        await client.graphql({
            query: deleteNoteMutation,
            variables: { input: { id } },
        });
    }

    return (
        <View className="App">
            <Heading level={1}>My Notes App</Heading>
            <View as="form" margin="3rem 0" onSubmit={createNote}>
                <Flex direction="row" justifyContent="center">
                    <TextField
                        name="name"
                        placeholder="Note Name"
                        label="Note Name"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <TextField
                        name="description"
                        placeholder="Note Description"
                        label="Note Description"
                        labelHidden
                        variation="quiet"
                        required
                    />
                    <View
                        name="image"
                        as="input"
                        type="file"
                        style={{ alignSelf: "end" }}
                    />
                    <Button type="submit" variation="primary">
                        Create Note
                    </Button>
                </Flex>
            </View>
            <Heading level={2}>Current Notes</Heading>
            <View margin="3rem 0">
                {notes.map((note) => (
                    <Flex
                        key={note.id || note.name}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text as="strong" fontWeight={700}>
                            {note.name}
                        </Text>
                        <Text as="span">{note.description}</Text>
                        {note.image && (
                            <Image
                                src={note.image}
                                alt={`visual aid for ${notes.name}`}
                                style={{ width: 400 }}
                            />
                        )}
                        <Button variation="link" onClick={() => deleteNote(note)}>
                            Delete note
                        </Button>
                    </Flex>
                ))}
            </View>
            <Button onClick={signOut}>Sign Out</Button>
        </View>
    );
};

export default withAuthenticator(App);