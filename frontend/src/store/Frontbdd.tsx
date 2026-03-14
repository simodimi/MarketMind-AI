import A1 from "../assets/categories/maison.png";
import A2 from "../assets/categories/auto.png";
import A3 from "../assets/categories/mode.png";
import A4 from "../assets/categories/électronique.png";
import A5 from "../assets/categories/loisir.png";
import A6 from "../assets/categories/jardin.png";
import A7 from "../assets/categories/emploi.png";
import A8 from "../assets/categories/autre.png";
import A9 from "../assets/categories/app.png";
import A10 from "../assets/categories/vendre.png";
import A11 from "../assets/categories/garage.png";
import A12 from "../assets/categories/moto.png";
import A13 from "../assets/categories/camion.png";
import A14 from "../assets/categories/chaussure.png";
import A15 from "../assets/categories/bijou.png";
import A16 from "../assets/categories/pc.png";
import A17 from "../assets/categories/tel.png";
import A18 from "../assets/categories/micro.png";
import A19 from "../assets/categories/usine.png";
import A20 from "../assets/categories/don.png";

import C1 from "../assets/imagemain/1.jpg";
import C2 from "../assets/imagemain/2.jpg";
import C3 from "../assets/imagemain/3.jpg";
import C4 from "../assets/imagemain/4.jpg";
import C5 from "../assets/imagemain/5.jpg";
import C6 from "../assets/imagemain/6.jpg";
import C7 from "../assets/imagemain/7.jpg";
import C8 from "../assets/imagemain/8.jpg";
import C9 from "../assets/imagemain/9.jpg";
import C10 from "../assets/imagemain/10.jpg";

//immobilier/maison
import I1 from "../assets/picturetest/I1.jpg";
import I2 from "../assets/picturetest/I2.jpg";
import I3 from "../assets/picturetest/I3.jpg";
import I4 from "../assets/picturetest/I4.jpg";
import I5 from "../assets/picturetest/I5.jpg";
import I6 from "../assets/picturetest/I6.jpg";
export interface Categories {
  id: number;
  name: string;
  photo: string;
  link: string;
}
export interface Element {
  [theme: string]: Categories[];
}
export const Categories: Categories[] = [
  {
    id: 1,
    name: "Immobilier",
    photo: A1,
    link: "/categories/immobilier/maison",
  },
  { id: 2, name: "Auto", photo: A2, link: "/categories/auto" },
  { id: 3, name: "Mode", photo: A3, link: "/categories/mode" },
  { id: 4, name: "électronique", photo: A4, link: "/categories/electronique" },
  { id: 7, name: "Emploi", photo: A7, link: "/categories/emploi" },
  { id: 8, name: "Autres", photo: A8, link: "/categories/autre" },
];
export const Elements: Element = {
  Immobilier: [
    { id: 1, name: "Maison", photo: A1, link: "/categories/immobilier/maison" },
    {
      id: 2,
      name: "Appartement",
      photo: A9,
      link: "/categories/immobilier/appartement",
    },
    {
      id: 3,
      name: "Terrain",
      photo: A10,
      link: "/categories/immobilier/terrain",
    },
    {
      id: 4,
      name: "Bureau",
      photo: A11,
      link: "/categories/immobilier/bureau",
    },
    { id: 5, name: "Autre", photo: A8, link: "/categories/immobilier/autre" },
  ],
  Auto: [
    { id: 1, name: "Voiture", photo: A2, link: "immobilier" },
    { id: 2, name: "Moto", photo: A12, link: "immobilier" },
    { id: 3, name: "Camion", photo: A13, link: "immobilier" },
    { id: 4, name: "Autre", photo: A8, link: "immobilier" },
  ],
  Mode: [
    { id: 1, name: "Vetements", photo: A3, link: "immobilier" },
    { id: 2, name: "Chaussures", photo: A14, link: "immobilier" },
    { id: 3, name: "Accessoires", photo: A15, link: "immobilier" },
    { id: 4, name: "Autre", photo: A8, link: "immobilier" },
  ],
  Electronique: [
    { id: 1, name: "Ordinateur", photo: A16, link: "immobilier" },
    { id: 2, name: "téléphone", photo: A17, link: "immobilier" },
    { id: 3, name: "froid et chauffage", photo: A18, link: "immobilier" },
    { id: 4, name: "Autre", photo: A8, link: "immobilier" },
  ],

  Emploi: [
    { id: 1, name: "Secteur transport", photo: A2, link: "immobilier" },
    { id: 2, name: "Secteur industriel", photo: A19, link: "immobilier" },
    { id: 3, name: "Secteur commercial", photo: A3, link: "immobilier" },
    { id: 4, name: "Secteur Informatique", photo: A4, link: "immobilier" },
    { id: 5, name: "Autre", photo: A8, link: "immobilier" },
  ],
  Autre: [
    { id: 1, name: "Dons", photo: A20, link: "immobilier" },
    { id: 2, name: "Autre", photo: A8, link: "immobilier" },
  ],
};
export const defilement: Categories[] = [
  { id: 1, name: "électronique", photo: C1, link: "immobilier" },
  { id: 2, name: "électronique", photo: C2, link: "immobilier" },
  { id: 3, name: "Immobilier", photo: C3, link: "immobilier" },
  { id: 4, name: "Immobilier", photo: C4, link: "immobilier" },
  { id: 5, name: "Immobilier", photo: C5, link: "immobilier" },
  { id: 6, name: "Auto", photo: C6, link: "immobilier" },
  { id: 7, name: "Auto", photo: C7, link: "immobilier" },
  { id: 8, name: "Mode", photo: C8, link: "immobilier" },
  { id: 9, name: "Mode", photo: C9, link: "immobilier" },
  { id: 10, name: "Mode", photo: C10, link: "immobilier" },
];

