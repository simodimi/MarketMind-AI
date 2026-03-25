import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import Siderbar from "../ui/Siderbar";
import img from "../assets/picturetest/I5.jpg";
import { useNavigate } from "react-router-dom";
import "../style/ui.css";
import imgx from "../assets/icone/market.png";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PaiementStripe from "../pages/PaiementStripe";
interface Formdata {
  name: string;
  numeroVoie: string;
  nomRue: string;
  complementInfo: string;
  ville: string;
  numeroPhone: string;
}
interface coordinate {
  lat: number;
  lng: number;
}

const Paiement = () => {
  const navigate = useNavigate();
  const [position, setPosition] = useState<coordinate | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [renderTrigger, setRenderTrigger] = useState(0); //compteur pour forcer le rafraichissement
  const [texterror, settexterror] = useState<string>("");
  const [trueAdress, settrueAdress] = useState<boolean>(false);
  const [addressVerified, setaddressVerified] = useState<boolean>(true);
  const [falseAddress, setfalseAddress] = useState<boolean>(false);
  const [formdata, setformdata] = useState<Formdata>({
    name: "",
    numeroVoie: "",
    nomRue: "",
    complementInfo: "",
    ville: "",
    numeroPhone: "",
  });

  const RESTO_LOCATION = { lat: 43.2474236, lng: 5.4365722 }; //coordonnées de l'entreprise
  const GEOAPIFY_KEY = "4e9eabed4c1b4a44af8cba6c9d6603e8"; //clés Geoapify
  const [open, setOpen] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const handlechangelivraison = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  };

  const geocodeAddress = async (address: string): Promise<coordinate> => {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.features || data.features.length === 0)
      throw new Error("Adresse introuvable");

    const p = data.features[0].properties;
    if (p.confidence < 0.3) throw new Error("Adresse non fiable");

    return { lat: p.lat, lng: p.lon };
  };

  const getRouteDistance = async (
    from: coordinate,
    to: coordinate,
  ): Promise<number> => {
    const url = `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lng}|${to.lat},${to.lng}&mode=drive&type=balanced&traffic=approximated&details=route_details&apiKey=${GEOAPIFY_KEY}`;

    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Erreur API Geoapify Routing:", res.status, errorText);
      throw new Error(`Erreur API: ${res.status}`);
    }

    const data = await res.json();
    const distanceMeters = data?.features?.[0]?.properties?.distance;

    if (!distanceMeters) {
      throw new Error("Aucune route trouvée");
    }

    return distanceMeters / 1000;
  };

  const calculateDeliveryFee = (distanceKm: number): number => {
    if (distanceKm <= 2) return 1;
    if (distanceKm <= 5) return 2.5;
    if (distanceKm <= 10) return 5;
    return 8 + (distanceKm - 10) * 0.5;
  };

  const getlocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (p: GeolocationPosition) => {
        const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
        setPosition(coords);

        try {
          const distance = await getRouteDistance(RESTO_LOCATION, coords);
          const fee = calculateDeliveryFee(distance);
          console.log("📍 [getlocation] Frais calculés:", fee);
          setDeliveryFee(fee);
          setRenderTrigger((prev) => prev + 1);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`,
          );
          const data = await res.json();
          const a = data.address || {};

          setformdata((prev) => ({
            ...prev,
            numeroVoie: a.house_number || a.housenumber || "",
            nomRue: a.road || a.street || "",
            complementInfo:
              (a.building || a.amenity || "") + "," + (a.suburb || ""),
            ville: a.city || a.town || a.village || "",
          }));

          if (
            a.city?.toLowerCase() !== "marseille" &&
            a.town?.toLowerCase() !== "marseille" &&
            a.village?.toLowerCase() !== "marseille"
          ) {
            alert("Nous livrons uniquement sur Marseille.");
            return;
          }

          settrueAdress(true);
          setaddressVerified(false);
          setfalseAddress(true);
        } catch (err) {
          console.error("Erreur calcul distance:", err);
          alert(
            "Impossible de calculer la distance. Veuillez entrer votre adresse manuellement.",
          );
        }
      },
      (err) => {
        console.error("Erreur géolocalisation:", err);
        alert(
          "Impossible d'accéder à votre localisation. Veuillez entrer votre adresse manuellement.",
        );
      },
    );
  };

  const handleCheckAddress = async () => {
    const fullAddress = `${formdata.numeroVoie} ${formdata.nomRue}${formdata.complementInfo ? ", " + formdata.complementInfo : ""}, ${formdata.ville}`;

    if (!formdata.ville || !formdata.nomRue || !formdata.numeroVoie) {
      settexterror("Veuillez remplir au moins les champs de localisation");
      return;
    }
    if (formdata.ville.trim().toLowerCase() !== "marseille") {
      settexterror("Nous livrons uniquement sur Marseille");
      return;
    }

    settexterror("");

    try {
      const coords = await geocodeAddress(fullAddress);
      setPosition(coords);

      const distanceKm = await getRouteDistance(RESTO_LOCATION, coords);
      const fee = calculateDeliveryFee(distanceKm);

      console.log("📍 [handleCheckAddress] Frais calculés:", fee);
      setDeliveryFee(fee);
      setRenderTrigger((prev) => prev + 1);

      settrueAdress(true);
      setaddressVerified(false);
      setfalseAddress(true);

      alert(
        `📍 Adresse trouvée !\nDistance : ${distanceKm.toFixed(2)} km\nFrais de livraison : ${fee.toFixed(2)} €`,
      );
    } catch (err) {
      console.error("Erreur lors du calcul :", err);
      setfalseAddress(false);
      setaddressVerified(false);
      settrueAdress(false);
      settexterror(
        "Adresse non trouvée, veuillez vérifier la saisie ou activer la localisation",
      );
    }
  };

  const handleLivraison = async () => {
    if (
      !formdata.complementInfo ||
      !formdata.name ||
      !formdata.nomRue ||
      !formdata.numeroPhone ||
      !formdata.numeroVoie ||
      !formdata.ville
    ) {
      settexterror("Veuillez remplir tous les champs");
      return;
    }
    if (formdata.numeroPhone.length !== 10) {
      settexterror(
        "Veuillez entrer un numéro de téléphone valide de 10 chiffres",
      );
      return;
    }
    if (
      !formdata.numeroPhone.startsWith("06") &&
      !formdata.numeroPhone.startsWith("07")
    ) {
      settexterror(
        "Veuillez entrer un numéro valide : 0612345678 ou 0712345678",
      );
      return;
    }
    settexterror("");

    const total = 1000 + deliveryFee;
    console.log("💰 Paiement - Total à payer:", total.toFixed(2), "€");
    setOpen(true);
  };

  const subtotal = 1000;
  const total = subtotal + deliveryFee;
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Tu peux fermer le modal après quelques secondes
    setTimeout(() => {
      setOpen(false);
      // Naviguer vers une page de confirmation
      navigate("/confirmation");
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    settexterror(error);
    setOpen(false);
  };
  return (
    <div className="MainMenu">
      <Siderbar />
      <div className="btnretour">
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
      <div className="ServiceMain">
        <>
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom Article</th>
                <th>Categories</th>
                <th>Quantité</th>
                <th>Prix Total</th>
                <th>Supprimer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src={img} alt="" />
                </td>
                <td>
                  <p>dimitri</p>
                </td>
                <td>
                  <p>IMMOBILIER</p>
                </td>
                <td>
                  <input type="number" name="" id="" defaultValue={1} />
                </td>
                <td>1000</td>
                <td>
                  <Button className="decline">Supprimer</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <img src={img} alt="" />
                </td>
                <td>
                  <p>dimitri</p>
                </td>
                <td>
                  <p>IMMOBILIER</p>
                </td>
                <td>
                  <input type="number" name="" id="" />
                </td>
                <td>1000</td>
                <td>
                  <Button className="decline">Supprimer</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      </div>
      <div className="Prevpayement">
        <div className="PrevpayementPrice" key={renderTrigger}>
          {" "}
          {/* ← AJOUTÉ key */}
          <table>
            <thead>
              <tr>
                <th>
                  <img src={imgx} alt="" />
                </th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sous-total</td>
                <td>{subtotal.toFixed(2)} €</td>
              </tr>
              <tr>
                <td>Réduction</td>
                <td>0.00 €</td>
              </tr>
              <tr>
                <td>Livraison</td>
                <td>{deliveryFee.toFixed(2)} €</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>{total.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
          <div
            className=""
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {trueAdress && <Button onClick={handleLivraison}>Paiement</Button>}
          </div>
          <div className="Prevpayementlocalisation">
            <div className="localisation">
              <p>
                Activer votre localisation ou entrer votre adresse manuellement
              </p>
              <Button onClick={getlocation}>Activer ma localisation</Button>
              <div
                className=""
                style={{
                  margin: "20px 0px",
                }}
              >
                {position && (
                  <iframe
                    title="map"
                    width="100%"
                    height="300px"
                    src={`https://www.google.com/maps?q=${position.lat},${position.lng}&hl=fr&z=14&output=embed`}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="Prevpayementdescribe">
          <p id="erreuradresse">{texterror}</p>

          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="AccountUserInformation">
              <p>Nom :</p>
              <input
                type="text"
                name="name"
                id=""
                placeholder="Entrez votre nom"
                value={formdata.name}
                onChange={handlechangelivraison}
              />
            </div>
            <div className="AccountRue">
              <div className="AccountRueNumber">
                <p>Numéro de voie :</p>
                <input
                  type="number"
                  name="numeroVoie"
                  value={formdata.numeroVoie}
                  onChange={handlechangelivraison}
                  id=""
                  placeholder="Numéro de rue"
                />
              </div>
              <div className="AccountRueName">
                <p>Nom de la rue :</p>
                <input
                  type="text"
                  name="nomRue"
                  id=""
                  placeholder="Entrez votre Nom de rue"
                  value={formdata.nomRue}
                  onChange={handlechangelivraison}
                />
              </div>
            </div>
            <div className="AccountUserInformation">
              <p>Complément d'information :</p>
              <input
                type="text"
                name="complementInfo"
                id=""
                placeholder="Entrez votre Complément d'information"
                value={formdata.complementInfo}
                onChange={handlechangelivraison}
              />
            </div>
            <div className="AccountUserInf">
              <div className="AccountUserInfs">
                <p>Ville :</p>
                <input
                  type="text"
                  name="ville"
                  placeholder="Entrez votre ville"
                  value={formdata.ville}
                  onChange={handlechangelivraison}
                />
              </div>
              <div className="AccountUserInfs">
                <p>Téléphone :</p>
                <input
                  type="tel"
                  name="numeroPhone"
                  placeholder="Entrez votre Numéro de téléphone"
                  value={formdata.numeroPhone}
                  onChange={handlechangelivraison}
                />
              </div>
            </div>
            <div className="btnprepayments">
              {addressVerified ? (
                <Button onClick={handleCheckAddress}>
                  Vérifier mon adresse
                </Button>
              ) : falseAddress ? (
                <Button onClick={handleCheckAddress}>
                  ✅ Adresse vérifiée
                </Button>
              ) : (
                <Button onClick={handleCheckAddress}>
                  ❌ Adresse non vérifiée,veuillez modifier l'adresse
                </Button>
              )}
            </div>
            <div className="Delivery" key={renderTrigger}>
              {" "}
              <p>Frais de livraison : {deliveryFee.toFixed(2)} €</p>
              <p>Total: {total.toFixed(2)} €</p>
            </div>
          </form>
        </div>
      </div>
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)} className="opendoc">
          <DialogContent>
            <DialogContentText
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={imgx} alt="" />
              <p style={{ paddingTop: "10px" }}>Hello dimitri</p>
            </DialogContentText>
          </DialogContent>
          <DialogContent>
            <DialogContentText
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              {!paymentSuccess ? (
                <PaiementStripe
                  amount={total}
                  customerName={formdata.name}
                  customerEmail="client@email.com" // Ajoute un champ email si besoin
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              ) : (
                <div className="stripe-success">
                  <h3>✅ Paiement réussi !</h3>
                  <p>Merci pour votre commande.</p>
                  <p>Redirection en cours...</p>
                </div>
              )}
            </DialogContentText>
          </DialogContent>
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <Button className="retour" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Paiement;
