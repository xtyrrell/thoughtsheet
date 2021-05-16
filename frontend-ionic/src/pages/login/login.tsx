import { IonContent, IonInput, IonItem, IonLabel, IonPage } from "@ionic/react";
import { useState } from "react";
import { useAuth } from "../../context/auth";

const Login: React.FC = () => {
  const [emailOrPhoneNumber, setEmailOrPhoneNumber] = useState("");

  const { login } = useAuth();

  const handleSubmit = () => {
    console.log("submitting!");
  };

  return (
    <IonPage>
      <IonContent>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Email or phone number</IonLabel>
            <IonInput
              type="text"
              name="email"
              placeholder="Enter your email or phone number"
              onIonChange={(e) => setEmailOrPhoneNumber(e.detail.value!)}
              clearInput
            />
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
