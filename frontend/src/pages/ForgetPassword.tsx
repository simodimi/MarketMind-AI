import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import img from "../assets/icone/market.png";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import open from "../assets/icone/ouvert.png";
import close from "../assets/icone/fermé.png";
import tr from "../assets/icone/true.png";
import fa from "../assets/icone/cancel.png";
import { Link, useNavigate } from "react-router-dom";
interface dataform {
  codeUser: string;
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
  { id: 300, text: "Au moins 1 majuscule." },
  { id: 4, text: "Au moins 1 chiffre." },
  { id: 5, text: "Au moins 1 caractère spécial." },
];

const steps = [
  "Veuillez saisir votre adresse mail",
  "Valider votre code de réinitialisation",
  "Changer votre mot de passe",
];

const ForgetPassword = () => {
  const [verif, setverif] = useState<boolean>(false);
  const [modepassword, setmodepassword] = useState<string>("password");
  const [showpassword, setshowpassword] = useState<boolean>(false);
  const [modepassword1, setmodepassword1] = useState<string>("password");
  const [showpassword1, setshowpassword1] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errortext, seterrortext] = useState<string>("");
  const [time, setTime] = useState(300);
  const [timerStarted, setTimerStarted] = useState<boolean>(false);
  const [afficherror, setafficherror] = useState<boolean>(false);
  const navigate = useNavigate();
  const [completed] = useState<{
    [k: number]: boolean;
  }>({});
  const [dataform, setdataform] = useState<dataform>({
    mailUser: "",
    passwordUser: "",
    confirmpasswordUser: "",
    codeUser: "",
  });
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const secondes = (time % 60).toString().padStart(2, "0");

  useEffect(() => {
    //si on est à l'étape 0 ou si le time n'a pas été démarré
    if (activeStep === 0 || timerStarted === false) {
      return;
    }
    if (time === 0) {
      setActiveStep(0);
      setTime(300);
      setTimerStarted(false);
      setafficherror(true);
      seterrortext("temps écoulé,veuillez recommencer le processus");
      return;
    }
    const interval = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time, activeStep, timerStarted]);

  const handleNext = () => {
    if (activeStep === 0) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!dataform.mailUser) {
        (setafficherror(true),
          seterrortext("veuillez saisir votre adresse mail"));
        return;
      }
      if (!regex.test(dataform.mailUser)) {
        (setafficherror(true),
          seterrortext("veuillez saisir une adresse mail correcte"));
        return;
      }

      setActiveStep(1);
      setTime(300);
      setTimerStarted(true);
      setafficherror(false);
      seterrortext("");
    }
    if (activeStep === 1) {
      if (!dataform.codeUser) {
        (setafficherror(true),
          seterrortext("veuillez saisir votre numéro de vérification"));
        return;
      }
      if (dataform.codeUser !== "123456") {
        (setafficherror(true),
          seterrortext("veuillez saisir un numéro correct"));
        return;
      }
      setActiveStep(2);
      setafficherror(false);
      seterrortext("");
    }
    if (activeStep === 2) {
      if (!dataform.passwordUser && !dataform.confirmpasswordUser) {
        (setafficherror(true),
          seterrortext("veuillez remplir tous les champs"));
        return;
      }
      if (dataform.passwordUser !== dataform.confirmpasswordUser) {
        (setafficherror(true),
          seterrortext("les mots de passe ne correspondent pas"));
        return;
      }
      const pass = dataform.passwordUser;
      const check = {
        longueur: pass.trim().length >= 8,
        chiffre: /\d/.test(pass),
        majuscule: /[A-Z]/.test(pass),
        minuscule: /[a-z]/.test(pass),
        symbole: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      };
      if (!Object.values(check).every((p) => p)) {
        (setafficherror(true),
          seterrortext("le mot de passe ne respecte pas le standard"));
        return;
      }
      setTime(300);
      setTimerStarted(false);
      navigate("/connexion");
      setafficherror(false);
      seterrortext("");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (activeStep === 0) {
      setTimerStarted(false);
      setTime(300);
    }
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
    if (step === 0) {
      setTimerStarted(false);
      setTime(300);
    }
  };

  const handlechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setdataform({ ...dataform, [name]: value });
    if (name === "passwordUser") {
      setverif(value.trim().length > 0);
    }
  };
  const handlesubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
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
  const handlepassword = () => {
    setshowpassword(!showpassword);
    setmodepassword(!showpassword ? "text" : "password");
  };
  const handlepassword1 = () => {
    setshowpassword1(!showpassword1);
    setmodepassword1(!showpassword1 ? "text" : "password");
  };
  return (
    <div className="ConnexionHeader">
      <div className="ConnexionBars">
        <div className="ConnexionDescribe">
          <img src={img} alt="" />
          <p>MarketMind-AI</p>
        </div>
        {afficherror && <p id="error">{errortext}</p>}
        <div className="ConnexionForm">
          <Box sx={{ width: "100%", marginTop: "40px" }}>
            <Stepper
              nonLinear
              activeStep={activeStep}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "green", // étape complétée (texte + icône)
                },
                "& .MuiStepLabel-root .Mui-active": {
                  color: "white", // étape active
                },
                "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                  fill: "#0979e9", // numéro dans le cercle actif
                },
                "& .MuiStepLabel-root .MuiStepIcon-root": {
                  color: "gray", // étapes non actives
                },
                "& .MuiStepIcon-root.Mui-active": {
                  color: "WHITE", // cercle actif
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: "#2e7d3002", // cercle complété
                },
              }}
            >
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton onClick={handleStep(index)}>{label}</StepButton>
                </Step>
              ))}
            </Stepper>
            <form action="" onSubmit={handlesubmit}>
              {activeStep === 0 && (
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
              )}
              {activeStep === 1 && (
                <div className="FormPart">
                  <div className="horloge">
                    <p>
                      <span>{minutes}</span> : <span>{secondes}</span>
                    </p>
                  </div>
                  <p>Numéro de validation</p>
                  <span style={{ color: "white" }}>
                    Vérifier votre boîte mail,vous avez reçu un code.
                  </span>
                  <input
                    type="number"
                    name="codeUser"
                    value={dataform.codeUser}
                    id=""
                    placeholder="saisir votre adresse mail"
                    onChange={handlechange}
                  />
                </div>
              )}
              {activeStep === 2 && (
                <>
                  <div className="FormPart">
                    <p>Mot de passe</p>
                    <div className="FormpartEye">
                      <input
                        type={modepassword}
                        name="passwordUser"
                        id=""
                        value={dataform.passwordUser}
                        placeholder="saisir votre mot de passe"
                        onChange={handlechange}
                      />
                      <div className="eyeConnexion">
                        <img
                          src={showpassword ? open : close}
                          alt=""
                          onClick={handlepassword}
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
                          onClick={handlepassword1}
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
                </>
              )}
            </form>
            <div>
              <>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  {activeStep !== 0 && (
                    <Button className="decline" onClick={handleBack}>
                      Retour
                    </Button>
                  )}
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleNext} className="accept">
                    Suivant
                  </Button>
                </Box>
              </>
            </div>
          </Box>
        </div>
        {activeStep === 0 && (
          <div className="linkConnexion">
            <p>
              Vous avez un compte :{" "}
              <Link to="/connexion">Connectez vous</Link>{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
