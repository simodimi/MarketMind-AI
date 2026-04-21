import { useNavigate, useParams } from "react-router-dom";
import { maisonsData } from "../store/Frontbdd";
import "../style/describecategory.css";
import Button from "../ui/Button";
import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import type { Produit } from "../pages/ProfilUser";

const DescribeCategories = () => {
  const { describe } = useParams();
  const [annonces, setannonces] = useState<Produit[]>([]);
  const start = useRef<HTMLDivElement>(null);
  const nomdecode = decodeURIComponent(describe || "");
  const [open10, setopen10] = useState<boolean>(false);
  const navigate = useNavigate();
  const storedData = JSON.parse(
    localStorage.getItem("addproduit") ?? "[]",
  ).find((p: Produit) => p.id === Number(nomdecode));

  const produit = storedData;

  //permet de sauvegarder l'id du produit dans le localStorage
  useEffect(() => {
    if (produit) {
      localStorage.setItem("elt", produit.id.toString());
    }
  }, [produit]);
  //permet de faire le scroll au haut de la page
  useEffect(() => {
    start.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  const [photo, setphoto] = useState<string>(produit?.photo || "");
  const [photopopup, setphotopopup] = useState<string>(produit?.photo || "");
  //filter pour ne prendre que les photos non nulles ou indefinies
  const allphoto = [
    produit?.photo,
    produit?.photoProduitSecondary1,
    produit?.photoProduitSecondary2,
    produit?.photoProduitSecondary3,
    produit?.photoProduitSecondary4,
    produit?.photoProduitSecondary5,
  ].filter((p) => p);
  //configuration bouton de popup
  const next = () => {
    const current = allphoto.findIndex((p) => p === photopopup);
    if (current < allphoto.length - 1) {
      setphotopopup(allphoto[current + 1] || "");
    }
  };
  const preview = () => {
    const current = allphoto.findIndex((p) => p === photopopup);
    if (current > 0) {
      setphotopopup(allphoto[current - 1] || "");
    }
  };
  return (
    <div className="Describe" ref={start}>
      <Button onClick={() => navigate(-1)}>Retour</Button>
      <div className="DescribeItem">
        <div className="DescribeItemPhoto">
          <div className="Photorepo">
            {produit?.photoProduitSecondary1 && (
              <img
                src={produit?.photoProduitSecondary1}
                alt=""
                onClick={() => setphoto(produit.photoProduitSecondary1 || "")}
              />
            )}
            {produit?.photoProduitSecondary2 && (
              <img
                src={produit?.photoProduitSecondary2}
                alt=""
                onClick={() => setphoto(produit.photoProduitSecondary2 || "")}
              />
            )}
            {produit?.photoProduitSecondary3 && (
              <img
                src={produit?.photoProduitSecondary3}
                alt=""
                onClick={() => setphoto(produit.photoProduitSecondary3 || "")}
              />
            )}
            {produit?.photoProduitSecondary4 && (
              <img
                src={produit?.photoProduitSecondary4}
                alt=""
                onClick={() => setphoto(produit.photoProduitSecondary4 || "")}
              />
            )}
            {produit?.photoProduitSecondary5 && (
              <img
                src={produit?.photoProduitSecondary5}
                alt=""
                onClick={() => setphoto(produit.photoProduitSecondary5 || "")}
              />
            )}

            {produit?.photo && (
              <img
                src={produit?.photo}
                alt=""
                onClick={() => setphoto(produit.photo || "")}
              />
            )}
          </div>
          <div className="PrincipalDescribePhoto">
            {produit?.photo && (
              <img src={photo} alt="" onClick={() => setopen10(true)} />
            )}
          </div>
        </div>
        <div className="DescribeItemDescribe">
          {/* Informations générales */}
          {produit?.nom && (
            <p>
              <span>Nom : </span>
              {produit?.nom}
            </p>
          )}

          {produit?.categories && (
            <p>
              <span>Catégorie : </span>
              {produit?.categories}
            </p>
          )}

          {produit?.quantite && (
            <p>
              <span>Quantité : </span>
              {produit?.quantite}
            </p>
          )}

          {produit?.prix && (
            <p>
              <span>Prix : </span>
              {produit?.prix} €
            </p>
          )}

          {produit?.date && (
            <p>
              <span>Date de publication : </span>
              {produit?.date}
            </p>
          )}

          {/* Description */}
          {produit?.texteDescription && (
            <p id="text">
              <span>Description : </span>
              {produit?.texteDescription}
            </p>
          )}

          {produit?.descriptiondetailleeProduit && (
            <p id="text">
              <span>Description détaillée : </span>
              {produit?.descriptiondetailleeProduit}
            </p>
          )}

          {/* Localisation */}
          {produit?.villeProduit && (
            <p>
              <span>Ville : </span>
              {produit?.villeProduit}
            </p>
          )}

          {produit?.codepostalProduit && (
            <p>
              <span>Code postal : </span>
              {produit?.codepostalProduit}
            </p>
          )}

          {produit?.adresseProduit && (
            <p>
              <span>Adresse : </span>
              {produit?.adresseProduit}
            </p>
          )}

          {/* Caractéristiques immobilier */}
          {produit?.surfaceProduit && (
            <p>
              <span>Surface : </span>
              {produit?.surfaceProduit} m²
            </p>
          )}

          {produit?.typehouseProduit && (
            <p>
              <span>Type de bien : </span>
              {produit?.typehouseProduit}
            </p>
          )}

          {produit?.numberpieceProduit && (
            <p>
              <span>Nombre de pièces : </span>
              {produit?.numberpieceProduit}
            </p>
          )}

          {produit?.numberchambreProduit && (
            <p>
              <span>Nombre de chambres : </span>
              {produit?.numberchambreProduit}
            </p>
          )}

          {produit?.numberdoucheProduit && (
            <p>
              <span>Nombre de douches/salles de bain : </span>
              {produit?.numberdoucheProduit}
            </p>
          )}

          {produit?.numberetageProduit && (
            <p>
              <span>Nombre d'étages : </span>
              {produit?.numberetageProduit}
            </p>
          )}

          {produit?.ascenseurProduit && (
            <p>
              <span>Ascenseur : </span>
              {produit?.ascenseurProduit === "oui" ? "Oui" : "Non"}
            </p>
          )}

          {produit?.meubleProduit && (
            <p>
              <span>Meublé : </span>
              {produit?.meubleProduit === "oui" ? "Oui" : "Non"}
            </p>
          )}

          {produit?.parkingProduit && (
            <p>
              <span>Parking : </span>
              {produit?.parkingProduit === "oui" ? "Oui" : "Non"}
            </p>
          )}

          {produit?.dpeProduit && (
            <p>
              <span>DPE : </span>
              {produit?.dpeProduit}
            </p>
          )}

          {produit?.chargesmensuellesProduit && (
            <p>
              <span>Charges mensuelles : </span>
              {produit?.chargesmensuellesProduit} €
            </p>
          )}

          {produit?.disponibiliteProduit && (
            <p>
              <span>Disponibilité : </span>
              {produit?.disponibiliteProduit}
            </p>
          )}

          {/* Caractéristiques automobile */}
          {produit?.marqueautoProduit && (
            <p>
              <span>Marque : </span>
              {produit?.marqueautoProduit}
            </p>
          )}

          {produit?.modeleautoProduit && (
            <p>
              <span>Modèle : </span>
              {produit?.modeleautoProduit}
            </p>
          )}

          {produit?.circulationProduit && (
            <p>
              <span>Date de mise en circulation : </span>
              {produit?.circulationProduit}
            </p>
          )}

          {produit?.kilometrageProduit && (
            <p>
              <span>Kilométrage : </span>
              {produit?.kilometrageProduit} km
            </p>
          )}

          {produit?.puissanceautoProduit && (
            <p>
              <span>Puissance : </span>
              {produit?.puissanceautoProduit} ch
            </p>
          )}

          {produit?.numberporteProduit && (
            <p>
              <span>Nombre de portes : </span>
              {produit?.numberporteProduit}
            </p>
          )}

          {produit?.couleurautoProduit && (
            <p>
              <span>Couleur : </span>
              {produit?.couleurautoProduit}
            </p>
          )}

          {produit?.proprioProduit && (
            <p>
              <span>Nombre de propriétaires : </span>
              {produit?.proprioProduit}
            </p>
          )}

          {produit?.carburantProduit && (
            <p>
              <span>Carburant : </span>
              {produit?.carburantProduit}
            </p>
          )}

          {produit?.specialautoProduit && (
            <p>
              <span>Spécificités : </span>
              {produit?.specialautoProduit}
            </p>
          )}

          {produit?.boitevitesseProduit && (
            <p>
              <span>Boîte de vitesse : </span>
              {produit?.boitevitesseProduit}
            </p>
          )}

          {/* Caractéristiques électronique */}
          {produit?.electroniqueProduit && (
            <p>
              <span>Type d'appareil : </span>
              {produit?.electroniqueProduit}
            </p>
          )}

          {produit?.marqueelectroProduit && (
            <p>
              <span>Marque : </span>
              {produit?.marqueelectroProduit}
            </p>
          )}

          {produit?.modeleelectroProduit && (
            <p>
              <span>Modèle : </span>
              {produit?.modeleelectroProduit}
            </p>
          )}

          {produit?.specialelectroProduit && (
            <p>
              <span>Spécificités : </span>
              {produit?.specialelectroProduit}
            </p>
          )}

          {produit?.accessoireelectroProduit && (
            <p>
              <span>Accessoires inclus : </span>
              {produit?.accessoireelectroProduit}
            </p>
          )}

          {produit?.quantiteelectroProduit && (
            <p>
              <span>Quantité : </span>
              {produit?.quantiteelectroProduit}
            </p>
          )}

          {/* Caractéristiques mode/habillement */}
          {produit?.genreProduit && (
            <p>
              <span>Genre : </span>
              {produit?.genreProduit}
            </p>
          )}

          {produit?.categorieProduit && (
            <p>
              <span>Catégorie : </span>
              {produit?.categorieProduit}
            </p>
          )}

          {produit?.couleurhabitProduit && (
            <p>
              <span>Couleur : </span>
              {produit?.couleurhabitProduit}
            </p>
          )}

          {produit?.matierehabitProduit && (
            <p>
              <span>Matière : </span>
              {produit?.matierehabitProduit}
            </p>
          )}

          {produit?.taillehabitProduit && (
            <p>
              <span>Taille : </span>
              {produit?.taillehabitProduit}
            </p>
          )}

          {produit?.marquehabitProduit && (
            <p>
              <span>Marque : </span>
              {produit?.marquehabitProduit}
            </p>
          )}

          {produit?.quantitemodeProduit && (
            <p>
              <span>Quantité : </span>
              {produit?.quantitemodeProduit}
            </p>
          )}

          {/* Informations complémentaires */}
          {produit?.complementinformation && (
            <p id="text">
              <span>Informations complémentaires : </span>
              {produit?.complementinformation}
            </p>
          )}

          {produit?.quantiteautreProduit && (
            <p>
              <span>Quantité : </span>
              {produit?.quantiteautreProduit}
            </p>
          )}

          {/* Vidéo */}
          {produit?.videoProduit && (
            <p>
              <span>Vidéo : </span>
              <a
                href={produit?.videoProduit}
                target="_blank"
                rel="noopener noreferrer"
              >
                {produit?.videoProduit}
              </a>
            </p>
          )}
        </div>
        <div className="UserDescription">
          <p>nom du propriétaire</p>
          <p>photo du propriétaire</p>
          <p>membre depuis le 05/05/2023</p>
          <p>envoyer un message au propriétaire</p>
        </div>
      </div>
      {open10 && (
        <Dialog
          open={open10}
          onClose={() => setopen10(false)}
          sx={{
            "& .MuiDialog-paper": {
              width: "100%",
              maxWidth: "800px",
              height: "auto",
              position: "relative",
            },
          }}
        >
          <DialogContent>
            <div style={{ textAlign: "center" }}>
              <img
                src={photopopup}
                alt="Photo agrandie"
                style={{
                  maxWidth: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
              />
            </div>
          </DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
            {allphoto.findIndex((p) => p === photopopup) > 0 && (
              <Button onClick={preview}>Précédent</Button>
            )}
            {allphoto.findIndex((p) => p === photopopup) <
              allphoto.length - 1 && <Button onClick={next}>Suivant</Button>}
          </DialogActions>

          <DialogActions
            sx={{ position: "absolute", top: "10px", right: "0px" }}
          >
            <Button className="decline" onClick={() => setopen10(false)}>
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default DescribeCategories;
