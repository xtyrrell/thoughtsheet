import {
  IonContent,
  IonHeader,
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { Route, RouteComponentProps } from "react-router-dom";

import axios from "axios";

import NotesListPage from "./NotesListPage";

import NoteEditor from "../../components/NoteEditor/NoteEditor";

const notes = [
  {
    _id: "111",
    userId: "babba",
    title: "Plastic is Bad",
    body: "# Plastic is bad\n\nDid you know that??",
    tags: ["plastic", "bad"],
  },
  {
    _id: "222",
    userId: "babba",
    title: "Home Shopping",
    body: "# To buy:\n\n- Bin\n- Laundry Basket",
    tags: ["home", "shopping"],
  },
];

// const Notes: React.FC = () => {
const Notes: React.FC<RouteComponentProps> = ({ match }) => {
  // let match = { params: { noteId: "111" } };

  console.log("on notes page");
  console.log("match:", match);

  return (
    <IonPage>
      <IonRouterOutlet>
        <Route exact path="/notes" component={NotesListPage} />
        <Route path="/notes/:noteId" component={EditNotePage} />
      </IonRouterOutlet>
    </IonPage>
  );
};

const EditNotePage: React.FC<RouteComponentProps> = ({ match }) => {
  console.log("EditNotePage: match", match);

  const noteId = (match.params as any).noteId;

  const note = notes.find((note) => note._id === noteId);

  const [noteBody, setNoteBody] = useState(note.body);

  console.log(note);

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/notes" />
          </IonButtons>
          <IonTitle>Some Note</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <NoteEditor value={noteBody} onChange={(n) => setNoteBody(n)} />
      </IonContent>
    </IonPage>
  );
};

export default Notes;
