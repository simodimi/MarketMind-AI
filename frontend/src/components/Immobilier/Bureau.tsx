import React from "react";
import { maisonsData } from "../../store/Frontbdd";
import img1 from "../../assets/icone/offcoeur.png";
import img2 from "../../assets/icone/oncoeur.png";
import img3 from "../../assets/icone/oeil.png";
import "../../style/category.css";
import { Link } from "react-router-dom";
const Bureau = () => {
  return (
    <div className="MaisonMain">
      {maisonsData.map((p) => (
        <Link to={`/categories/immobilier/describe/${p.nom}`} key={p.id}>
          <div className="MaisonMainItem">
            <div className="MaisonMainItemPhoto">
              <img src={p.photo} alt="" className="PrincipalPhoto" />
              <div className="MaisonMainItemPhotoLike">
                <div className="MaisonHealth">
                  <img src={img1} alt="" />
                  <img src={img2} alt="" />
                </div>
                <div className="MaisonShow">
                  <img src={img3} alt="" />
                </div>
              </div>
            </div>
            <div className="MaisonMainItemDescribe">
              {p.nom && (
                <p>
                  <span>Nom : </span>
                  {p.nom}.
                </p>
              )}
              {p.description && (
                <p id="text">
                  <span>Description : </span>
                  {p.description.length > 200
                    ? p.description.substring(0, 200).concat("..")
                    : p.description}
                  .
                </p>
              )}
              {p.villes && (
                <p>
                  <span>Villes : </span>
                  {p.villes}.
                </p>
              )}
              {p.adresse && (
                <p>
                  <span>Adresse : </span>
                  {p.adresse}.
                </p>
              )}
              {p.surface && (
                <p>
                  <span>Surface : </span>
                  {p.surface} m2.
                </p>
              )}
              {p.prix && (
                <p>
                  <span>Prix : </span>
                  {p.prix} €.
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Bureau;
