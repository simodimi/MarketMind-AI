import { maisonsData } from "../store/Frontbdd";
import img1 from "../assets/icone/offcoeur.png";
import img2 from "../assets/icone/oncoeur.png";
import img3 from "../assets/icone/oeil.png";
import "../style/category.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Filter from "../hook/Filter";
import Button from "../ui/Button";
import type { LikingEvent } from "../App";
import type { Produit } from "../pages/ProfilUser";

interface ButtonProps {
  setlikingEvent: React.Dispatch<React.SetStateAction<LikingEvent[] | null>>;
}

const SubCategories: React.FC<ButtonProps> = ({ setlikingEvent }) => {
  const navigate = useNavigate();
  //si prix est indefini alors 0
  const first = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  //gestion de la transmission des données
  const [annonces, setannonces] = useState<Produit[]>([]);
  const [like, setlike] = useState<{ [key: number]: boolean }>({});

  const { type, subtype } = useParams();
  const [filteredData, setFilteredData] = useState([...annonces]);
  //articles vus
  const [articleConsulte, setarticleConsulte] = useState<{
    [key: number]: boolean;
  }>({});
  //elementref est un objet avec une clé number et une valeur HTMLDivElement ou null
  const elementref = useRef<{ [key: number]: HTMLDivElement | null }>({});
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
  //gestion des like
  const handlelike = (id: number) => {
    setlike((prev) => {
      const newlike = { ...prev, [id]: !prev[id] };
      localStorage.setItem("liking", JSON.stringify(newlike));
      return newlike;
    });
  };
  //rechargement des liking au demarrage
  useEffect(() => {
    const saveliking = localStorage.getItem("liking");
    if (saveliking) {
      setlike(JSON.parse(saveliking));
    }
  }, []);
  const handletraverse = (p: Produit) => {
    const event = {
      id: p.id,
      nom: p.nom,
      photo: p.photo,
      link: `/categories/${type}/${subtype}/${p.id}`,
      categories: p.categories,
    };
    setlikingEvent((prev) => {
      let newlist: (typeof event)[]; //newlist sera un tableau d'objet à la même structure que event
      if (!prev) {
        newlist = [event]; //si prev est vide, newlist sera un tableau contenant event
      }
      //eviter les doublons
      else if (prev.some((item) => item.id === event.id)) {
        newlist = prev; //ne rien faire
      } else {
        newlist = [...prev, event]; //ajouter l'evenement à la suite
      }
      localStorage.setItem("likingevents", JSON.stringify(newlist));
      return newlist;
    });
  };

  useEffect(() => {
    const lik = localStorage.getItem("likingevents");
    if (lik) {
      setlikingEvent(JSON.parse(lik));
    }
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("addproduit") ?? "[]"); //recuperer
    const dispatch = storedData.filter(
      (p: Produit) => p.CategoriesProduit === type,
    );
    let result = dispatch;
    if (subtype) {
      result = dispatch.filter(
        (p: Produit) =>
          p.typehouseProduit?.toLowerCase() === subtype.toLowerCase() ||
          p.carburantProduit?.toLowerCase() === subtype.toLowerCase() ||
          p.electroniqueProduit?.toLowerCase() === subtype.toLowerCase() ||
          p.genreProduit?.toLowerCase() === subtype.toLowerCase(),
      );
      const order = result.sort((a: Produit, b: Produit) => b.id - a.id);
      setannonces(order);
    }
  }, [type, subtype]);
  //conserver l'article vu
  const handleArticleConsulte = (p: number) => {
    setarticleConsulte((prev) => {
      const article = { ...prev, [p]: true };
      localStorage.setItem("articleConsulte", JSON.stringify(article));
      return article;
    });
  };
  useEffect(() => {
    const articleConsulte = localStorage.getItem("articleConsulte");
    if (articleConsulte) {
      setarticleConsulte(JSON.parse(articleConsulte));
    }
  }, []);
  //filtre
  const handleFiltreChange = (filtres: any) => {
    let result = [...annonces];
    //filtrage par prix
    result = result.filter(
      (p: Produit) =>
        (p.prix ?? 0) >= filtres.prix[0] && (p.prix ?? 0) <= filtres.prix[1],
    );

    //filtrage par meuble
    /*  if (filtres.meubleProduit !== "all") {
      result = result.filter(
        (p) => p.meubleProduit?.toLowerCase() === filtres.meuble?.toLowerCase(),
      );
    }
    //filtre par nombre de chambre

    if (filtres.numberchambreProduit !== "all") {
      if (filtres.rooms === "6") {
        result = result.filter((p) => p.chambres ?? 0 > 5);
      } else {
        result = result.filter((p) => p.chambres === Number(filtres.rooms));
      }
    }
    //filtrage par order
    if (filtres.order !== "all") {
      result.sort((a, b) => {
        if (filtres.order === "croissant") return (a.prix ?? 0) - (b.prix ?? 0);
        if (filtres.order === "decroissant")
          return (b.prix ?? 0) - (a.prix ?? 0);
        if (filtres.order === "Plusancien")
          return (
            new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
          );
        if (filtres.order === "Plusrecent")
          return (
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
          );
        return 0;
      });
    }*/
    setFilteredData(result);
  };
  const meubleCounts = {
    oui: annonces.filter((p: Produit) => p.meubleProduit === true).length,
    non: annonces.filter((p: Produit) => p.meubleProduit === false).length,
  };
  return (
    <div className="MaisonMain">
      {/*  <Filter
        minPrix={minPrix}
        maxPrix={maxPrix}
        prix={[minPrix, maxPrix]}
        onFiltreChange={handleFiltreChange}
        meubleCounts={meubleCounts}
        open={open}
        setOpen={setOpen}
        first={first}
        category="all"
      />*/}
      <div className="ShowItemsFilter">
        {annonces.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
              marginTop: "30px",
            }}
          >
            {annonces.map((p) => (
              <div
                className="MaisonMainItem"
                key={p.id}
                ref={(el) => {
                  elementref.current[p.id] = el;
                }}
              >
                <div className="MaisonMainItemPhoto">
                  <div className="PrincipalPhoto">
                    {p.photoProduitPrincipal && (
                      <img src={p.photoProduitPrincipal} alt="" />
                    )}
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
                      {articleConsulte[p.id] && <img src={img3} alt="" />}
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
                  {p.texteDescription && (
                    <p id="text">
                      <span>Description : </span>
                      {p.texteDescription.length > 800
                        ? p.texteDescription.slice(0, 800) + "..."
                        : p.texteDescription}
                      .
                    </p>
                  )}
                  {p.villeProduit && (
                    <p>
                      <span>Villes : </span>
                      {p.villeProduit}.
                    </p>
                  )}
                  {p.adresseProduit && (
                    <p>
                      <span>Adresse : </span>
                      {p.adresseProduit}.
                    </p>
                  )}
                  {p.surfaceProduit && (
                    <p>
                      <span>Surface : </span>
                      {p.surfaceProduit} m2.
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
                  onClick={() => {
                    navigate(`/categories/${type}/${subtype}/${p.id}`);
                    handleArticleConsulte(p.id);
                  }}
                >
                  Voir l'article
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="errorsearch">
            {`Aucun article de la sous catégorie ${subtype} appartenant à la catégorie ${type} n'est disponible pour le moment.`}
          </p>
        )}
      </div>
    </div>
  );
};

export default SubCategories;
