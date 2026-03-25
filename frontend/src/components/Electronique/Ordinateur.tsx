import React, { useEffect, useRef, useState } from "react";
import Filter from "../../hook/Filter";
import { ordinateurs } from "../../store/Frontbdd";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import img1 from "../../assets/icone/offcoeur.png";
import img2 from "../../assets/icone/oncoeur.png";
import img3 from "../../assets/icone/oeil.png";
import type { LikingEvent } from "../../App";

interface ButtonProps {
  setlikingEvent: React.Dispatch<React.SetStateAction<LikingEvent[] | null>>;
}

const Ordinateur: React.FC<ButtonProps> = ({ setlikingEvent }) => {
  const [filteredData, setFilteredData] = useState(ordinateurs);
  const elementref = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const navigate = useNavigate();
  const [like, setlike] = useState<{ [key: number]: boolean }>({});
  const first = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const minPrix = Math.min(...ordinateurs.map((p) => p.prix ?? 0));
  const maxPrix = Math.max(...ordinateurs.map((p) => p.prix ?? 0));
  //permet de scroller vers l'element selectionner
  useEffect(() => {
    const selectelement = localStorage.getItem("elt");
    if (selectelement && elementref.current[Number(selectelement)]) {
      elementref.current[Number(selectelement)]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      localStorage.removeItem("elt");
    }
  }, []);
  const handleFiltreChange = (filtres: any) => {
    let result = [...ordinateurs];
    result = result.filter(
      (p) =>
        (p.prix ?? 0) >= filtres.prix[0] && (p.prix ?? 0) <= filtres.prix[1],
    );
    //classement par ordre
    if (filtres.order !== "all") {
      result.sort((a, b) => {
        if (filtres.order === "croissant") {
          return (a.prix ?? 0) - (b.prix ?? 0);
        }
        if (filtres.order === "decroissant") {
          return (b.prix ?? 0) - (a.prix ?? 0);
        }
        if (filtres.order === "Plusancien") {
          return (
            new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
          );
        }
        if (filtres.order === "Plusrecent") {
          return (
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
          );
        } else {
          return 0;
        }
      });
    }
    setFilteredData(result);
  };
  useEffect(() => {
    const evenement = (e: MouseEvent) => {
      if (open && first.current && !first.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", evenement);

    return () => {
      document.removeEventListener("click", evenement);
    };
  }, [open]);
  const handlelike = (id: number) => {
    setlike((prev) => {
      const newlike = { ...prev, [id]: !prev[id] };
      localStorage.setItem("liking", JSON.stringify(newlike));
      return newlike;
    });
  };
  const handletraverse = (p: any) => {
    const event = {
      id: p.id,
      nom: p.nom,
      photo: p.photo,
      link: `/categories/electronique/describe/${p.nom}`,
    };
    setlikingEvent((prev) => {
      let newlist: (typeof event)[];
      if (!prev) {
        newlist = [event];
      } else if (prev.some((p) => p.id === event.id)) {
        newlist = prev;
      } else {
        newlist = [...prev, event];
      }
      localStorage.setItem("likingevents", JSON.stringify(newlist));
      return newlist;
    });
  };
  return (
    <div className="MaisonMain">
      <Filter
        minPrix={minPrix}
        maxPrix={maxPrix}
        onFiltreChange={handleFiltreChange}
        open={open}
        setOpen={setOpen}
        first={first}
        category="all"
      />
      <div className="ShowItemsFilter">
        {filteredData.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              marginTop: "30px",
            }}
          >
            {filteredData.map((p) => (
              <div
                className="MaisonMainItem"
                key={p.id}
                ref={(el) => {
                  elementref.current[p.id] = el;
                }}
              >
                <div className="MaisonMainItemPhoto">
                  <div className="PrincipalPhoto">
                    <img src={p.photo} alt="" />
                  </div>
                  <div className="MaisonMainItemPhotoLike">
                    <div className="MaisonHealth">
                      <img
                        src={like[p.id] ? img2 : img1}
                        alt=""
                        onClick={() => {
                          handlelike(p.id);
                          handletraverse(p);
                        }}
                      />
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
                <Button
                  className="accept"
                  style={{ zIndex: 150 }}
                  onClick={() =>
                    navigate(`/categories/electronique/describe/${p.nom}`)
                  }
                >
                  Voir l'article
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="errorsearch">
            Aucun ordinateurs ne correspond à votre recherche
          </p>
        )}
      </div>
    </div>
  );
};

export default Ordinateur;
