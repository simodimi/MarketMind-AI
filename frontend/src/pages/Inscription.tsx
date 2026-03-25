import React, { useState } from "react";
import "../style/connexion.css";
import img from "../assets/icone/market.png";
import open from "../assets/icone/ouvert.png";
import close from "../assets/icone/fermé.png";
import Button from "../ui/Button";
import tr from "../assets/icone/true.png";
import fa from "../assets/icone/cancel.png";
import { Link, useNavigate } from "react-router-dom";

interface dataform {
  nameUser: string;
  mailUser: string;
  passwordUser: string;
  confirmpasswordUser: string;
}
interface restriction {
  id: number;
  text: string;
}
const restriction: restriction[] = [
  { id: 1, text: "Au moins 8 lettres." },
  { id: 2, text: "Au moins 1 minuscule." },
  { id: 3, text: "Au moins 1 majuscule." },
  { id: 4, text: "Au moins 1 chiffre." },
  { id: 5, text: "Au moins 1 caractère spécial." },
];
const Inscription = () => {
  const [modepassword, setmodepassword] = useState<string>("password");
  const [showpassword, setshowpassword] = useState<boolean>(false);
  const [modepassword1, setmodepassword1] = useState<string>("password");
  const [showpassword1, setshowpassword1] = useState<boolean>(false);
  const [errortext, seterrortext] = useState<string>("");
  const [afficherror, setafficherror] = useState<boolean>(false);
  const [dataform, setdataform] = useState<dataform>({
    nameUser: "",
    mailUser: "",
    passwordUser: "",
    confirmpasswordUser: "",
  });
  const [verif, setverif] = useState<boolean>(false);
  const navigate = useNavigate();
  const passwordvision = () => {
    setmodepassword(!showpassword ? "test" : "password");
    setshowpassword(!showpassword);
  };
  const passwordvision1 = () => {
    setmodepassword1(!showpassword1 ? "test" : "password");
    setshowpassword1(!showpassword1);
  };
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setdataform({ ...dataform, [name]: value });
    if (name === "passwordUser") {
      setverif(value.trim().length > 0);
    }
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !dataform.mailUser &&
      !dataform.passwordUser &&
      !dataform.nameUser &&
      !dataform.confirmpasswordUser
    ) {
      setafficherror(true);
      seterrortext("Veuillez remplir tous les champs");
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(dataform.mailUser)) {
      setafficherror(true);
      seterrortext("l'email ne respecte pas la forme");
      return;
    }
    if (dataform.passwordUser !== dataform.confirmpasswordUser) {
      setafficherror(true);
      seterrortext("les mots de passe ne correspondent pas");
      return;
    }
    const pass = dataform.passwordUser;
    const check = {
      longueur: pass.length >= 8,
      chiffre: /\d/.test(pass),
      majuscule: /[A-Z]/.test(pass),
      minuscule: /[a-z]/.test(pass),
      symbole: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    if (!Object.values(check).every((p) => p)) {
      setafficherror(true);
      seterrortext("le mot de passe ne respecte pas le standard");
      return;
    }

    navigate("/");
    setafficherror(false);
  };

  const checkpass = (password: restriction) => {
    const pass = dataform.passwordUser;
    if (password.id === 1) {
      return pass.length >= 8;
    }
    if (password.id === 2) {
      return /[a-z]/.test(pass);
    }
    if (password.id === 3) {
      return /[A-Z]/.test(pass);
    }
    if (password.id === 4) {
      return /\d/.test(pass);
    }
    if (password.id === 5) {
      return /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    }
    return false;
  };
  return (
    <div className="ConnexionHeader">
      <div className="ConnexionBar">
        <div className="ConnexionDescribe">
          <img src={img} alt="" />
          <p>MarketMind-AI</p>
        </div>
        {afficherror && <p id="error">{errortext}</p>}
        <div className="ConnexionForm">
          <form action="" onSubmit={handleSubmit}>
            <div className="FormPart">
              <p>Nom</p>
              <input
                type="text"
                name="nameUser"
                value={dataform.nameUser}
                id=""
                placeholder="saisir votre nom"
                onChange={handlechange}
              />
            </div>
            <div className="FormPart">
              <p>Email</p>
              <input
                type="email"
                name="mailUser"
                value={dataform.mailUser}
                id=""
                placeholder="saisir votre adresse mail"
                onChange={handlechange}
              />
            </div>
            <div className="FormPart">
              <p>Mot de passe</p>
              <div className="FormpartEye">
                <input
                  type={modepassword}
                  name="passwordUser"
                  value={dataform.passwordUser}
                  id=""
                  placeholder="saisir votre mot de passe"
                  onChange={handlechange}
                />
                <div className="eyeConnexion">
                  <img
                    src={showpassword ? open : close}
                    alt=""
                    onClick={passwordvision}
                  />
                </div>
              </div>
            </div>
            <div className="FormPart">
              <p>Confirmer Mot de passe</p>
              <div className="FormpartEye">
                <input
                  type={modepassword1}
                  name="confirmpasswordUser"
                  value={dataform.confirmpasswordUser}
                  id=""
                  placeholder="confirmer votre mot de passe"
                  onChange={handlechange}
                />
                <div className="eyeConnexion">
                  <img
                    src={showpassword1 ? open : close}
                    alt=""
                    onClick={passwordvision1}
                  />
                </div>
              </div>
            </div>
            {verif && (
              <div className="Restriction">
                {restriction.map((p) => (
                  <div
                    className="RestrictionPart"
                    key={p.id}
                    style={{ color: checkpass(p) ? "green" : "red" }}
                  >
                    <img src={checkpass(p) ? tr : fa} alt="" />
                    <p>{p.text}</p>
                  </div>
                ))}
              </div>
            )}
            <Button className="accept" type="submit">
              Connexion
            </Button>
          </form>
          <div className="linkConnexion">
            <p>
              Vous avez un compte :{" "}
              <Link to="/connexion">Connectez vous</Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
