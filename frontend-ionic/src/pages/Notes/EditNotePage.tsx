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
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { RouteComponentProps, useLocation } from "react-router-dom";

// TODO: Switch this to useDebounce from `rooks`
import { useDebounce } from "use-debounce";

import NoteEditor from "../../components/NoteEditor/NoteEditor";
import { getNoteById, updateNote, createNote } from "../../client/notes-client";
import { INote } from "../../client/interfaces";

function useNote(noteId, enabled = false) {
  const queryClient = useQueryClient();

  return useQuery<INote>(["note", noteId], () => getNoteById(noteId), {
    enabled, // TODO: REMOVE THIS AFTER DOING NOTE CREATION
    placeholderData: () =>
      (queryClient.getQueryData("notes") as INote[])?.find(
        (n) => n._id === noteId
      ) ?? { _id: noteId, title: "", body: "" },
  });
}

const EditNotePage: React.FC<RouteComponentProps> = ({ match }) => {
  const noteId = (match.params as any).noteId;

  const location = useLocation();
  const isNew = new URLSearchParams(location.search).get("new") != null;

  console.log("isNew", isNew);

  // If noteId is passed:
  // grab the note from the server, display it, and setup autosave
  const { status, data: note, error, isFetching } = useNote(noteId, !isNew);
  // else
  // Make a new note client-side, and setup autosave once it's been saved for the first time

  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [debouncedNoteBody] = useDebounce<string>(noteBody, 500);
  const [debouncedNoteTitle] = useDebounce<string>(noteTitle, 500);

  const updateNoteMutation = useUpdateNote(noteId);

  const [noteIsModified, setNoteIsModified] = useState(false);

  useEffect(() => {
    if (!noteIsModified) {
      console.log("exiting early; note has not been touched yet");
      return;
    }

    // console.log("saving latest version of noteBody", noteBody);
    console.log("saving latest version of noteTitle", noteTitle);

    // save note to db
    updateNoteMutation.mutate({
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
            />
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

const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation(createNote, {
    // Notice the second argument is the variables object that the `mutate` function receives

    onSuccess: (data, variables) => {
      const newNote = data.data;

      const oldNotes = queryClient.getQueryData("notes") as INote[];

      // console.log("updates 'notes' cache to ", notesWithUpdatedNote);

      if (oldNotes != null) {
        queryClient.setQueryData("notes", [...oldNotes, newNote]);
      }
    },
  });
};

const useUpdateNote = (noteId) => {
  const queryClient = useQueryClient();

  return useMutation(updateNote(noteId), {
    // Notice the second argument is the variables object that the `mutate` function receives

    onSuccess: (data, variables) => {
      const note = data.data as INote;

      // console.log("setting in cache at ['note', ", noteId, "] = ", newNote);
      queryClient.setQueryData(["note", noteId], note);

      const oldNotes = queryClient.getQueryData("notes") as INote[];

      const isNoteNew = !oldNotes?.find((n) => n._id === note._id);

      let notesWithUpdatedNote = oldNotes?.map((n) => {
        if (n._id !== noteId) return n;
        else return note;
      });

      if (oldNotes && isNoteNew) {
        notesWithUpdatedNote = [note, ...notesWithUpdatedNote];
      }

      // console.log("updates 'notes' cache to ", notesWithUpdatedNote);

      if (notesWithUpdatedNote) {
        queryClient.setQueryData("notes", notesWithUpdatedNote);
      }
    },
  });
};

//  ====

export default EditNotePage;
