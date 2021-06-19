import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
} from "@ionic/react";
import { FormEvent, useState } from "react";
import { useAuth } from "../../context/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("submitting!");

    login({ email, password });
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1 className="ion-margin-bottom">Hello there!</h1>
        <p>Please enter your email and password</p>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Email or phone number</IonLabel>
            <IonInput
              type="email"
              name="email"
              placeholder="Eg. john@example.com"
              onIonChange={(e) => setEmail(e.detail.value!)}
              value={email}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              name="password"
              onIonChange={(e) => setPassword(e.detail.value!)}
              value={password}
            />
          </IonItem>

          <IonButton className="ion-margin-top" type="submit">
            Let's go!
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
