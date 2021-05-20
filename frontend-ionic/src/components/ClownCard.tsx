import "./ClownCard.css";
import axios from "axios";
import { useState } from "react";

interface ContainerProps {
  clown: {
    title: string;
    text: string;
    imageUrl: string;
    rating: Number;
    special: Boolean;
    id: String;
  };
}

const ClownCard: React.FC<ContainerProps> = ({ clown }) => {
  let stars = "";
  let count = 0;
  while (count < 5) {
    count < clown.rating ? (stars += "★") : (stars += "☆");

    count++;
  }

  const blackList = (clownId: String, special: Boolean) => {
    axios
      .patch(`localhost:5000/listing/${clownId}`, { special: !special })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      });
  };

  return (
    <div className={`card${clown.special ? " special" : ""}`}>
      <img className="avatar" src={clown.imageUrl} />
      <h1>{clown.title}</h1>
      <p>{clown.text}</p>
      <div className="row">
        <span>{stars}</span>
        <button
          className={clown.special ? "special" : ""}
          onClick={() => {
            blackList(clown.id, clown.special);
          }}
        >
          {clown.special ? "Blacklisted" : "Blacklist for nudity"}
        </button>
      </div>
    </div>
  );
};

export default ClownCard;
