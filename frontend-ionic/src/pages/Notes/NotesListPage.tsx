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
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";

function useNotes() {
  return useQuery("notes", async () => {
    const { data } = await axios.get(
      // "https://backend-api-m55qthxfka-ew.a.run.app/notes"
      "http://localhost:5000/notes"
    );
    return data;
  });
}

const NotesListPage: React.FC = () => {
  const { status, data: notes, error, isFetching } = useNotes();

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar>
          <IonTitle>My Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonFab
          vertical="bottom"
          horizontal="end"
          slot="fixed"
          // TODO: Implementing note creation
          onClick={(e) => console.log("Clicked!")}
        >
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonList>
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
                    // TODO: Implement note deletion
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