// src/data/maisonsData.ts

export interface Maison {
  id: number;
  prix?: number;
  nom?: string;
  description?: string;
  villes?: string;
  adresse?: string;
  surface?: number;
  chambres?: number;
  sdb?: number;
  photo?: string;
  img2?: string;
  img3?: string;
  img4?: string;
  img5?: string;
  video?: string;
  localisation?: string;
  autrechoses?: string;
}

export const maisonsData: Maison[] = [
  {
    id: 1,
    prix: 250000,
    nom: "Villa moderne avec piscine",
    description:
      "Superbe villa contemporaine de 120m² construite en 2022, nichée dans le quartier calme et prisé de Californie. La propriété dispose d'un salon spacieux baigné de lumière grâce à ses baies vitrées orientées sud, d'une cuisine américaine entièrement équipée avec îlot central en granit, et de 4 chambres dont une suite parentale avec dressing et salle d'eau privative. À l'extérieur, vous profiterez d'une piscine chauffée de 8x4m avec plage en bois exotique, d'un jardin paysager de 300m² automatisé avec système d'arrosage intégré, et d'un garage double fermé. La maison est équipée de la climatisation réversible, de panneaux solaires pour l'eau chaude, et d'un système d'alarme. Idéalement située à 5 minutes des écoles, commerces et de la plage.",
    villes: "Casablanca",
    adresse: "12 Rue des Jardins, Quartier Californie",
    surface: 120,
    chambres: 4,
    sdb: 3,
    photo: I1,
    autrechoses: "",
    img2: I2,
    img3: I3,
    img4: I4,
    img5: I5,
  },
  {
    id: 2,
    prix: 185000,
    nom: "Maison de ville rénovée",
    description:
      "Charmante maison de ville de 90m² datant des années 1930, entièrement rénovée en 2023 avec des matériaux nobles et un soin exceptionnel apporté aux détails d'époque. Le rez-de-chaussée se compose d'un séjour traversant avec cheminée en marbre et parquet point de Hongrie, d'une cuisine ouverte équipée d'électroménager haut de gamme, et d'un jardin privatif de 50m² sans vis-à-vis. À l'étage, vous trouverez trois chambres lumineuses dont une avec balcon filant, une salle de bains design avec baignoire îlot et douche à l'italienne, ainsi qu'un bureau aménagé sous les combles. Les rénovations récentes incluent l'électricité aux normes, une pompe à chaleur, une isolation phonique et thermique renforcée, et des menuiseries double vitrage. Proximité immédiate du tramway, des écoles primaires et du marché bio du quartier Agdal.",
    villes: "Rabat",
    adresse: "45 Avenue Hassan II, Agdal",
    surface: 90,
    chambres: 3,
    sdb: 2,
    photo: I2,
    localisation: "map",
    video: "video",
    autrechoses: "",
    img2: I2,
    img3: I3,
    img4: I4,
    img5: I5,
  },
  {
    id: 3,
    prix: 320000,
    nom: "Ferme rénovée avec terrain",
    description:
      "Authentique ferme marocaine de 150m², restaurée avec passion en préservant son âme tout en y apportant tout le confort moderne. Située à 15 minutes de Marrakech, cette propriété unique offre un cadre de vie exceptionnel au cœur de la palmeraie. La bâtisse principale comprend un vaste salon avec cheminée et poutres apparentes, une cuisine traditionnelle équipée, quatre chambres chacune avec salle d'eau privative, et une magnifique terrasse panoramique avec vue sur l'Atlas. Le terrain arboré de 2000m² abrite un potager bio, une oliveraie, une piscine naturelle de 12x6m, et plusieurs dépendances pouvant être aménagées en gîtes. La propriété est autonome en eau grâce à un puits et un système de récupération des eaux de pluie, et dispose de panneaux solaires. Idéale pour projet d'agriculture biologique ou de tourisme rural. Calme absolu garanti, à seulement 20 minutes de l'aéroport.",
    villes: "Marrakech",
    adresse: "Route de l'Ourika, Douar Tasseltant",
    surface: 150,
    chambres: 5,
    sdb: 3,
    photo: I3,
    localisation: "map",
    video: "video",
    autrechoses: "",
    img2: I2,
    img3: I3,
    img4: I4,
    img5: I5,
  },
  {
    id: 4,
    prix: 145000,
    nom: "Appartement duplex moderne",
    description:
      "Exceptionnel duplex de 85m² offrant une vue à 360° sur la baie de Tanger et le détroit. Situé au 12ème et dernier étage d'une résidence de standing avec ascenseur et gardien, cet appartement récemment rénové allie design contemporain et fonctionnalité. Le séjour décloisonné de 40m² s'ouvre sur une terrasse de 25m² orientée ouest pour des couchers de soleil inoubliables, équipée d'un coin salon et d'une cuisine d'été. La cuisine américaine est intégrée avec des façades laquées et des appareils encastrables de marque. La partie nuit comprend deux chambres avec rangements sur mesure, une salle de bains haut de gamme avec douche effet pluie, et un bureau/bibliothèque. Prestations : climatisation réversible, stores électriques, domotique pour l'éclairage, parquet en chêne massif. Résidence sécurisée avec piscine commune, sauna et espace fitness. À deux pas du centre-ville, des restaurants et de la gare maritime.",
    villes: "Tanger",
    adresse: "8 Rue de la Plage, Centre ville",
    surface: 85,
    chambres: 2,
    sdb: 1,
    photo: I4,
    localisation: "map",
    video: "video",
    autrechoses: "",
    img2: I2,
    img3: I3,
    img4: I4,
    img5: I5,
  },
  {
    id: 5,
    prix: 420000,
    nom: "Villa de luxe avec accès mer",
    description:
      "Prestigieuse villa contemporaine de 200m², joyau architectural posé sur les hauteurs d'Agadir avec un accès direct et privatif à une crique sauvage. Construite en 2021 par un architecte de renom, cette propriété d'exception allie lignes épurées, matériaux nobles et domotique dernier cri. L'espace de vie ouvert de 80m², avec ses murs en pierre naturelle et ses immenses baies vitrées coulissantes, offre une vue imprenable sur l'océan. La cuisine entièrement sur mesure est équipée d'électroménager professionnel. Les six chambres, dont une suite présidentielle de 40m² avec terrasse privative et jacuzzi, disposent toutes de salles de bains en marbre de Carrare. À l'extérieur, une piscine à débordement chauffée de 15m semble se jeter dans l'océan, entourée d'une terrasse en ipé et d'un jardin exotique. La villa comprend également une cave à vin climatisée, une salle de cinéma, un garage pour 4 véhicules et un local technique. Sécurité renforcée avec caméras et alarme reliée à un service de télésurveillance.",
    villes: "Agadir",
    adresse: "15 Boulevard Mohammad V, Station balnéaire",
    surface: 200,
    chambres: 6,
    sdb: 4,
    photo: I5,
    localisation: "map",
    video: "video",
    autrechoses: "",
    img2: I2,
    img3: I3,
    img4: I4,
    img5: I5,
  },
  {
    id: 6,
    prix: 95000,
    nom: "Maison traditionnelle à rénover",
    description:
      "Rare opportunité dans la médina de Fès : une authentique maison traditionnelle (riad) de 70m² à rénover, idéale pour les amoureux du patrimoine et les investisseurs avisés. Construite au début du XXe siècle, cette demeure conserve tous ses éléments d'origine : zelliges colorés, plâtre sculpté, bois de cèdre peint, et fontaine centrale dans le patio. La maison s'organise autour d'un patio à ciel ouvert de 20m², avec trois chambres à l'étage, une pièce de réception au rez-de-chaussée, une cuisine, et une terrasse sur les toits de 30m² avec vue sur les mosquées de la médina. Les murs en pisé de 60cm d'épaisseur garantissent une température agréable été comme hiver. Parfait pour créer un riad d'hôtes de charme ou une résidence secondaire d'exception. Toutes les autorisations de rénovation sont disponibles. Située à 5 minutes à pied de la place R'cif et des souks animés, cette propriété est une véritable invitation au voyage dans le temps.",
    villes: "Fès",
    adresse: "22 Derb Jdid, Médina",
    surface: 70,
    chambres: 2,
    sdb: 1,
    photo: I6,
    localisation: "map",
    video: "video",
    autrechoses: "",
    img2: I2,
    img3: I3,
    img4: I4,
    img5: I5,
  },
];
