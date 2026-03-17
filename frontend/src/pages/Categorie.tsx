import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/icone/market.png";
import noname from "../assets/icone/noname.png";
import inx from "../assets/icone/in.png";
import out from "../assets/icone/out.png";
import profil from "../assets/icone/profil.png";
import { Categories } from "../store/Frontbdd";
import "../style/home.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
const Categorie = () => {
  const [AfficheProfil, setAfficheProfil] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(Categories[0].name);
  const location = useLocation();
  const navigate = useNavigate();
  const refprofil = useRef<HTMLDivElement | null>(null);
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
    if (location.pathname === "/categories/immobilier")
      setSearch(Categories[0].name);
    if (location.pathname === "/categories/auto") setSearch(Categories[1].name);
    if (location.pathname === "/categories/mode") setSearch(Categories[2].name);
    if (location.pathname === "/categories/electronique")
      setSearch(Categories[3].name);
    if (location.pathname === "/categories/emploi")
      setSearch(Categories[4].name);
    if (location.pathname === "/categories/autre")
      setSearch(Categories[5].name);
  }, [location.pathname]);
  useEffect(() => {
    if (
      location.pathname === "/categories" ||
      location.pathname === "/categories/"
    ) {
      navigate("/categories/immobilier/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="HomeMain">
      <div className="HomeTitle">
        <div className="HomeLogo">
          <img src={logo} alt="" />
        </div>
        <div className="HomeMenu">
          <div className="HomeCategoryCard">
            <img src={noname} alt="" />
            <p>Home</p>
          </div>
          <div className="HomeCategoryCard">
            <img src={noname} alt="" />
            <p>Services</p>
          </div>
          <div className="HomeCategoryCard">
            <img src={noname} alt="" />
            <p>Like</p>
          </div>
          <div className="HomeCategoryCard">
            <img src={noname} alt="" />
            <p>Panier</p>
            <div className="NumberCard">
              <span>0</span>
            </div>
          </div>
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
              <div className="HomeProfilDescriptionTitle">
                <img src={profil} alt="" />
                <p>Profil</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="HomeCategory">
        {Categories.map((p) => (
          <Link to={p.link} key={p.id}>
            <div
              className={`HomeCategorySelect ${search === p.name ? "act" : ""}`}
              onClick={() => setSearch(p.name)}
            >
              <img src={p.photo} alt={p.name} />
              <p>{p.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="SelectionCategory">{<Outlet />}</div>
    </div>
  );
};

export default Categorie;
