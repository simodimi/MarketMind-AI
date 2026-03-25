import React, { useState } from "react";
import "../style/connexion.css";
import img from "../assets/icone/market.png";
import open from "../assets/icone/ouvert.png";
import close from "../assets/icone/fermé.png";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";

interface dataform {
  mailUser: string;
  passwordUser: string;
}
const Connexion = () => {
  const [modepassword, setmodepassword] = useState<string>("password");
  const [showpassword, setshowpassword] = useState<boolean>(false);
  const [errortext, seterrortext] = useState<string>("");
  const [afficherror, setafficherror] = useState<boolean>(false);
  const [dataform, setdataform] = useState<dataform>({
    mailUser: "",
    passwordUser: "",
  });
  const navigate = useNavigate();
  const passwordvision = () => {
    setmodepassword(!showpassword ? "test" : "password");
    setshowpassword(!showpassword);
  };
  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setdataform({ ...dataform, [name]: value });
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dataform.mailUser && !dataform.passwordUser) {
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

    navigate("/");
    setafficherror(false);
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
                  placeholder="saisir votre adresse mail"
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
            <Button className="accept" type="submit">
              Connexion
            </Button>
          </form>
          <div className="linkConnexion">
            <p>
              Vous n'avez pas de compte :{" "}
              <Link to="/inscription">Créer un compte</Link>{" "}
            </p>
            <p>
              Vous avez oublié votre mot de passe :{" "}
              <Link to="/motdepasseoublie">mot de passe oublié</Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;
