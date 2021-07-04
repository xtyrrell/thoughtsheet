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
import { useQuery } from "react-query";
import { Route, RouteComponentProps } from "react-router-dom";
import NoteEditor from "../../components/NoteEditor/NoteEditor";

// TODO: Factor this out into a types file (ideally shared between frontend and backed)
interface INote {
  body;
}

const getNoteById = async (id) => {
  const { data } = await axios.get(
    // "https://backend-api-m55qthxfka-ew.a.run.app/notes"
    `http://localhost:5000/notes/${id}`
  );
  return data;
};

function useNote(noteId) {
  return useQuery(["notes", noteId], () => getNoteById(noteId));
}

const EditNotePage: React.FC<RouteComponentProps> = ({ match }) => {
  // console.log("EditNotePage: match", match);

  const noteId = (match.params as any).noteId;

  const { status, data: note, error, isFetching } = useNote(noteId);

  const [noteBody, setNoteBody] = useState("");

  useEffect(() => {
    setNoteBody(note?.body || "");
    console.log("setting note body to, ", note?.body || "");
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

export default EditNotePage;
