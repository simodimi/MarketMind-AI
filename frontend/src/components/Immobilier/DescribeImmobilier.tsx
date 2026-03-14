import { useNavigate, useParams } from "react-router-dom";
import { maisonsData } from "../../store/Frontbdd";
import "../../style/describecategory.css";
import Button from "../../ui/Button";
import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const DescribeImmobilier = () => {
  const { nom } = useParams();
  const start = useRef<HTMLDivElement>(null);
  const nomdecode = decodeURIComponent(nom || "");
  const [open10, setopen10] = useState<boolean>(false);
  const navigate = useNavigate();
  const produit = maisonsData.find(
    (p) => p.nom?.toLowerCase().trim() === nomdecode?.toLowerCase().trim(),
  );
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
    produit?.img2,
    produit?.img3,
    produit?.img4,
    produit?.img5,
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
            {produit?.img2 && (
              <img
                src={produit?.img2}
                alt=""
                onClick={() => setphoto(produit.img2 || "")}
              />
            )}
            {produit?.img3 && (
              <img
                src={produit?.img3}
                alt=""
                onClick={() => setphoto(produit.img3 || "")}
              />
            )}
            {produit?.img4 && (
              <img
                src={produit?.img4}
                alt=""
                onClick={() => setphoto(produit.img4 || "")}
              />
            )}
            {produit?.img5 && (
              <img
                src={produit?.img5}
                alt=""
                onClick={() => setphoto(produit.img5 || "")}
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
          {produit?.nom && (
            <p>
              <span>Nom : </span>
              {produit?.nom}
            </p>
          )}
          {produit?.description && (
            <p id="text">
              <span>Description : </span>
              {produit?.description}
            </p>
          )}
          {produit?.villes && (
            <p>
              <span>Villes : </span>
              {produit?.villes}
            </p>
          )}
          {produit?.adresse && (
            <p>
              <span>Adresse : </span>
              {produit?.adresse}
            </p>
          )}
          {produit?.surface && (
            <p>
              <span>Surface : </span>
              {produit?.surface} m2
            </p>
          )}
          {produit?.prix && (
            <p>
              <span>Prix : </span>
              {produit?.prix} €
            </p>
          )}
          {produit?.localisation && (
            <p>
              <span>Localisation : </span>
              {produit?.localisation}
            </p>
          )}
          {produit?.video && (
            <p>
              <span>Video : </span>
              {produit?.video}
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

export default DescribeImmobilier;
