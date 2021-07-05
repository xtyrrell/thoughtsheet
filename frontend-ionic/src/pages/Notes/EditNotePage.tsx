import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonSpinner,
  IonInput,
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

  // TODO: Implement note creation
  // if noteId is "new" we should save a new note
  if (noteId === "new") {
    console.log("useNote: noteId is 'new'!!");
    // return useMutation()
  }

  return useQuery(["notes", noteId], () => getNoteById(noteId), {
    placeholderData: () =>
      (queryClient.getQueryData("notes") as INote[])?.find(
        (n) => n._id === noteId
      ),
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
  const [debouncedNoteTitle] = useDebounce<string>(noteTitle, 500);

  const saveNoteMutation = useMutateNote(noteId);

  const [noteIsModified, setNoteIsModified] = useState(false);

  useEffect(() => {
    if (!noteIsModified) {
      console.log("exiting early; note has not been touched yet");
      return;
    }

    // console.log("saving latest version of noteBody", noteBody);
    console.log("saving latest version of noteTitle", noteTitle);

    // save note to db
    saveNoteMutation.mutate({
      title: noteTitle,
      body: noteBody,
    });
  }, [debouncedNoteBody, debouncedNoteTitle]);

  useEffect(() => {
    if (noteIsModified) {
      console.log(
        "not going to setNoteBody because note has already been modified"
      );
      return;
    }

    setNoteBody(note?.body || "");
    setNoteTitle(note?.title || "");
  }, [note]);

  // TODO: Add debounced saving of note when it's edited

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/notes" />
          </IonButtons>
          <IonTitle>
            <IonInput
              value={noteTitle}
              placeholder="Enter note title"
              onIonChange={(e) => {
                setNoteIsModified(true);
                setNoteTitle(e.detail.value!);
              }}
            ></IonInput>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <NetworkStatusBar status={status} isFetching={isFetching} />
        {status === "loading" ? (
          <IonSpinner />
        ) : status === "error" ? (
          <span style={{ color: "red" }}>Error: {(error as any).message}</span>
        ) : (
          <NoteEditor
            value={noteBody}
            placeholder="Enter note body (you can format with markdown)"
            onChange={(n) => {
              setNoteIsModified(true);
              setNoteBody(n);
            }}
          />
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

const updateNote = (noteId) => (note: Partial<INote>) => {
  console.log(`updateNote(${noteId}) with note`, note);
  return axios.patch(
    // `https://backend-api-m55qthxfka-ew.a.run.app/notes/${noteId}`,
    `http://localhost:5000/notes/${noteId}`,
    note
  );
};

const useMutateNote = (noteId) => {
  const queryClient = useQueryClient();

  return useMutation(updateNote(noteId), {
    // Notice the second argument is the variables object that the `mutate` function receives

    onSuccess: (data, variables) => {
      const newNote = data.data as INote;

      // console.log("setting in cache at ['notes', ", noteId, "] = ", newNote);
      queryClient.setQueryData(["notes", noteId], newNote);

      const oldNotes = queryClient.getQueryData("notes") as INote[];
      const notesWithUpdatedNote = oldNotes?.map((n) => {
        if (n._id !== noteId) return n;
        else return newNote;
      });

      // console.log("updates 'notes' cache to ", notesWithUpdatedNote);

      if (notesWithUpdatedNote) {
        queryClient.setQueryData("notes", notesWithUpdatedNote);
      }
    },
  });
};

//  ====

export default EditNotePage;
