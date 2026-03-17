import { maisonsData } from "../../store/Frontbdd";
import img1 from "../../assets/icone/offcoeur.png";
import img2 from "../../assets/icone/oncoeur.png";
import img3 from "../../assets/icone/oeil.png";
import "../../style/category.css";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Button from "../../ui/Button";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
const Maison = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [meuble, setMeuble] = useState<"all" | "oui" | "non">("all");
  const [order, setOrder] = useState<
    "croissant" | "decroissant" | "Plusancien" | "Plusrecent" | "all"
  >("all");
  const [rooms, setRooms] = useState<"1" | "2" | "3" | "4" | "5" | "6" | "all">(
    "all",
  );
  //si prix est indefini alors 0
  const minfilter = Math.min(...maisonsData.map((p) => p.prix ?? 0));
  const maxfilter = Math.max(...maisonsData.map((p) => p.prix ?? 0));
  const [value, setValue] = useState<number[]>([minfilter, maxfilter]);
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

  function valuetext(value: number) {
    return `${value}€`;
  }
  const handleChange = (event: Event, newValue: number[]) => {
    setValue(newValue);
  };
  const filtergeneralAll = () => {
    return (
      maisonsData
        .filter((p) => (p.prix ?? 0) >= value[0] && (p.prix ?? 0) <= value[1])
        .filter((p) => {
          if (meuble === "all") return true;
          return p.meuble?.toLowerCase() === meuble.toLowerCase();
        })
        .filter((p) => {
          if (rooms === "all") return true;
          if (rooms === "6") return (p.chambres ?? 0) > 5;
          return p.chambres === Number(rooms);
        })
        //filtrage par order
        .sort((a, b) => {
          if (order === "all") return 0;
          if (order === "croissant") return (a.prix ?? 0) - (b.prix ?? 0);
          if (order === "decroissant") return (b.prix ?? 0) - (a.prix ?? 0);
          if (order === "Plusancien")
            return (
              new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
            );
          if (order === "Plusrecent")
            return (
              new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
            );
          return 0;
        })
    );
  };
  const resetfilter = () => {
    setMeuble("all");
    setRooms("all");
    setValue([minfilter, maxfilter]);
    setOrder("all");
  };
  const numeroMeuble = filtergeneralAll().filter(
    (p) => p.meuble?.toLocaleLowerCase() === "oui",
  ).length;
  const numeroNonMeuble = filtergeneralAll().filter(
    (p) => p.meuble?.toLocaleLowerCase() === "non",
  ).length;
  return (
    <div className="MaisonMain">
      <div className="ButtonFilter">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => setOpen((prev) => !prev)}>Filtre</Button>
        </div>
        {open && (
          <div className="FiltreOption">
            <div className="form">
              <div className="FiltreOption1">
                <p>Prix :</p>
                <Box
                  sx={{
                    width: "100%",
                    padding: "0 55px",
                    marginTop: "30px",
                  }}
                >
                  <Slider
                    aria-label="Custom marks"
                    value={value}
                    onChange={handleChange}
                    valueLabelDisplay="on"
                    getAriaValueText={valuetext}
                    min={minfilter}
                    max={maxfilter}
                  />
                </Box>
              </div>
              <div className="FiltreOption1">
                <p style={{ marginTop: "10px" }}>Nombre de chambre :</p>
                <div className="FilterOptionRooms">
                  <p
                    className={`${rooms === "1" ? "active" : ""}`}
                    onClick={() => setRooms("1")}
                  >
                    1
                  </p>
                  <p
                    onClick={() => setRooms("2")}
                    className={`${rooms === "2" ? "active" : ""}`}
                  >
                    2
                  </p>
                  <p
                    onClick={() => setRooms("3")}
                    className={`${rooms === "3" ? "active" : ""}`}
                  >
                    3
                  </p>
                  <p
                    onClick={() => setRooms("4")}
                    className={`${rooms === "4" ? "active" : ""}`}
                  >
                    4
                  </p>
                  <p
                    onClick={() => setRooms("5")}
                    className={`${rooms === "5" ? "active" : ""}`}
                  >
                    5
                  </p>
                  <p
                    onClick={() => setRooms("6")}
                    className={`${rooms === "6" ? "active" : ""}`}
                  >
                    6 +
                  </p>
                </div>
              </div>
              <div className="FiltreOption1">
                <p style={{ marginTop: "10px" }}>Meublé/Non meublé :</p>
                <div className="FilterOptionRoomx">
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="meuble"
                      id=""
                      checked={meuble === "oui"}
                      onChange={() => setMeuble("oui")}
                    />
                    <p>Meublé</p>
                    <span>{numeroMeuble}</span>
                  </div>
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="meuble"
                      id=""
                      onChange={() => setMeuble("non")}
                      checked={meuble === "non"}
                    />
                    <p>Non meublé</p>
                    <span>{numeroNonMeuble}</span>
                  </div>
                </div>
              </div>
              <div className="FiltreOption1">
                <p style={{ marginTop: "10px" }}>Tri :</p>
                <div className="FilterOptionRoomx">
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="tri"
                      id=""
                      onChange={() => setOrder("Plusancien")}
                      checked={order === "Plusancien"}
                    />
                    <p>Plus ancien</p>
                  </div>
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="tri"
                      id=""
                      onChange={() => setOrder("Plusrecent")}
                      checked={order === "Plusrecent"}
                    />
                    <p>Plus recent</p>
                  </div>
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="tri"
                      id=""
                      onChange={() => setOrder("croissant")}
                      checked={order === "croissant"}
                    />
                    <p>Prix croissant</p>
                  </div>
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="tri"
                      id=""
                      onChange={() => setOrder("decroissant")}
                      checked={order === "decroissant"}
                    />
                    <p>Prix decroissant</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="FilterValid">
              <Button onClick={resetfilter}>Réinitialiser</Button>
            </div>
          </div>
        )}
      </div>
      <div className="ShowItemsFilter">
        {filtergeneralAll().length > 0 ? (
          <>
            {filtergeneralAll().map((p) => (
              <Link to={`/categories/immobilier/describe/${p.nom}`} key={p.id}>
                <div
                  className="MaisonMainItem"
                  ref={(el) => {
                    elementref.current[p.id] = el;
                  }}
                >
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
          </>
        ) : (
          <p className="errorsearch">
            Aucune maison ne correspond à votre recherche
          </p>
        )}
      </div>
    </div>
  );
};

export default Maison;
