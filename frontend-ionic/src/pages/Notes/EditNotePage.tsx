import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonSpinner,
} from "@ionic/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RouteComponentProps } from "react-router-dom";
import { useDebounce } from "use-debounce";
import NoteEditor from "../../components/NoteEditor/NoteEditor";

// TODO: Factor this out into a types file (ideally shared between frontend and backed)
interface INote {
  _id: string;
  title: string;
  body: string;
}

const getNoteById = async (id) => {
  const { data } = await axios.get(
    // `https://backend-api-m55qthxfka-ew.a.run.app/notes/${id}`
    `http://localhost:5000/notes/${id}`
  );
  return data;
};

function useNote(noteId) {
  const queryClient = useQueryClient();
  // queryClient.invalidateQueries();

  // if noteId is "new" we should save a new note
  if (noteId === "new") {
    console.log("useNote: noteId is 'new'!!");
    // return useMutation()
  }

  return useQuery(["notes", noteId], () => getNoteById(noteId), {
    // placeholderData: () =>
    //   (queryClient.getQueryData("notes") as INote[])?.find(
    //     (n) => n._id === noteId
    //   ),
  });
}

const EditNotePage: React.FC<RouteComponentProps> = ({ match }) => {
  // console.log("EditNotePage: match", match);

  const noteId = (match.params as any).noteId;

  // If noteId is passed:
  // grab the note from the server, display it, and setup autosave
  const { status, data: note, error, isFetching } = useNote(noteId);
  // else
  // Make a new note client-side, and setup autosave once it's been saved for the first time

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [debouncedNoteBody] = useDebounce<string>(noteBody, 500);

  const saveNoteMutation = useMutateNote(noteId);

  useEffect(() => {
    // if (debouncedNoteBody === "") return;

    // save note to db
    saveNoteMutation.mutate({
      title: noteTitle,
      body: noteBody,
    });
  }, [debouncedNoteBody]);

  useEffect(() => {
    setNoteBody(note?.body || "");
    setNoteTitle(note?.title || "");
    console.log("setting note state variables (body=", note?.body || "");
  }, [note]);

  // TODO: Add debounced saving of note when it's edited

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/notes" />
          </IonButtons>
          <IonTitle>{note?.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <NetworkStatusBar status={status} isFetching={isFetching} />
        {status === "loading" ? (
          <IonSpinner />
        ) : status === "error" ? (
          <span style={{ color: "red" }}>Error: {(error as any).message}</span>
        ) : (
          <NoteEditor value={noteBody} onChange={(n) => setNoteBody(n)} />
        )}
      </IonContent>
    </IonPage>
  );
};

const NetworkStatusBar: React.FC<{ status: string; isFetching: boolean }> = ({
  status,
  isFetching,
}) => (
  <div>
    NETWORK {status} {isFetching && <IonSpinner />}
  </div>
);

// ====

const updateNote = (noteId) => (note: Partial<INote>) =>
  axios.patch(
    // `https://backend-api-m55qthxfka-ew.a.run.app/notes/${noteId}`,
    `http://localhost:5000/notes/${noteId}`,
    note
  );

const useMutateNote = (noteId) => {
  const queryClient = useQueryClient();

  return useMutation(updateNote(noteId), {
    // Notice the second argument is the variables object that the `mutate` function receives

    onSuccess: (data, variables) => {
      queryClient.setQueryData(["note", { id: variables._id }], data);
    },
  });
};

//  ====

export default EditNotePage;
