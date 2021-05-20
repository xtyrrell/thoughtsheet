import {
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ClownCard from "../components/ClownCard";
import "./Tab1.css";
import { useEffect, useState } from "react";
import axios from "axios";

// const data = [
//   {
//     id: "1",
//     title: "James",
//     text: "I make kids happy for a living. Voted Torontos Best Clown 2009, runner up 2010.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1589805807273-a491fdb442ee?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
//     rating: 3,
//     special: true,
//   },
//   {
//     id: "2",
//     title: "Darren",
//     text: "I make kids happy for a living. Voted Torontos Best Clown 2009, runner up 2010.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1589805807273-a491fdb442ee?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80",
//     rating: 2,
//     special: false,
//   },
// ];

const Tab2: React.FC = () => {
  const [listings, setListings] = useState([]);
  const getAllListings = () => {
    axios.get(`localhost:5000/listings`).then((res) => {
      console.log(res.data);
      setListings(res.data);
    });
  };
  useEffect(() => {
    getAllListings();
  }, []);

  return (
    <IonPage>
      <IonHeader color="primary">
        <IonToolbar>
          <IonTitle>Discover</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Naughty List</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="container">
          <h3 className="red">Cum. </h3>
          <h3 className="blue">Cry.</h3> <h3 className="yellow">Clowns.</h3>
          <h1>
            Toronto's most <span className="red">horny</span> clown community.
          </h1>
          {listings.map((clown) => {
            return <ClownCard clown={clown}></ClownCard>;
          })}
        </div>
        {/* <IonImg src="https://images.unsplash.com/photo-1602501348666-c721dadd6e59?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80" /> */}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
