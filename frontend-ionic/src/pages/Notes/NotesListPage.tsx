import { useQuery, useQueryClient } from "react-query";

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

import { ObjectId } from "../../utils/object-id";
import { RouteComponentProps } from "react-router";

function useNotes() {
  return useQuery("notes", async () => {
    const { data } = await axios.get(
      // "https://backend-api-m55qthxfka-ew.a.run.app/notes"
      "http://localhost:5000/notes"
    );
    return data;
  });
}

const NotesListPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { status, data: notes, error, isFetching } = useNotes();

  const queryClient = useQueryClient();

  const handleNewNoteButtonClick = (e) => {
    const newNoteId = ObjectId();

    queryClient.setQueryData(["note", newNoteId], {
      _id: newNoteId,
      title: "",
      body: "",
    });

    queryClient.resetQueries("notes", { exact: true });

    history.push(`/notes/${newNoteId}?new`);
  };

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar>
          <IonTitle>My Notes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleNewNoteButtonClick}>
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
