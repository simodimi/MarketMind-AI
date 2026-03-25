import Siderbar from "../ui/Siderbar";
import down from "../assets/icone/aD.png";
import up from "../assets/icone/aU.png";
import "../style/ui.css";
import Button from "../ui/Button";
import React, { useState } from "react";

interface Hide {
  hide1: boolean;
  hide2: boolean;
  hide3: boolean;
  hide4: boolean;
  hide5: boolean;
  hide6: boolean;
  hide7: boolean;
}
interface formulaire {
  Email: string;
  Message: string;
}
const Service = () => {
  const [hide, sethide] = useState<Hide>({
    hide1: false,
    hide2: true,
    hide3: true,
    hide4: true,
    hide5: true,
    hide6: true,
    hide7: true,
  });
  const [formdata, setformdata] = useState<formulaire>({
    Email: "",
    Message: "",
  });
  const [errormessage, setErrormessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setformdata((prev) => ({ ...prev, [name]: value }));
  };
  const handlesubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formdata.Email || !formdata.Message) {
      setErrormessage("Veuillez remplir tout les champs");
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(formdata.Email)) {
      setErrormessage("Veuillez entrer une adresse email valide");
      return;
    }
    setformdata({
      ...formdata,
      Email: formdata.Email,
      Message: formdata.Message,
    });
    setErrormessage("message envoyé");
    console.log(formdata);
    setformdata({ Email: "", Message: "" });
    setErrormessage("");
  };
  return (
    <div className="MainMenu">
      <Siderbar />
      <div className="ServiceMain">
        <div className="ServiceMainItem">
          <div className="ServiceMainItemTitle">
            <div className="ServiceMainItemTitleLeft">
              <p>Services – MarketMind-AI</p>
            </div>
            <div className="ServiceMainItemTitleRight">
              {
                <img
                  src={hide.hide1 ? down : up}
                  alt=""
                  onClick={() => sethide({ ...hide, hide1: !hide.hide1 })}
                />
              }
            </div>
          </div>
          {!hide.hide1 && (
            <div className="ServiceMainItemDescription">
              <p>
                Une plateforme pensée pour maximiser la performance des
                acheteurs et des vendeurs MarketMind-AI ne se limite pas à une
                simple marketplace. Notre plateforme a été conçue comme un
                écosystème intelligent, où chaque utilisateur acheteur comme
                vendeur bénéficie d’outils avancés basés sur l’intelligence
                artificielle, la data et l’automatisation. L’objectif est simple
                : faciliter les décisions, optimiser les performances et créer
                des opportunités de croissance concrètes. Nos services sont
                organisés autour de trois piliers fondamentaux : l’expérience
                utilisateur, la performance commerciale et l’intelligence de
                marché.
              </p>
            </div>
          )}
        </div>
        <div className="ServiceMainItem">
          <div className="ServiceMainItemTitle">
            <div className="ServiceMainItemTitleLeft">
              <p>Services pour les acheteurs</p>
            </div>
            <div className="ServiceMainItemTitleRight">
              {
                <img
                  src={hide.hide2 ? down : up}
                  alt=""
                  onClick={() => sethide({ ...hide, hide2: !hide.hide2 })}
                />
              }
            </div>
          </div>
          {!hide.hide2 && (
            <div className="ServiceMainItemDescription">
              <h1>
                Une expérience d’achat guidée par l’intelligence artificielle
              </h1>
              <p>
                Les acheteurs bénéficient d’un environnement intelligent qui
                simplifie la recherche et améliore la qualité des décisions.
                Grâce à nos algorithmes avancés, MarketMind-AI analyse les
                comportements, les préférences et les tendances du marché afin
                de proposer des recommandations hautement personnalisées. Chaque
                utilisateur accède ainsi à des produits réellement pertinents,
                sans perdre de temps dans des recherches inutiles. Un assistant
                intelligent est également disponible pour accompagner
                l’utilisateur tout au long de son parcours. Il permet de poser
                des questions, d’affiner les besoins et d’obtenir des
                suggestions adaptées en temps réel, créant une expérience fluide
                et intuitive.
              </p>
              <h1>Une prise de décision basée sur la donnée</h1>
              <p>
                Afin de réduire les risques liés à l’achat, MarketMind-AI met à
                disposition des outils d’analyse avancés. Les acheteurs peuvent
                consulter des indicateurs clés tels que la fiabilité des
                vendeurs, la qualité estimée des produits ou encore les
                tendances du marché. Ces données permettent d’acheter en toute
                confiance, avec une vision claire et objective. La plateforme
                intègre également des systèmes de comparaison intelligents,
                permettant d’évaluer rapidement plusieurs produits selon
                différents critères (prix, performance, popularité), afin
                d’optimiser chaque décision d’achat.
              </p>
              <h1>Une optimisation continue des dépenses</h1>
              <p>
                MarketMind-AI aide les utilisateurs à acheter au meilleur moment
                et au meilleur prix. Des alertes intelligentes informent les
                acheteurs des baisses de prix ou des opportunités intéressantes.
                En parallèle, des mécanismes de détection de bonnes affaires
                identifient automatiquement les produits sous-évalués ou en
                forte demande. Les utilisateurs premium bénéficient d’avantages
                supplémentaires tels que des offres exclusives, des récompenses
                fidélité et un accès anticipé à certaines opportunités.
              </p>
              <h1>Une expérience après-achat fluide et sécurisée</h1>
              <p>
                Au-delà de l’achat, la plateforme garantit un suivi complet des
                commandes, avec des notifications en temps réel et des
                estimations précises de livraison. Les utilisateurs peuvent
                également gérer facilement les retours et accéder à un support
                client réactif. Pour les membres premium, un service prioritaire
                est mis en place afin de garantir une assistance rapide et
                efficace à chaque étape.
              </p>
            </div>
          )}
        </div>
        <div className="ServiceMainItem">
          <div className="ServiceMainItemTitle">
            <div className="ServiceMainItemTitleLeft">
              <p>Services pour les vendeurs</p>
            </div>
            <div className="ServiceMainItemTitleRight">
              {
                <img
                  src={hide.hide3 ? down : up}
                  alt=""
                  onClick={() => sethide({ ...hide, hide3: !hide.hide3 })}
                />
              }
            </div>
          </div>
          {!hide.hide3 && (
            <div className="ServiceMainItemDescription">
              <h1>Une mise en ligne simplifiée et optimisée</h1>
              <p>
                MarketMind-AI permet aux vendeurs de créer et gérer leurs
                produits de manière efficace grâce à des outils intelligents.
                Les fiches produits peuvent être générées automatiquement avec
                des descriptions optimisées pour le référencement, augmentant
                ainsi leur visibilité. La plateforme propose également des
                fonctionnalités d’optimisation des titres, des mots-clés et des
                contenus, ainsi que des outils de traduction automatique pour
                faciliter l’accès à des marchés internationaux.
              </p>
              <h1>Des outils puissants pour piloter la performance</h1>
              <p>
                Les vendeurs disposent d’un tableau de bord complet offrant une
                vision claire de leur activité : ventes, taux de conversion,
                trafic, comportement des utilisateurs. Ces données sont
                enrichies par des analyses avancées permettant d’identifier les
                points d’amélioration et les opportunités de croissance. Grâce à
                l’intelligence artificielle, MarketMind-AI fournit des
                recommandations stratégiques, notamment en matière de pricing,
                afin d’optimiser les revenus. Des outils de prévision permettent
                également d’anticiper la demande et d’adapter les stocks en
                conséquence.
              </p>
              <h1>Une acquisition client optimisée</h1>
              <p>
                La plateforme intègre des solutions marketing avancées pour
                aider les vendeurs à gagner en visibilité. Il est possible de
                lancer des campagnes sponsorisées, d’automatiser des actions
                marketing ou encore de mettre en place des stratégies
                d’acquisition performantes. Ces outils permettent de cibler
                efficacement les bons acheteurs, d’améliorer la conversion et de
                développer rapidement son activité au sein de la marketplace.
              </p>
              <h1>Une automatisation intelligente des opérations</h1>
              <p>
                Pour gagner en efficacité, MarketMind-AI propose des
                fonctionnalités d’automatisation avancées. Les vendeurs peuvent
                automatiser la gestion des stocks, les réponses aux clients ou
                encore la mise en place de promotions. Ces automatisations
                permettent de réduire les tâches répétitives et de se concentrer
                sur des activités à plus forte valeur ajoutée.
              </p>
            </div>
          )}
        </div>
        <div className="ServiceMainItem">
          <div className="ServiceMainItemTitle">
            <div className="ServiceMainItemTitleLeft">
              <p>Offres Premium</p>
            </div>
            <div className="ServiceMainItemTitleRight">
              {
                <img
                  src={hide.hide4 ? down : up}
                  alt=""
                  onClick={() => sethide({ ...hide, hide4: !hide.hide4 })}
                />
              }
            </div>
          </div>
          {!hide.hide4 && (
            <div className="ServiceMainItemDescription">
              <h1>Pour les acheteurs</h1>
              <p>
                Les utilisateurs premium accèdent à une expérience enrichie
                incluant des recommandations ultra personnalisées, des offres
                exclusives, un support prioritaire et une navigation optimisée
                sans interruption.
              </p>
              <h1>Pour les vendeurs</h1>
              <p>
                Les vendeurs premium bénéficient d’un avantage concurrentiel
                significatif grâce à une meilleure visibilité, des outils
                d’analyse avancés, des frais optimisés et un accès à des
                fonctionnalités marketing et stratégiques exclusives.
              </p>
            </div>
          )}
        </div>
        <div className="ServiceMainItem">
          <div className="ServiceMainItemTitle">
            <div className="ServiceMainItemTitleLeft">
              <p>Intelligence et innovation au cœur de la plateforme</p>
            </div>
            <div className="ServiceMainItemTitleRight">
              {
                <img
                  src={hide.hide5 ? down : up}
                  alt=""
                  onClick={() => sethide({ ...hide, hide5: !hide.hide5 })}
                />
              }
            </div>
          </div>
          {!hide.hide5 && (
            <div className="ServiceMainItemDescription">
              <p>
                MarketMind-AI se distingue par ses outils innovants, conçus pour
                exploiter pleinement la puissance de la data et de
                l’intelligence artificielle. La plateforme intègre notamment des
                systèmes d’évaluation intelligente permettant d’analyser les
                produits, les vendeurs et les opportunités de marché. Des
                fonctionnalités avancées permettent également d’identifier des
                niches prometteuses, de prédire le potentiel de succès d’un
                produit ou encore de connecter automatiquement les bons
                acheteurs avec les bons vendeurs.
              </p>
            </div>
          )}
        </div>
        <div className="ServiceMainItem">
          <div className="ServiceMainItemTitle">
            <div className="ServiceMainItemTitleLeft">
              <p>Sécurité et fiabilité</p>
            </div>
            <div className="ServiceMainItemTitleRight">
              {
                <img
                  src={hide.hide6 ? down : up}
                  alt=""
                  onClick={() => sethide({ ...hide, hide6: !hide.hide6 })}
                />
              }
            </div>
          </div>
          {!hide.hide6 && (
            <div className="ServiceMainItemDescription">
              <p>
                La sécurité des transactions et la protection des utilisateurs
                sont au cœur de notre engagement. MarketMind-AI intègre des
                systèmes de paiement sécurisés, des mécanismes de protection
                contre la fraude et des protocoles garantissant la
                confidentialité des données. Chaque interaction sur la
                plateforme est pensée pour offrir un environnement fiable,
                transparent et sécurisé.
              </p>
            </div>
          )}
        </div>
        <div className="ServiceMainItem">
          <div className="ServiceMainItemTitle">
            <div className="ServiceMainItemTitleLeft">
              <p>Contacts – MarketMind-AI</p>
            </div>
            <div className="ServiceMainItemTitleRight">
              {
                <img
                  src={hide.hide7 ? down : up}
                  alt=""
                  onClick={() => sethide({ ...hide, hide7: !hide.hide7 })}
                />
              }
            </div>
          </div>
          {!hide.hide7 && (
            <div className="ServiceMainItemDescription">
              <h1>Une équipe à votre écoute</h1>
              <p>
                Nous attachons une grande importance à l’accompagnement de nos
                utilisateurs. Que vous soyez acheteur, vendeur ou partenaire,
                notre équipe est disponible pour répondre à vos questions, vous
                guider et vous aider à tirer le meilleur parti de la plateforme.
              </p>
              <p>
                Envoyer un mail à{" "}
                <a href="mailto:simodimitri08@gmail.com">
                  MarketMind-AI@gmail.com
                </a>{" "}
              </p>
              <p>Joindre notre service client :</p>

              <p
                style={{
                  textAlign: "center",
                  color:
                    errormessage === ""
                      ? ""
                      : errormessage === "message envoyé"
                        ? "green"
                        : "red",
                }}
              >
                {errormessage}
              </p>

              <div className="smsAdmin">
                <form onSubmit={handlesubmit}>
                  <p>Email</p>
                  <input
                    type="email"
                    name="Email"
                    value={formdata.Email}
                    id=""
                    placeholder="saisir votre email"
                    onChange={handleChange}
                  />
                  <p>Message</p>
                  <textarea
                    name="Message"
                    id=""
                    value={formdata.Message}
                    placeholder="saisir votre message"
                    onChange={handleChange}
                  ></textarea>
                  <Button type="submit">Envoyer</Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Service;
