import { useQuery } from "react-query";

import axios from "axios";
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
  IonSpinner,
} from "@ionic/react";

function useNotes() {
  return useQuery("notes", async () => {
    const { data } = await axios.get("http://localhost:5000/notes");
    return data;
  });
}

const NotesListPage: React.FC = () => {
  const { status, data: notes, error, isFetching } = useNotes();

  console.log("NotesListPage: useNotes status", status);

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar>
          <IonTitle>My Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {/* TODO: Add loader when notes are loading */}
          {status === "loading" ? (
            <IonSpinner />
          ) : status === "error" ? (
            <span>Error: {(error as any).message}</span>
          ) : (
            notes.map((note) => (
              <IonItemSliding key={note._id}>
                <IonItem routerLink={`/notes/${note._id}`}>
                  <IonLabel>{note.title}</IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption
                    onClick={() => alert("Do you want to delete this?")}
                  >
                    Delete
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default NotesListPage;