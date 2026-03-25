import React, { useEffect } from "react";
import Siderbar from "../ui/Siderbar";
import img1 from "../assets/categories/maison.png";
import Button from "../ui/Button";
import "../style/ui.css";
import type { LikingEvent } from "../App";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  likingEvent: LikingEvent[] | null;
  setlikingEvent: React.Dispatch<React.SetStateAction<LikingEvent[] | null>>;
}
const Like: React.FC<ButtonProps> = ({ likingEvent, setlikingEvent }) => {
  const navigate = useNavigate();
  const handleremove = (id: number) => {
    const deletelist = likingEvent?.filter((p) => p.id !== id); //supprimer l'evenement
    localStorage.setItem("likingevents", JSON.stringify(deletelist)); //enregistrer la nouvelle liste
    setlikingEvent(deletelist || null);
    const newlike = localStorage.getItem("liking"); //recuperer l'ancienne liste des likes
    if (newlike) {
      const like = JSON.parse(newlike);
      if (like[id]) {
        like[id] = false;
        localStorage.setItem("liking", JSON.stringify(like));
      }
    }
  };

  return (
    <div className="MainMenu">
      <Siderbar />
      <div className="btnretour">
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>

      <div className="ServiceMain">
        {(likingEvent?.length ?? 0) > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Nom Article</th>
                  <th>Categories</th>
                  <th>Supprimer</th>
                  <th>Consulter Article</th>
                </tr>
              </thead>
              <tbody>
                {likingEvent?.map((p) => (
                  <tr key={p.id}>
                    {p.photo && (
                      <td>
                        <img src={p.photo} alt="" />
                      </td>
                    )}
                    {p.nom && (
                      <td>
                        <p>{p.nom}</p>
                      </td>
                    )}
                    <td>
                      <p>IMMOBILIER</p>
                    </td>
                    <td>
                      <Button onClick={() => handleremove(p.id)}>
                        Supprimer
                      </Button>
                    </td>
                    <td>
                      <Button onClick={() => navigate(p.link)}>
                        Consulter{" "}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p
            style={{ textAlign: "center", marginTop: "10%", fontSize: "30px" }}
          >
            Aucun évenement liker pour le moment 💖
          </p>
        )}
      </div>
    </div>
  );
};

export default Like;
