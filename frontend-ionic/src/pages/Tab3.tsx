import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab3.css";

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Apply</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Apply</IonTitle>
          </IonToolbar>
        </IonHeader>
        <iframe
          className="airtable-form"
          src="https://airtable.com/embed/shriPLtvm1UDPMTt1?backgroundColor=red"
        ></iframe>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
