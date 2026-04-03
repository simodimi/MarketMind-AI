import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/icone/market.png";
import noname from "../assets/icone/noname.png";
import inx from "../assets/icone/in.png";
import out from "../assets/icone/out.png";
import profil from "../assets/icone/profil.png";
import { Link, useLocation } from "react-router-dom";

const Siderbar = () => {
  const [AfficheProfil, setAfficheProfil] = useState<boolean>(false);
  const refprofil = useRef<HTMLDivElement | null>(null);
  const [stylemenu, setstylemenu] = useState("");
  const local = useLocation();
  //disparition du profil de l'user lorsque l'on clique en dehors
  useEffect(() => {
    const dissapear = (e: MouseEvent) => {
      if (refprofil.current && !refprofil.current.contains(e.target as Node))
        setAfficheProfil(false);
    };
    document.addEventListener("mousedown", dissapear);
    return () => {
      document.removeEventListener("mousedown", dissapear);
    };
  }, []);
  //gestion du lien de l'url
  useEffect(() => {
    if (local.pathname === "/service") setstylemenu("service");
    if (local.pathname.startsWith("/categories")) setstylemenu("categorie");
    if (local.pathname === "/like") setstylemenu("like");
    if (local.pathname === "/paiement") setstylemenu("paiement");
  }, [local.pathname]);

  return (
    <div className="HomeMain">
      <div className="HomeTitle">
        <Link to={"/"}>
          <div className="HomeLogo">
            <img src={logo} alt="" />
          </div>
        </Link>
        <div className="HomeMenu">
          <Link to={"/"}>
            <div className="HomeCategoryCard">
              <img src={noname} alt="" />
              <p>Home</p>
            </div>
          </Link>
          <Link to={"/categories/immobilier"}>
            <div
              className={`HomeCategoryCard ${stylemenu === "categorie" ? "active" : ""}`}
            >
              <img src={noname} alt="" />
              <p>Catégories</p>
            </div>
          </Link>
          <Link to={"/service"}>
            <div
              className={`HomeCategoryCard ${stylemenu === "service" ? "active" : ""}`}
            >
              <img src={noname} alt="" />
              <p>Services</p>
            </div>
          </Link>
          <Link to={"/like"}>
            <div
              className={`HomeCategoryCard ${stylemenu === "like" ? "active" : ""}`}
            >
              <img src={noname} alt="" />
              <p>Like</p>
            </div>
          </Link>
          <Link to={"/paiement"}>
            <div
              className={`HomeCategoryCard ${stylemenu === "paiement" ? "active" : ""}`}
            >
              <img src={noname} alt="" />
              <p>Panier</p>
              <div className="NumberCard">
                <span>0</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="HomeProfil" ref={refprofil}>
          <div
            className="HomeProfilName"
            onClick={() => setAfficheProfil((prev) => !prev)}
          >
            <img src={noname} alt="" />
            <p>dimitri</p>
          </div>
          {AfficheProfil && (
            <div className="HomeProfilDescription">
              <div className="HomeProfilDescriptionTitle">
                <img src={inx} alt="" />
                <p>Connexion</p>
              </div>
              <div className="HomeProfilDescriptionTitle">
                <img src={out} alt="" />
                <p>Déconnexion</p>
              </div>

              <Link to={"/profiluser"}>
                <div className="HomeProfilDescriptionTitle">
                  <img src={profil} alt="" />
                  <p>Profil</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Siderbar;
