import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Button from "../ui/Button";
import type { Produit } from "../pages/ProfilUser";

interface FilterProps {
  minPrix: number;
  maxPrix: number;
  prix: number[];
  onFiltreChange: (filtres: Produit) => void; //fonction qui ne retourne rien
  meubleCounts?: {
    oui: number;
    non: number;
  };
  category: string;
  first: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter: React.FC<FilterProps> = ({
  minPrix,
  maxPrix,
  prix: initialPrix,
  onFiltreChange,
  meubleCounts = { oui: 0, non: 0 },
  first,
  open,
  setOpen,
  category,
}) => {
  const [meuble, setMeuble] = useState<"all" | "oui" | "non">("all");
  const [order, setOrder] = useState<
    "croissant" | "decroissant" | "Plusancien" | "Plusrecent" | "all"
  >("all");
  const [rooms, setRooms] = useState<"1" | "2" | "3" | "4" | "5" | "6" | "all">(
    "all",
  );
  const [prix, setPrix] = useState<number[]>(initialPrix);

  const handlePrixChange = (_event: Event, newValue: number[]) => {
    setPrix(newValue);
    onFiltreChange({
      meuble,
      order,
      rooms,
      prix: newValue,
    } as any);
  };
  const handleMeubleChange = (value: "oui" | "non") => {
    setMeuble(value);
    onFiltreChange({
      meuble: value,
      order,
      rooms,
      prix,
    } as any);
  };

  const handleRoomsChange = (
    value: "1" | "2" | "3" | "4" | "5" | "6" | "all",
  ) => {
    setRooms(value);
    onFiltreChange({
      meuble,
      order,
      rooms: value,
      prix,
    } as any);
  };

  const handleOrderChange = (
    value: "croissant" | "decroissant" | "Plusancien" | "Plusrecent" | "all",
  ) => {
    setOrder(value);
    onFiltreChange({
      meuble,
      order: value,
      rooms,
      prix,
    } as any);
  };
  //exceptions
  const showrooms = category === "Maison";
  const showmeuble = category === "Maison";
  const resetfilter = () => {
    setMeuble("all");
    setRooms("all");
    setPrix(initialPrix);
    setOrder("all");
    onFiltreChange({
      meuble: "all",
      order: "all",
      rooms: "all",
      prix: initialPrix,
    } as any);
  };

  const valuetext = (value: number) => `${value}€`;

  return (
    <div className="ButtonFilter">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          Filtre
        </Button>
      </div>
      {open && (
        <div className="FiltreOption" ref={first}>
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
                  value={prix}
                  onChange={handlePrixChange}
                  valueLabelDisplay="on"
                  getAriaValueText={valuetext}
                  min={minPrix}
                  max={maxPrix}
                />
              </Box>
            </div>
            {showrooms && (
              <div className="FiltreOption1">
                <p style={{ marginTop: "10px" }}>Nombre de chambre :</p>
                <div className="FilterOptionRooms">
                  <p
                    className={`${rooms === "1" ? "active" : ""}`}
                    onClick={() => handleRoomsChange("1")}
                  >
                    1
                  </p>
                  <p
                    onClick={() => handleRoomsChange("2")}
                    className={`${rooms === "2" ? "active" : ""}`}
                  >
                    2
                  </p>
                  <p
                    onClick={() => handleRoomsChange("3")}
                    className={`${rooms === "3" ? "active" : ""}`}
                  >
                    3
                  </p>
                  <p
                    onClick={() => handleRoomsChange("4")}
                    className={`${rooms === "4" ? "active" : ""}`}
                  >
                    4
                  </p>
                  <p
                    onClick={() => handleRoomsChange("5")}
                    className={`${rooms === "5" ? "active" : ""}`}
                  >
                    5
                  </p>
                  <p
                    onClick={() => handleRoomsChange("6")}
                    className={`${rooms === "6" ? "active" : ""}`}
                  >
                    6 +
                  </p>
                </div>
              </div>
            )}
            {showmeuble && (
              <div className="FiltreOption1">
                <p style={{ marginTop: "10px" }}>Meublé/Non meublé :</p>
                <div className="FilterOptionRoomx">
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="meuble"
                      id=""
                      checked={meuble === "oui"}
                      onChange={() => handleMeubleChange("oui")}
                    />
                    <p>Meublé</p>
                    <span>{meubleCounts.oui}</span>
                  </div>
                  <div className="FilterOptionRoomItem">
                    <input
                      type="radio"
                      name="meuble"
                      id=""
                      onChange={() => handleMeubleChange("non")}
                      checked={meuble === "non"}
                    />
                    <p>Non meublé</p>
                    <span>{meubleCounts.non}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="FiltreOption1">
              <p style={{ marginTop: "10px" }}>Tri :</p>
              <div className="FilterOptionRoomx">
                <div className="FilterOptionRoomItem">
                  <input
                    type="radio"
                    name="tri"
                    id=""
                    onChange={() => handleOrderChange("Plusancien")}
                    checked={order === "Plusancien"}
                  />
                  <p>Plus ancien</p>
                </div>
                <div className="FilterOptionRoomItem">
                  <input
                    type="radio"
                    name="tri"
                    id=""
                    onChange={() => handleOrderChange("Plusrecent")}
                    checked={order === "Plusrecent"}
                  />
                  <p>Plus recent</p>
                </div>
                <div className="FilterOptionRoomItem">
                  <input
                    type="radio"
                    name="tri"
                    id=""
                    onChange={() => handleOrderChange("croissant")}
                    checked={order === "croissant"}
                  />
                  <p>Prix croissant</p>
                </div>
                <div className="FilterOptionRoomItem">
                  <input
                    type="radio"
                    name="tri"
                    id=""
                    onChange={() => handleOrderChange("decroissant")}
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
  );
};

export default Filter;
