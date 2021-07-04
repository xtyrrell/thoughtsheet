import { IonPage, IonRouterOutlet } from "@ionic/react";
import { Route, RouteComponentProps } from "react-router-dom";

import NotesListPage from "./NotesListPage";
import EditNotePage from "./EditNotePage";

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

export default Notes;
