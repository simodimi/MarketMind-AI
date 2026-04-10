import React, { useEffect, useRef, useState } from "react";
import logo from "../assets/icone/market.png";
import { Link, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import "../style/profil.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs"; //librairies de date
import isoWeek from "dayjs/plugin/isoWeek"; //semaine iso
dayjs.extend(isoWeek); //activer la fonctionnalité
import img2 from "../assets/avatar/A1.jpg";
import save from "../assets/icone/save.png";
import dup from "../assets/icone/delete.png";
import up from "../assets/icone/aU.png";
import down from "../assets/icone/aD.png";
import pen from "../assets/icone/pen.png";
import { avatar, Profil, styles } from "../store/Frontbdd";
import star from "../assets/icone/star.png";
import send from "../assets/icone/send.png";
import image from "../assets/icone/images.png";
import media from "../assets/icone/media.png";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import tr from "../assets/icone/true.png";
import fa from "../assets/icone/cancel.png";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

// ==================== TYPES ====================
interface Order {
  id: string | number;
  order_date: string | Date;
  total_revenue?: number;
  total?: number;
  price?: number;
  quantity?: number;
  status?: string;
  product_name?: string;
}
interface HourlyStat {
  hour: string;
  revenue: number;
  orders: number;
}
interface WeeklyStat {
  day: string;
  revenue: number;
  orders: number;
}
interface MonthlyStat {
  day: number;
  revenue: number;
  orders: number;
}
interface SummaryItem {
  name: string;
  value: number;
}
interface stepper {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
  step6: boolean;
  step7: boolean;
  step8: boolean;
  step9: boolean;
}
/*paramètre*/
interface stepperParam {
  parastep1: boolean;
  parastep2: boolean;
  parastep3: boolean;
  parastep4: boolean;
  parastep5: boolean;
  parastep6: boolean;
}
/*produit*/
interface stepperProduit {
  nomProduit: string;
  prixProduit: number;
  photoProduitPrincipal: File | null;
  photoProduitSecondary1: File | null;
  photoProduitSecondary2: File | null;
  photoProduitSecondary3: File | null;
  photoProduitSecondary4: File | null;
  photoProduitSecondary5: File | null;
  texteDescription: string;
  videoProduit: File | null;
  villeProduit: string;
  codepostalProduit: string;
  adresseProduit: string;
  surfaceProduit: string;
  typehouseProduit: string;
  numberpieceProduit: number;
  numberchambreProduit: number;
  numberdoucheProduit: number;
  numberetageProduit: string;
  ascenseurProduit: boolean;
  meubleProduit: boolean;
  parkingProduit: string;
  dpeProduit: string;
  chargesmensuellesProduit: number;
  disponibiliteProduit: string;
  loyerProduit: number;
  descriptiondetailleeProduit: string;
  marqueautoProduit: string;
  modeleautoProduit: string;
  circulationProduit: string;
  kilometrageProduit: number;
  puissanceautoProduit: number;
  numberporteProduit: number;
  couleurautoProduit: string;
  proprioProduit: string;
  prixautoProduit: number;
  carburantProduit: string;
  specialautoProduit: string;
  boitevitesseProduit: string;
  marqueelectroProduit: string;
  modeleelectroProduit: string;
  specialelectroProduit: string;
  accessoireelectroProduit: string;
  couleurhabitProduit: string;
  matierehabitProduit: string;
  taillehabitProduit: string;
  marquehabitProduit: string;
  complementinformation: string;
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
interface dataform {
  nameUser: string;
  mailUser: string;
  passwordUser: string;
  confirmpasswordUser: string;
  photoUser: File | null;
  policeUser: string;
}
interface picture {
  pictureproductPrincipal: string | null;
  PictureproduitSecondary1: string | null;
  PictureproduitSecondary2: string | null;
  PictureproduitSecondary3: string | null;
  PictureproduitSecondary4: string | null;
  PictureproduitSecondary5: string | null;
  Videoproduit: string | null;
}
interface stepperCategory {
  stepCategory1: boolean;
  stepCategory2: boolean;
  stepCategory3: boolean;
  stepCategory4: boolean;
  stepCategory5: boolean;
  stepCategory6: boolean;
}
interface stepperBien {
  stepBien1: boolean;
  stepBien2: boolean;
  stepBien3: boolean;
  stepBien4: boolean;
  stepBien5: boolean;
}
interface stepperParking {
  stepParking1: boolean;
  stepParking2: boolean;
  stepParking3: boolean;
  stepParking4: boolean;
  stepParking5: boolean;
}
interface stepperdpe {
  stepdpe1: boolean;
  stepdpe2: boolean;
  stepdpe3: boolean;
  stepdpe4: boolean;
  stepdpe5: boolean;
  stepdpe6: boolean;
  stepdpe7: boolean;
}
interface steppercarburant {
  stepcarburant1: boolean;
  stepcarburant2: boolean;
  stepcarburant3: boolean;
  stepcarburant4: boolean;
  stepcarburant5: boolean;
}
interface stepperboitevitesse {
  stepboitevitesse1: boolean;
  stepboitevitesse2: boolean;
}

interface stepperelectronique {
  stepelectronique1: boolean;
  stepelectronique2: boolean;
  stepelectronique3: boolean;
  stepelectronique4: boolean;
  stepelectronique5: boolean;
}
interface steppergenre {
  stepgenre1: boolean;
  stepgenre2: boolean;
  stepgenre3: boolean;
}
interface steppercategorie {
  stepcategorie1: boolean;
  stepcategorie2: boolean;
  stepcategorie3: boolean;
  stepcategorie4: boolean;
  stepcategorie5: boolean;
  stepcategorie6: boolean;
}
// ==================== DONNÉES DE DÉMONSTRATION ====================
const generateMockOrders = (): Order[] => {
  const mockOrders: Order[] = [];
  const today = dayjs(); // Obtenir la date actuelle
  const statuses = ["completed", "pending", "cancelled"];
  const productNames = [
    "Produit A",
    "Produit B",
    "Produit C",
    "Produit D",
    "Produit E",
  ];

  // Générer des commandes sur les 30 derniers jours
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30); //0-29
    const date = today.subtract(daysAgo, "day"); //date aléatoire
    // Pour avoir des variations horaires (entre 8h et 22h)
    const hour = 8 + Math.floor(Math.random() * 15);
    //à chaque date aléatoire on choisit une heure et une minute aléatoire
    const orderDate = date.hour(hour).minute(Math.floor(Math.random() * 60));
    const quantity = Math.floor(Math.random() * 5) + 1; //1-5
    const price = Math.floor(Math.random() * 100) + 10; //10-110
    const total = quantity * price;

    mockOrders.push({
      id: i + 1,
      order_date: orderDate.toISOString(),
      total_revenue: total,
      total: total,
      price: price,
      quantity: quantity,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      product_name:
        productNames[Math.floor(Math.random() * productNames.length)],
    });
  }

  // Trier par date
  //valueof permet de convertir la date en milliseconde
  return mockOrders.sort(
    (a, b) => dayjs(a.order_date).valueOf() - dayjs(b.order_date).valueOf(),
  );
};

const ProfilUser: React.FC = () => {
  const [selecttext, setSelecttext] = useState<string>("dashboard");
  const [step, setStep] = useState<stepper>({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
    step7: false,
    step8: false,
    step9: false,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [hourlyStats, setHourlyStats] = useState<HourlyStat[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [revenueSummary, setRevenueSummary] = useState<SummaryItem[]>([]);
  const [ordersSummary, setOrdersSummary] = useState<SummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); //true
  const COLORS: string[] = ["#0088FE", "#00C49F", "#FFBB28"];
  const [timeWord, settimeWord] = useState("");
  const [pictureprofil, setpictureprofil] = useState(img2);
  const [showrestriction, setshowrestriction] = useState<boolean>(false);
  const refpicture = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [policeprofil, setpoliceprofil] = useState("Roboto"); //changer la police
  /*add produit */
  const [addproduit, setaddproduit] = useState(false); //visualiser la liste d'affichage addproduit
  const [pictureproduct, setpictureproduct] = useState<picture>({
    pictureproductPrincipal: null,
    PictureproduitSecondary1: null,
    PictureproduitSecondary2: null,
    PictureproduitSecondary3: null,
    PictureproduitSecondary4: null,
    PictureproduitSecondary5: null,
    Videoproduit: null,
  });
  const refpictureproduct = useRef<HTMLInputElement | null>(null);
  const refpictureproduct1 = useRef<HTMLInputElement | null>(null);
  const refpictureproduct2 = useRef<HTMLInputElement | null>(null);
  const refpictureproduct3 = useRef<HTMLInputElement | null>(null);
  const refpictureproduct4 = useRef<HTMLInputElement | null>(null);
  const refpictureproduct5 = useRef<HTMLInputElement | null>(null);
  const refvideo = useRef<HTMLInputElement | null>(null);
  /*paramètre*/
  const [parastep, setparastep] = useState<stepperParam>({
    parastep1: true,
    parastep2: false,
    parastep3: false,
    parastep4: false,
    parastep5: false,
    parastep6: false,
  });
  const navigate = useNavigate();
  const [dataform, setdataform] = useState<dataform>({
    passwordUser: "",
    confirmpasswordUser: "",
    nameUser: "",
    mailUser: "",
    photoUser: null,
    policeUser: "",
  });
  //changer password
  const handlechangepassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setdataform({ ...dataform, [name]: value });
    if (name === "confirmpasswordUser") {
      setshowrestriction(value.trim().length > 0);
    }
  };
  const handlesubmitpassword = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dataform.passwordUser || !dataform.confirmpasswordUser) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const pass = dataform.confirmpasswordUser;
    const check = {
      longueur: pass.length >= 8,
      chiffre: /\d/.test(pass),
      majuscule: /[A-Z]/.test(pass),
      minuscule: /[a-z]/.test(pass),
      symbole: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    if (!Object.values(check).every((p) => p)) {
      toast.error("le nouveau mot de passe ne respecte pas les standards");
      return;
    }
    toast.success("mot de passe sauvergardé");
    setdataform({ ...dataform, passwordUser: "", confirmpasswordUser: "" });
    setshowrestriction(false);
    setparastep({ ...parastep, parastep2: !parastep.parastep2 });
  };
  const checkpassword = (password: restriction) => {
    const pass = dataform.confirmpasswordUser;
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
  //changer photo
  const handlechangepicture = () => {
    refpicture.current?.click();
  };
  const handlechangeprofil = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const file = e.target.files;
    if (name === "userPhoto" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataform({ ...dataform, photoUser: fichier });
        setpictureprofil(URL.createObjectURL(fichier));
      }
    } else {
      setdataform({ ...dataform, [name]: value });
    }
  };
  const handlesubmitpicture = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("photo de profil mise à jour");
    setparastep({ ...parastep, parastep3: !parastep.parastep3 });
  };
  //changer police
  const handlesubmitpolice = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault;
    setdataform({ ...dataform, policeUser: policeprofil });
    toast.success("police mise à jour");
    setparastep({ ...parastep, parastep5: !parastep.parastep5 });
  };
  /*fin paramètre */

  /*ajouter un produit */
  const [dataproduit, setdataproduit] = useState<stepperProduit>({
    nomProduit: "",
    prixProduit: 0,
    photoProduitPrincipal: null,
    photoProduitSecondary1: null,
    photoProduitSecondary2: null,
    photoProduitSecondary3: null,
    photoProduitSecondary4: null,
    photoProduitSecondary5: null,
    texteDescription: "",
    videoProduit: null,
    villeProduit: "",
    codepostalProduit: "",
    adresseProduit: "",
    surfaceProduit: "",
    typehouseProduit: "",
    numberpieceProduit: 0,
    numberchambreProduit: 0,
    numberdoucheProduit: 0,
    numberetageProduit: "",
    ascenseurProduit: false,
    meubleProduit: false,
    parkingProduit: "",
    dpeProduit: "",
    chargesmensuellesProduit: 0,
    disponibiliteProduit: "",
    loyerProduit: 0,
    descriptiondetailleeProduit: "",
    marqueautoProduit: "",
    modeleautoProduit: "",
    circulationProduit: "",
    kilometrageProduit: 0,
    puissanceautoProduit: 0,
    numberporteProduit: 0,
    couleurautoProduit: "",
    proprioProduit: "",
    prixautoProduit: 0,
    carburantProduit: "",
    specialautoProduit: "",
    boitevitesseProduit: "",
    marqueelectroProduit: "",
    modeleelectroProduit: "",
    specialelectroProduit: "",
    accessoireelectroProduit: "",
    couleurhabitProduit: "",
    matierehabitProduit: "",
    taillehabitProduit: "",
    marquehabitProduit: "",
    complementinformation: "",
  });
  const handleAddProduit = () => {
    setaddproduit(true);
  };
  const handlechangeproduit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setdataproduit({ ...dataproduit, [name]: value });
  };
  const handlechangepictureproduit = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const file = e.target.files;
    if (name === "photoProduitPrincipal" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataproduit({ ...dataproduit, photoProduitPrincipal: fichier });
        setpictureproduct({
          ...pictureproduct,
          pictureproductPrincipal: URL.createObjectURL(fichier),
        });
      }
    }

    if (name === "photoProduitSecondary1" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataproduit({ ...dataproduit, photoProduitSecondary1: fichier });
        setpictureproduct({
          ...pictureproduct,
          PictureproduitSecondary1: URL.createObjectURL(fichier),
        });
      }
    }
    if (name === "photoProduitSecondary2" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataproduit({ ...dataproduit, photoProduitSecondary2: fichier });
        setpictureproduct({
          ...pictureproduct,
          PictureproduitSecondary2: URL.createObjectURL(fichier),
        });
      }
    }
    if (name === "photoProduitSecondary3" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataproduit({ ...dataproduit, photoProduitSecondary3: fichier });
        setpictureproduct({
          ...pictureproduct,
          PictureproduitSecondary3: URL.createObjectURL(fichier),
        });
      }
    }
    if (name === "photoProduitSecondary4" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataproduit({ ...dataproduit, photoProduitSecondary4: fichier });
        setpictureproduct({
          ...pictureproduct,
          PictureproduitSecondary4: URL.createObjectURL(fichier),
        });
      }
    }
    if (name === "photoProduitSecondary5" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataproduit({ ...dataproduit, photoProduitSecondary5: fichier });
        setpictureproduct({
          ...pictureproduct,
          PictureproduitSecondary5: URL.createObjectURL(fichier),
        });
      }
    }
    if (name === "videoProduit" && file) {
      const fichier = file[0];
      if (fichier) {
        setdataproduit({ ...dataproduit, videoProduit: fichier });
        setpictureproduct({
          ...pictureproduct,
          Videoproduit: URL.createObjectURL(fichier),
        });
      }
    } else {
      setdataproduit({ ...dataproduit, [name]: value });
    }
  };
  //selectionner une catégorie
  const [selectCtegory, setselectCtegory] = useState<string>("");
  const [stepCategory, setstepCategory] = useState<stepperCategory>({
    stepCategory1: false,
    stepCategory2: false,
    stepCategory3: false,
    stepCategory4: false,
    stepCategory5: false,
    stepCategory6: false,
  });
  const handleSelect = (name: string, value: string) => {
    setdataproduit({ ...dataproduit, [name]: value });
  };
  //selectionner une catégorie de bien immobilier
  const [selectbien, setselectbien] = useState<string>("");
  const [stepBien, setstepBien] = useState<stepperBien>({
    stepBien1: false,
    stepBien2: false,
    stepBien3: false,
    stepBien4: false,
    stepBien5: false,
  });
  //selectionner une catégorie de parking
  const [selectParking, setselectParking] = useState<string>("");
  const [stepParking, setstepParking] = useState<stepperParking>({
    stepParking1: false,
    stepParking2: false,
    stepParking3: false,
    stepParking4: false,
    stepParking5: false,
  });
  //selectionner dpe
  const [selectdpe, setselectdpe] = useState<string>("");
  const [stepdpe, setstepdpe] = useState<stepperdpe>({
    stepdpe1: false,
    stepdpe2: false,
    stepdpe3: false,
    stepdpe4: false,
    stepdpe5: false,
    stepdpe6: false,
    stepdpe7: false,
  });
  //type de carburant
  const [selectcarburant, setselectcarburant] = useState<string>("");
  const [stepcarburant, setstepcarburant] = useState<steppercarburant>({
    stepcarburant1: false,
    stepcarburant2: false,
    stepcarburant3: false,
    stepcarburant4: false,
    stepcarburant5: false,
  });
  //type de boite de vitesse
  const [selectboitevitesse, setselectboitevitesse] = useState<string>("");
  const [stepboitevitesse, setstepboitevitesse] = useState<stepperboitevitesse>(
    {
      stepboitevitesse1: false,
      stepboitevitesse2: false,
    },
  );
  //selection materiel electronique
  const [selectelectronique, setselectelectronique] = useState<string>("");
  const [stepelectronique, setstepelectronique] = useState<stepperelectronique>(
    {
      stepelectronique1: false,
      stepelectronique2: false,
      stepelectronique3: false,
      stepelectronique4: false,
      stepelectronique5: false,
    },
  );
  //selection genre habit
  const [selectgenre, setselectgenre] = useState<string>("");
  const [stepgenre, setstepgenre] = useState<steppergenre>({
    stepgenre1: false,
    stepgenre2: false,
    stepgenre3: false,
  });
  //selection categories habit
  const [selectcategorie, setselectcategorie] = useState<string>("");
  const [stepcategorie, setstepcategorie] = useState<steppercategorie>({
    stepcategorie1: false,
    stepcategorie2: false,
    stepcategorie3: false,
    stepcategorie4: false,
    stepcategorie5: false,
    stepcategorie6: false,
  });
  //fin d'ajout du produit
  useEffect(() => {
    const time = setTimeout(() => {
      const now = new Date().getHours();
      if (now >= 5 && now <= 17) {
        settimeWord("Bonjour");
      } else {
        settimeWord("Bonsoir");
      }
    }, 1000);
    return () => {
      clearTimeout(time);
    };
  }, []);
  // Fonction pour obtenir le revenu d'une commande
  const getRevenue = (item: Order): number => {
    const revenue =
      item.total_revenue ??
      item.total ??
      (item.price ?? 0) * (item.quantity ?? 0);
    return typeof revenue === "string" ? parseFloat(revenue) : Number(revenue);
  };

  // Calcul des statistiques
  const computeStats = (data: Order[]): void => {
    const today = dayjs();
    const startOfWeek = today.startOf("week"); // Obtenir le premier jour de la semaine(lundi)
    const startOfMonth = today.startOf("month"); // Obtenir le premier jour du mois
    // Stats par heure (0h-23h)
    const hoursRange: number[] = Array.from({ length: 24 }, (_, i) => i); //0-23
    const hourly: HourlyStat[] = hoursRange.map((h) => {
      //contient les commandes de l'heure d'aujourd'hui
      const ordersInHour = data.filter(
        (o) =>
          dayjs(o.order_date).isSame(today, "day") && //si la date de la commande est egale a la date actuelle
          dayjs(o.order_date).hour() === h, //si l'heure de la commande est egale a l'heure actuelle
      );

      const revenue = ordersInHour.reduce((sum, o) => sum + getRevenue(o), 0);

      return {
        hour: `${h}h`,
        revenue: parseFloat(revenue.toFixed(2)),
        orders: ordersInHour.length,
      };
    });

    // Stats par jour de la semaine (Lun-Dim)
    const daysOfWeek: string[] = [
      "Lun",
      "Mar",
      "Mer",
      "Jeu",
      "Ven",
      "Sam",
      "Dim",
    ];
    const weekly: WeeklyStat[] = daysOfWeek.map((d, idx) => {
      const ordersInDay = data.filter(
        (o) =>
          dayjs(o.order_date).isoWeek() === today.isoWeek() && //nous verifions si la semaine de la commande est egale a la semaine actuelle
          dayjs(o.order_date).isoWeekday() === idx + 1, //si le jour de la commande est egale au jour actuelle
      );

      const revenue = ordersInDay.reduce((sum, o) => sum + getRevenue(o), 0);

      return {
        day: d,
        revenue: parseFloat(revenue.toFixed(2)),
        orders: ordersInDay.length,
      };
    });

    // Stats par jour du mois
    const daysInMonth: number = today.daysInMonth(); //28-31
    const monthly: MonthlyStat[] = Array.from(
      { length: daysInMonth },
      (_, i) => {
        const dayNum = i + 1;
        const ordersInDay = data.filter(
          (o) =>
            dayjs(o.order_date).month() === today.month() && //si le mois de la commande est egale au mois actuelle
            dayjs(o.order_date).date() === dayNum, //si le jour de la commande est egale au jour actuelle
        );

        const revenue = ordersInDay.reduce((sum, o) => sum + getRevenue(o), 0);

        return {
          day: dayNum,
          revenue: parseFloat(revenue.toFixed(2)),
          orders: ordersInDay.length,
        };
      },
    );

    // Répartition globale (PieCharts)
    const dailyOrders = data.filter(
      (o) => dayjs(o.order_date).isSame(today, "day"), //si la date de la commande correspond au jour actuelle
    );
    const weeklyOrders = data.filter(
      (o) => dayjs(o.order_date).isAfter(startOfWeek), //contient toutes les commandes depuis le début de la semaine
    );
    const monthlyOrders = data.filter(
      (o) => dayjs(o.order_date).isAfter(startOfMonth), //contient toutes les commandes depuis le début du mois
    );

    const todayRevenue = dailyOrders.reduce((sum, o) => sum + getRevenue(o), 0);
    const weekRevenue = weeklyOrders.reduce((sum, o) => sum + getRevenue(o), 0);
    const monthRevenue = monthlyOrders.reduce(
      (sum, o) => sum + getRevenue(o),
      0,
    );

    console.log("Revenus calculés:", {
      aujourdhui: parseFloat(todayRevenue.toFixed(2)),
      semaine: parseFloat(weekRevenue.toFixed(2)),
      mois: parseFloat(monthRevenue.toFixed(2)),
    });

    setHourlyStats(hourly);
    setWeeklyStats(weekly);
    setMonthlyStats(monthly);
    setRevenueSummary([
      { name: "Aujourd'hui", value: parseFloat(todayRevenue.toFixed(2)) },
      { name: "Cette semaine", value: parseFloat(weekRevenue.toFixed(2)) },
      { name: "Ce mois", value: parseFloat(monthRevenue.toFixed(2)) },
    ]);
    setOrdersSummary([
      { name: "Aujourd'hui", value: dailyOrders.length },
      { name: "Cette semaine", value: weeklyOrders.length },
      { name: "Ce mois", value: monthlyOrders.length },
    ]);
  };

  // Chargement initial des données (simulation)
  useEffect(() => {
    setIsLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      const mockData = generateMockOrders(); //générer des commandes
      setOrders(mockData);
      computeStats(mockData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Recalculer les stats quand les commandes changent
  useEffect(() => {
    if (orders.length > 0) {
      computeStats(orders);
    }
  }, [orders]);

  // Si chargement, afficher un loader
  /*if (isLoading) {
    return (
      <div className="HomeProfilUser">
        <div className="HomeMains">
          <div className="HomeTitles">
            <div className="HomeTitlesbtn">
              <Button>Retour</Button>
            </div>
            <Link to={"/"}>
              <div className="HomeLogo">
                <img src={logo} alt="Logo" />
              </div>
            </Link>
            <div className="HomeMenu">
              <p>MarketMind-AI : Plateforme Saas de vente et d'achat</p>
            </div>
          </div>
        </div>
        <div className="HomeProfils">
          <div className="dashboardProfil">
            <div className="dashboardProfilSidebar">
            
            </div>
            <div className="dashboardProfilContent">
              <div className="dashboardStepper">
                <div className="p-6 grid gap-8">
                  <div className="text-center py-20">
                    <p>Chargement des données...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }*/
  /*gestion de paramètres step8 */

  return (
    <div className="HomeProfilUser">
      <div className="HomeMains">
        <div className="HomeTitles">
          <div className="HomeTitlesbtn">
            <Button>Retour</Button>
          </div>
          <Link to={"/"}>
            <div className="HomeLogo">
              <img src={logo} alt="Logo" />
            </div>
          </Link>
          <div className="HomeMenu">
            <p>MarketMind-AI : Plateforme Saas de vente et d'achat</p>
          </div>
        </div>
      </div>
      <div className="HomeProfils">
        <div className="dashboardProfil">
          <div className="dashboardProfilSidebar">
            <p
              className={`dashboardProfilSidebarText ${selecttext === "dashboard" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("dashboard");
                setStep({
                  step1: true,
                  step2: false,
                  step3: false,
                  step4: false,
                  step5: false,
                  step6: false,
                  step7: false,
                  step8: false,
                  step9: false,
                });
              }}
            >
              Dashboard
            </p>
            <p
              className={`dashboardProfilSidebarText ${selecttext === "achats" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("achats");
                setStep({
                  step1: false,
                  step2: true,
                  step3: false,
                  step4: false,
                  step5: false,
                  step6: false,
                  step7: false,
                  step8: false,
                  step9: false,
                });
              }}
            >
              Mes achats
            </p>
            <p
              className={`dashboardProfilSidebarText ${selecttext === "ventes" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("ventes");
                setStep({
                  step1: false,
                  step2: false,
                  step3: true,
                  step4: false,
                  step5: false,
                  step6: false,
                  step7: false,
                  step8: false,
                  step9: false,
                });
              }}
            >
              Mes ventes
            </p>
            <p
              className={`dashboardProfilSidebarText ${selecttext === "produits" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("produits");
                setStep({
                  step1: false,
                  step2: false,
                  step3: false,
                  step4: true,
                  step5: false,
                  step6: false,
                  step7: false,
                  step8: false,
                  step9: false,
                });
              }}
            >
              Produits
            </p>

            <p
              className={`dashboardProfilSidebarText ${selecttext === "messages" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("messages");
                setStep({
                  step1: false,
                  step2: false,
                  step3: false,
                  step4: false,
                  step5: false,
                  step6: true,
                  step7: false,
                  step8: false,
                  step9: false,
                });
              }}
            >
              Messages
            </p>
            <p
              className={`dashboardProfilSidebarText ${selecttext === "premuin" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("premuin");
                setStep({
                  step1: false,
                  step2: false,
                  step3: false,
                  step4: false,
                  step5: false,
                  step6: false,
                  step7: true,
                  step8: false,
                  step9: false,
                });
              }}
            >
              Premuin
            </p>
            <p
              className={`dashboardProfilSidebarText ${selecttext === "parametres" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("parametres");
                setStep({
                  step1: false,
                  step2: false,
                  step3: false,
                  step4: false,
                  step5: false,
                  step6: false,
                  step7: false,
                  step8: true,
                  step9: false,
                });
              }}
            >
              Paramètres
            </p>
            <p
              className={`dashboardProfilSidebarText ${selecttext === "historique" ? "act" : ""}`}
              onClick={() => {
                setSelecttext("historique");
                setStep({
                  step1: false,
                  step2: false,
                  step3: false,
                  step4: false,
                  step5: false,
                  step6: false,
                  step7: false,
                  step8: false,
                  step9: true,
                });
              }}
            >
              Historiques
            </p>
          </div>
          <div className="dashboardProfilContent">
            {step.step1 && (
              <div className="dashboardStepper">
                <p id="greeting">{timeWord} dimitri, tu vas bien?</p>
                <img src={img2} alt="" />
                <div className="greetingCase">
                  <div className="greetingCaseItem">
                    <p>Nombre de commandes réalisées</p>
                    <span>25</span>
                  </div>
                  <div className="greetingCaseItem">
                    <p>Nombre de ventes réalisées</p>
                    <span>25</span>
                  </div>
                  <div className="greetingCaseItem">
                    <p>Revenus </p>
                    <span>450 €</span>
                  </div>
                </div>
              </div>
            )}
            {step.step2 && (
              <div className="dashboardSteppers">
                {/* mes achats  par heure */}
                <div className="">
                  <h2>Mes achats et Commandes par heure.</h2>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={hourlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          if (value == null)
                            return [
                              "-",
                              name === "revenue"
                                ? "Revenu (€)"
                                : name === "orders"
                                  ? "Commandes"
                                  : name,
                            ];
                          if (name === "revenue")
                            return [`${value} €`, "Revenu (€)"];
                          if (name === "orders") return [value, "Commandes"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#8884d8"
                        name="Revenu (€)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="#82ca9d"
                        name="Commandes"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Chiffre d'affaires par jour de la semaine */}
                <div className="">
                  <h2 className="">
                    Mes achats et Commandes par jour de la semaine.
                  </h2>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={weeklyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          if (value == null)
                            return [
                              "-",
                              name === "revenue"
                                ? "Revenu (€)"
                                : name === "orders"
                                  ? "Commandes"
                                  : name,
                            ];
                          if (name === "revenue")
                            return [`${value} €`, "Revenu (€)"];
                          if (name === "orders") return [value, "Commandes"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#FF8042"
                        name="Revenu (€)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="#00C49F"
                        name="Commandes"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Chiffre d'affaires par jour du mois */}
                <div className="">
                  <h2 className="">
                    Mes achats et Commandes par jour du mois.
                  </h2>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          if (value == null)
                            return [
                              "-",
                              name === "revenue"
                                ? "Revenu (€)"
                                : name === "orders"
                                  ? "Commandes"
                                  : name,
                            ];
                          if (name === "revenue")
                            return [`${value} €`, "Revenu (€)"];
                          if (name === "orders") return [value, "Commandes"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#8884d8"
                        name="Revenu (€)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="#82ca9d"
                        name="Commandes"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Répartition globale (PieCharts) */}
                <div className="">
                  <div>
                    <h2 className="">Répartition des dépenses.</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={revenueSummary}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={200}
                          label={({ name, value }) => `${name}: ${value} €`}
                        >
                          {revenueSummary.map((entry, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any, name: any) => {
                            if (value == null)
                              return [
                                "-",
                                name === "revenue"
                                  ? "Revenu (€)"
                                  : name === "orders"
                                    ? "Commandes"
                                    : name,
                              ];
                            if (name === "revenue")
                              return [`${value} €`, "Revenu (€)"];
                            if (name === "orders") return [value, "Commandes"];
                            return [value, name];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h2 className="">Répartition des commandes.</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={ordersSummary}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={200}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {ordersSummary.map((entry, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            {step.step3 && (
              <div className="dashboardSteppers">
                {/* mes ventes  par heure */}
                <div className="">
                  <h2>Mes ventes et Commandes par heure.</h2>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={hourlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          if (value == null)
                            return [
                              "-",
                              name === "revenue"
                                ? "Revenu (€)"
                                : name === "orders"
                                  ? "Commandes"
                                  : name,
                            ];
                          if (name === "revenue")
                            return [`${value} €`, "Revenu (€)"];
                          if (name === "orders") return [value, "Commandes"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#8884d8"
                        name="Revenu (€)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="#82ca9d"
                        name="Commandes"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Chiffre d'affaires par jour de la semaine */}
                <div className="">
                  <h2 className="">
                    Mes ventes et Commandes par jour de la semaine.
                  </h2>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={weeklyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          if (value == null)
                            return [
                              "-",
                              name === "revenue"
                                ? "Revenu (€)"
                                : name === "orders"
                                  ? "Commandes"
                                  : name,
                            ];
                          if (name === "revenue")
                            return [`${value} €`, "Revenu (€)"];
                          if (name === "orders") return [value, "Commandes"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#FF8042"
                        name="Revenu (€)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="#00C49F"
                        name="Commandes"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Chiffre d'affaires par jour du mois */}
                <div className="">
                  <h2 className="">
                    Mes ventes et Commandes par jour du mois.
                  </h2>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value: any, name: any) => {
                          if (value == null)
                            return [
                              "-",
                              name === "revenue"
                                ? "Revenu (€)"
                                : name === "orders"
                                  ? "Commandes"
                                  : name,
                            ];
                          if (name === "revenue")
                            return [`${value} €`, "Revenu (€)"];
                          if (name === "orders") return [value, "Commandes"];
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#8884d8"
                        name="Revenu (€)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="orders"
                        fill="#82ca9d"
                        name="Commandes"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Répartition globale (PieCharts) */}
                <div className="">
                  <div>
                    <h2 className="">Répartition des ventes.</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={revenueSummary}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={200}
                          label={({ name, value }) => `${name}: ${value} €`}
                        >
                          {revenueSummary.map((entry, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: any, name: any) => {
                            if (value == null)
                              return [
                                "-",
                                name === "revenue"
                                  ? "Revenu (€)"
                                  : name === "orders"
                                    ? "Commandes"
                                    : name,
                              ];
                            if (name === "revenue")
                              return [`${value} €`, "Revenu (€)"];
                            if (name === "orders") return [value, "Commandes"];
                            return [value, name];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h2 className="">Répartition des commandes.</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={ordersSummary}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={200}
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {ordersSummary.map((entry, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            {step.step4 && (
              <div className="dashboardSteppers">
                <h2>Produit</h2>
                <div className="btnaddProduct">
                  <Button onClick={handleAddProduit}>
                    Ajouter un produit +{" "}
                  </Button>
                </div>
                <div className="dashboardStepperPublication">
                  {addproduit && (
                    <div className="">
                      <form action="">
                        <div className="ProductText">
                          <p>
                            Nom du produit <span>*</span> :
                          </p>
                          <input
                            type="text"
                            name="nomProduit"
                            value={dataproduit.nomProduit}
                            id=""
                            placeholder="saisir le nom du produit"
                            onChange={handlechangeproduit}
                          />
                        </div>
                        <div className="ProductText">
                          <p>
                            Prix du produit <span>*</span> :
                          </p>
                          <input
                            type="number"
                            value={dataproduit.prixProduit}
                            name="prixProduit"
                            id=""
                            placeholder="saisir le prix du produit"
                            onChange={handlechangeproduit}
                          />
                        </div>
                        <div className="ProductText">
                          <p>
                            Ajouter des photos du produit, 5 maximum et minimun
                            1 <span>*</span> :
                          </p>
                          <p>
                            La photo principale sera la photo de couverture :
                          </p>
                          <div className="ProductPictureItem">
                            <div className="ProductPicture">
                              <img
                                src={
                                  pictureproduct.pictureproductPrincipal ??
                                  undefined
                                }
                                alt=""
                                className="ProductPictureItemImg"
                              />
                              <img
                                src={pen}
                                alt=""
                                onClick={() =>
                                  refpictureproduct.current?.click()
                                }
                                className="penimage"
                              />
                            </div>
                            <input
                              accept="image/*"
                              type="file"
                              name="photoProduitPrincipal"
                              id=""
                              style={{ display: "none" }}
                              onChange={handlechangepictureproduit}
                              ref={refpictureproduct}
                            />
                          </div>

                          <p>
                            Cliquez sur les cadres ci-dessous pour ajouter des
                            photos ou modifier :
                          </p>
                          <div className="SecondPicture">
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                {pictureproduct.PictureproduitSecondary1 && (
                                  <img
                                    src={
                                      pictureproduct.PictureproduitSecondary1 ??
                                      undefined
                                    }
                                    alt=""
                                    className="ProductSecondPictureItemImg"
                                  />
                                )}
                                <div className="ProductPictureLogo">
                                  <img
                                    src={pen}
                                    alt=""
                                    onClick={() =>
                                      refpictureproduct1.current?.click()
                                    }
                                  />
                                  {(pictureproduct.PictureproduitSecondary1
                                    ?.length ?? 0) > 0 && (
                                    <img
                                      src={dup}
                                      alt=""
                                      onClick={() => {
                                        setdataproduit({
                                          ...dataproduit,
                                          photoProduitSecondary1: null,
                                        });
                                        setpictureproduct({
                                          ...pictureproduct,
                                          PictureproduitSecondary1: null,
                                        });
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <input
                                accept="image/*"
                                type="file"
                                name="photoProduitSecondary1"
                                id=""
                                style={{ display: "none" }}
                                onChange={handlechangepictureproduit}
                                ref={refpictureproduct1}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                {pictureproduct.PictureproduitSecondary2 && (
                                  <img
                                    src={
                                      pictureproduct.PictureproduitSecondary2 ??
                                      undefined
                                    }
                                    alt=""
                                    className="ProductSecondPictureItemImg"
                                  />
                                )}
                                <div className="ProductPictureLogo">
                                  <img
                                    src={pen}
                                    alt=""
                                    onClick={() =>
                                      refpictureproduct2.current?.click()
                                    }
                                  />
                                  {(pictureproduct.PictureproduitSecondary2
                                    ?.length ?? 0) > 0 && (
                                    <img
                                      src={dup}
                                      alt=""
                                      onClick={() => {
                                        setdataproduit({
                                          ...dataproduit,
                                          photoProduitSecondary2: null,
                                        });
                                        setpictureproduct({
                                          ...pictureproduct,
                                          PictureproduitSecondary2: null,
                                        });
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <input
                                accept="image/*"
                                type="file"
                                name="photoProduitSecondary2"
                                id=""
                                style={{ display: "none" }}
                                onChange={handlechangepictureproduit}
                                ref={refpictureproduct2}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                {pictureproduct.PictureproduitSecondary3 && (
                                  <img
                                    src={
                                      pictureproduct.PictureproduitSecondary3 ??
                                      undefined
                                    }
                                    alt=""
                                    className="ProductSecondPictureItemImg"
                                  />
                                )}
                                <div className="ProductPictureLogo">
                                  <img
                                    src={pen}
                                    alt=""
                                    onClick={() =>
                                      refpictureproduct3.current?.click()
                                    }
                                  />
                                  {(pictureproduct.PictureproduitSecondary3
                                    ?.length ?? 0) > 0 && (
                                    <img
                                      src={dup}
                                      alt=""
                                      onClick={() => {
                                        setdataproduit({
                                          ...dataproduit,
                                          photoProduitSecondary3: null,
                                        });
                                        setpictureproduct({
                                          ...pictureproduct,
                                          PictureproduitSecondary3: null,
                                        });
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <input
                                accept="image/*"
                                type="file"
                                name="photoProduitSecondary3"
                                id=""
                                style={{ display: "none" }}
                                onChange={handlechangepictureproduit}
                                ref={refpictureproduct3}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                {pictureproduct.PictureproduitSecondary4 && (
                                  <img
                                    src={
                                      pictureproduct.PictureproduitSecondary4 ??
                                      undefined
                                    }
                                    alt=""
                                    className="ProductSecondPictureItemImg"
                                  />
                                )}
                                <div className="ProductPictureLogo">
                                  <img
                                    src={pen}
                                    alt=""
                                    onClick={() =>
                                      refpictureproduct4.current?.click()
                                    }
                                  />
                                  {(pictureproduct.PictureproduitSecondary4
                                    ?.length ?? 0) > 0 && (
                                    <img
                                      src={dup}
                                      alt=""
                                      onClick={() => {
                                        setdataproduit({
                                          ...dataproduit,
                                          photoProduitSecondary4: null,
                                        });
                                        setpictureproduct({
                                          ...pictureproduct,
                                          PictureproduitSecondary4: null,
                                        });
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <input
                                accept="image/*"
                                type="file"
                                name="photoProduitSecondary4"
                                id=""
                                style={{ display: "none" }}
                                onChange={handlechangepictureproduit}
                                ref={refpictureproduct4}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                {pictureproduct.PictureproduitSecondary5 && (
                                  <img
                                    src={
                                      pictureproduct.PictureproduitSecondary5 ??
                                      undefined
                                    }
                                    alt=""
                                    className="ProductSecondPictureItemImg"
                                  />
                                )}
                                <div className="ProductPictureLogo">
                                  <img
                                    src={pen}
                                    alt=""
                                    onClick={() =>
                                      refpictureproduct5.current?.click()
                                    }
                                  />
                                  {(pictureproduct.PictureproduitSecondary5
                                    ?.length ?? 0) > 0 && (
                                    <img
                                      src={dup}
                                      alt=""
                                      onClick={() => {
                                        setdataproduit({
                                          ...dataproduit,
                                          photoProduitSecondary5: null,
                                        });
                                        setpictureproduct({
                                          ...pictureproduct,
                                          PictureproduitSecondary5: null,
                                        });
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <input
                                accept="image/*"
                                type="file"
                                name="photoProduitSecondary5"
                                id=""
                                style={{ display: "none" }}
                                onChange={handlechangepictureproduit}
                                ref={refpictureproduct5}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ProductText">
                          <p>
                            Description du produit <span>*</span> :
                          </p>
                          <textarea
                            name="texteDescription"
                            value={dataproduit.texteDescription}
                            onChange={handlechangeproduit}
                            id=""
                            spellCheck
                          />
                          {dataproduit.texteDescription.length > 100 && (
                            <div className="addWriteIa">
                              <Button>
                                Aider vous de l'IA pour modifier la description
                              </Button>
                              <progress />
                            </div>
                          )}
                        </div>
                        <div className="ProductText">
                          <p>Ajouter une vidéo du produit :</p>
                          <div className="ProductPictureItem">
                            <div className="ProductPicture">
                              {pictureproduct.Videoproduit && (
                                <video
                                  src={pictureproduct.Videoproduit}
                                  controls
                                  className="ProductPictureItemImg"
                                  style={{ cursor: "pointer" }}
                                />
                              )}
                              <div className="ProductPictureLogo">
                                <img
                                  src={pen}
                                  alt=""
                                  onClick={() => refvideo.current?.click()}
                                />
                                {(pictureproduct.Videoproduit?.length ?? 0) >
                                  0 && (
                                  <img
                                    src={dup}
                                    alt=""
                                    onClick={() => {
                                      setdataproduit({
                                        ...dataproduit,
                                        videoProduit: null,
                                      });
                                      setpictureproduct({
                                        ...pictureproduct,
                                        Videoproduit: null,
                                      });
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                            <input
                              ref={refvideo}
                              type="file"
                              accept="video/*"
                              name="videoProduit"
                              id=""
                              onChange={handlechangepictureproduit}
                              style={{ display: "none" }}
                            />
                          </div>
                        </div>
                        <div className="ProductText">
                          <p>
                            Sélectionner une catégorie de produit <span>*</span>{" "}
                            :
                          </p>
                          <div className="ProductCategory">
                            <p
                              className={`selectcategory ${selectCtegory === "immobilier" ? "act" : ""}`}
                              onClick={() => {
                                if (selectCtegory === "immobilier") return; //eviter de recharger la page si on clique plusieurs fois sur la catégorie immobilier
                                setselectCtegory("immobilier");
                                setstepCategory({
                                  stepCategory1: true,
                                  stepCategory2: false,
                                  stepCategory3: false,
                                  stepCategory4: false,
                                  stepCategory5: false,
                                  stepCategory6: false,
                                });
                              }}
                            >
                              Immobilier
                            </p>
                            <p
                              className={`selectcategory ${selectCtegory === "automobile" ? "act" : ""}`}
                              onClick={() => {
                                if (selectCtegory === "automobile") return; //eviter de recharger la page si on clique plusieurs fois sur la catégorie automobile
                                setselectCtegory("automobile");
                                setstepCategory({
                                  stepCategory1: false,
                                  stepCategory2: true,
                                  stepCategory3: false,
                                  stepCategory4: false,
                                  stepCategory5: false,
                                  stepCategory6: false,
                                });
                              }}
                            >
                              Automobile
                            </p>
                            <p
                              className={`selectcategory ${selectCtegory === "electronique" ? "act" : ""}`}
                              onClick={() => {
                                if (selectCtegory === "electronique") return; //eviter de recharger la page si on clique plusieurs fois sur la catégorie electronique
                                setselectCtegory("electronique");
                                setstepCategory({
                                  stepCategory1: false,
                                  stepCategory2: false,
                                  stepCategory3: true,
                                  stepCategory4: false,
                                  stepCategory5: false,
                                  stepCategory6: false,
                                });
                              }}
                            >
                              électronique
                            </p>
                            <p
                              className={`selectcategory ${selectCtegory === "mode" ? "act" : ""}`}
                              onClick={() => {
                                if (selectCtegory === "mode") return; //eviter de recharger la page si on clique plusieurs fois sur la catégorie mode
                                setselectCtegory("mode");
                                setstepCategory({
                                  stepCategory1: false,
                                  stepCategory2: false,
                                  stepCategory3: false,
                                  stepCategory4: true,
                                  stepCategory5: false,
                                  stepCategory6: false,
                                });
                              }}
                            >
                              Mode
                            </p>

                            <p
                              className={`selectcategory ${selectCtegory === "autre" ? "act" : ""}`}
                              onClick={() => {
                                if (selectCtegory === "autre") return; //eviter de recharger la page si on clique plusieurs fois sur la catégorie autre
                                setselectCtegory("autre");
                                setstepCategory({
                                  stepCategory1: false,
                                  stepCategory2: false,
                                  stepCategory3: false,
                                  stepCategory4: false,
                                  stepCategory5: false,
                                  stepCategory6: true,
                                });
                              }}
                            >
                              Autre
                            </p>
                          </div>
                        </div>
                        <div className="ProductItems">
                          {stepCategory.stepCategory1 && (
                            <>
                              <div className="">
                                <div className="ProductText">
                                  <p>
                                    Ville <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="villeProduit"
                                    value={dataproduit.villeProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Ex: Lyon"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Code postal <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="codepostalProduit"
                                    value={dataproduit.codepostalProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="69001"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Adresse <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="adresseProduit"
                                    value={dataproduit.adresseProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="12 rue de la République"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Surface (m²) <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="surfaceProduit"
                                    value={dataproduit.surfaceProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="65"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Type de bien <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectbien === "appartement" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectbien("appartement");
                                        setstepBien({
                                          ...stepBien,
                                          stepBien1: !stepBien.stepBien1,
                                        });
                                        handleSelect(
                                          "typehouseProduit",
                                          "Appartement",
                                        );
                                      }}
                                    >
                                      Appartement
                                    </p>
                                    <p
                                      className={`selectcategory ${selectbien === "maison" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectbien("maison");
                                        setstepBien({
                                          ...stepBien,
                                          stepBien2: !stepBien.stepBien2,
                                        });
                                        handleSelect(
                                          "typehouseProduit",
                                          "Maison",
                                        );
                                      }}
                                    >
                                      Maison
                                    </p>
                                    <p
                                      className={`selectcategory ${selectbien === "studio" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectbien("studio");
                                        setstepBien({
                                          ...stepBien,
                                          stepBien3: !stepBien.stepBien3,
                                        });
                                        handleSelect(
                                          "typehouseProduit",
                                          "Studio",
                                        );
                                      }}
                                    >
                                      Studio
                                    </p>
                                    <p
                                      className={`selectcategory ${selectbien === "terrain" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectbien("terrain");
                                        setstepBien({
                                          ...stepBien,
                                          stepBien4: !stepBien.stepBien4,
                                        });
                                        handleSelect(
                                          "typehouseProduit",
                                          "Terrain",
                                        );
                                      }}
                                    >
                                      Terrain
                                    </p>
                                    <p
                                      className={`selectcategory ${selectbien === "autre" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectbien("autre");
                                        setstepBien({
                                          ...stepBien,
                                          stepBien5: !stepBien.stepBien5,
                                        });
                                        handleSelect(
                                          "typehouseProduit",
                                          "Autre",
                                        );
                                      }}
                                    >
                                      Autre
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Nombre de pièces <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="numberpieceProduit"
                                    value={dataproduit.numberpieceProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="3"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Nombre de chambres <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="numberchambreProduit"
                                    value={dataproduit.numberchambreProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="2"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Nombre de salles de bain <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="numberdoucheProduit"
                                    value={dataproduit.numberdoucheProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="1"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Étage / étages total <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="numberetageProduit"
                                    value={dataproduit.numberetageProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="3ème / 5 étages"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Ascenseur <span>*</span> :
                                  </p>
                                  <div className="InputRadioProductText">
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="radio"
                                        name="ascenseurProduit"
                                        value="oui"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>Oui</label>
                                    </div>
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="radio"
                                        name="ascenseurProduit"
                                        value="non"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>Non</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Meublé <span>*</span> :
                                  </p>
                                  <div className="InputRadioProductText">
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="radio"
                                        name="meubleProduit"
                                        value="oui"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>Oui</label>
                                    </div>
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="radio"
                                        name="meubleProduit"
                                        value="non"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>Non</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Parking / Garage <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectParking === "aucun" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectParking("aucun");
                                        setstepParking({
                                          ...stepParking,
                                          stepParking1:
                                            !stepParking.stepParking1,
                                        });
                                        handleSelect("parkingProduit", "Aucun");
                                      }}
                                    >
                                      Aucun
                                    </p>
                                    <p
                                      className={`selectcategory ${selectParking === "Parking prive" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectParking("Parking prive");
                                        setstepParking({
                                          ...stepParking,
                                          stepParking2:
                                            !stepParking.stepParking2,
                                        });
                                        handleSelect(
                                          "parkingProduit",
                                          "Parking privé",
                                        );
                                      }}
                                    >
                                      Parking privé
                                    </p>
                                    <p
                                      className={`selectcategory ${selectParking === "Garage" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectParking("Garage");
                                        setstepParking({
                                          ...stepParking,
                                          stepParking3:
                                            !stepParking.stepParking3,
                                        });
                                        handleSelect(
                                          "parkingProduit",
                                          "Garage",
                                        );
                                      }}
                                    >
                                      Garage
                                    </p>
                                    <p
                                      className={`selectcategory ${selectParking === "Box" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectParking("Box");
                                        setstepParking({
                                          ...stepParking,
                                          stepParking4:
                                            !stepParking.stepParking4,
                                        });
                                        handleSelect("parkingProduit", "Box");
                                      }}
                                    >
                                      Box
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    DPE (Diagnostic Perf. Énergétique){" "}
                                    <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectdpe === "A" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectdpe("A");
                                        setstepdpe({
                                          ...stepdpe,
                                          stepdpe1: !stepdpe.stepdpe1,
                                        });
                                        handleSelect("dpeProduit", "A");
                                      }}
                                    >
                                      A
                                    </p>
                                    <p
                                      className={`selectcategory ${selectdpe === "B" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectdpe("B");
                                        setstepdpe({
                                          ...stepdpe,
                                          stepdpe2: !stepdpe.stepdpe2,
                                        });
                                        handleSelect("dpeProduit", "B");
                                      }}
                                    >
                                      B
                                    </p>
                                    <p
                                      className={`selectcategory ${selectdpe === "C" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectdpe("C");
                                        setstepdpe({
                                          ...stepdpe,
                                          stepdpe3: !stepdpe.stepdpe3,
                                        });
                                        handleSelect("dpeProduit", "C");
                                      }}
                                    >
                                      C
                                    </p>
                                    <p
                                      className={`selectcategory ${selectdpe === "D" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectdpe("D");
                                        setstepdpe({
                                          ...stepdpe,
                                          stepdpe4: !stepdpe.stepdpe4,
                                        });
                                        handleSelect("dpeProduit", "D");
                                      }}
                                    >
                                      D
                                    </p>
                                    <p
                                      className={`selectcategory ${selectdpe === "E" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectdpe("E");
                                        setstepdpe({
                                          ...stepdpe,
                                          stepdpe5: !stepdpe.stepdpe5,
                                        });
                                        handleSelect("dpeProduit", "E");
                                      }}
                                    >
                                      E
                                    </p>
                                    <p
                                      className={`selectcategory ${selectdpe === "F" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectdpe("F");
                                        setstepdpe({
                                          ...stepdpe,
                                          stepdpe6: !stepdpe.stepdpe6,
                                        });
                                        handleSelect("dpeProduit", "F");
                                      }}
                                    >
                                      F
                                    </p>
                                    <p
                                      className={`selectcategory ${selectdpe === "G" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectdpe("G");
                                        setstepdpe({
                                          ...stepdpe,
                                          stepdpe7: !stepdpe.stepdpe7,
                                        });
                                        handleSelect("dpeProduit", "G");
                                      }}
                                    >
                                      G
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Charges mensuelles (€) <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="chargesmensuellesProduit"
                                    value={dataproduit.chargesmensuellesProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="120"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Disponibilité <span>*</span> :
                                  </p>
                                  <input
                                    type="date"
                                    name="disponibiliteProduit"
                                    value={dataproduit.disponibiliteProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Prix (€) / Loyer <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="loyerProduit"
                                    value={dataproduit.loyerProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="950"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Description détaillée <span>*</span> :
                                  </p>
                                  <textarea
                                    name="descriptiondetailleeProduit"
                                    value={
                                      dataproduit.descriptiondetailleeProduit
                                    }
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Coup de cœur assuré pour cet appartement lumineux..."
                                  ></textarea>
                                </div>
                              </div>
                            </>
                          )}
                          {stepCategory.stepCategory2 && (
                            <>
                              <div className="ProductText">
                                <div className="ProductText">
                                  <p>
                                    Marque <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="marqueautoProduit"
                                    value={dataproduit.marqueautoProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Renault"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Modèle <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="modeleautoProduit"
                                    value={dataproduit.modeleautoProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Clio"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Année / Mise en circulation <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="circulationProduit"
                                    value={dataproduit.circulationProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="2020"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Kilométrages <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="kilometrageProduit"
                                    value={dataproduit.kilometrageProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="45000"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Carburant <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectcarburant === "essence" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcarburant("essence");
                                        setstepcarburant({
                                          ...stepcarburant,
                                          stepcarburant1:
                                            !stepcarburant.stepcarburant1,
                                        });
                                        handleSelect(
                                          "carburantProduit",
                                          "essence",
                                        );
                                      }}
                                    >
                                      Essence
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcarburant === "diesel" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcarburant("diesel");
                                        setstepcarburant({
                                          ...stepcarburant,
                                          stepcarburant2:
                                            !stepcarburant.stepcarburant2,
                                        });
                                        handleSelect(
                                          "carburantProduit",
                                          "diesel",
                                        );
                                      }}
                                    >
                                      Diesel
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcarburant === "hybride" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcarburant("hybride");
                                        setstepcarburant({
                                          ...stepcarburant,
                                          stepcarburant3:
                                            !stepcarburant.stepcarburant3,
                                        });
                                        handleSelect(
                                          "carburantProduit",
                                          "hybride",
                                        );
                                      }}
                                    >
                                      Hybride
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcarburant === "electrique" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcarburant("electrique");
                                        setstepcarburant({
                                          ...stepcarburant,
                                          stepcarburant4:
                                            !stepcarburant.stepcarburant4,
                                        });
                                        handleSelect(
                                          "carburantProduit",
                                          "electrique",
                                        );
                                      }}
                                    >
                                      Électrique
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcarburant === "autre" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcarburant("autre");
                                        setstepcarburant({
                                          ...stepcarburant,
                                          stepcarburant5:
                                            !stepcarburant.stepcarburant5,
                                        });
                                        handleSelect(
                                          "carburantProduit",
                                          "autre",
                                        );
                                      }}
                                    >
                                      Autre
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Puissance (ch) <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="puissanceautoProduit"
                                    value={dataproduit.puissanceautoProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="90"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Boîte de vitesse <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectboitevitesse === "manuelle" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectboitevitesse("manuelle");
                                        setstepboitevitesse({
                                          ...stepboitevitesse,
                                          stepboitevitesse1:
                                            !stepboitevitesse.stepboitevitesse1,
                                        });
                                        handleSelect(
                                          "boitevitesseProduit",
                                          "manuelle",
                                        );
                                      }}
                                    >
                                      Manuelle
                                    </p>
                                    <p
                                      className={`selectcategory ${selectboitevitesse === "automatique" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectboitevitesse("automatique");
                                        setstepboitevitesse({
                                          ...stepboitevitesse,
                                          stepboitevitesse2:
                                            !stepboitevitesse.stepboitevitesse2,
                                        });
                                        handleSelect(
                                          "boitevitesseProduit",
                                          "automatique",
                                        );
                                      }}
                                    >
                                      Automatique
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Nombre de portes <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="numberporteProduit"
                                    value={dataproduit.numberporteProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="5"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Couleur <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="couleurautoProduit"
                                    value={dataproduit.couleurautoProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Rouge"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Nombre de propriétaires précédents{" "}
                                    <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="proprioProduit"
                                    value={dataproduit.proprioProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="2"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Options principales <span>*</span> :
                                  </p>
                                  <div className="InputRadioProductText">
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="checkbox"
                                        name="specialautoProduit"
                                        value="Climatisation"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>Climatisation</label>
                                    </div>
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="checkbox"
                                        name="specialautoProduit"
                                        value="GPS"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>GPS</label>
                                    </div>
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="checkbox"
                                        name="specialautoProduit"
                                        value="Toit ouvrant"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>Toît ouvrant</label>
                                    </div>
                                    <div className="InputRadioProductTextItem">
                                      <input
                                        type="checkbox"
                                        name="specialautoProduit"
                                        value="Camera de recul"
                                        onChange={handlechangeproduit}
                                      />
                                      <label>Caméra de recul</label>
                                    </div>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Prix (€) <span>*</span> :
                                  </p>
                                  <input
                                    type="number"
                                    name="prixautoProduit"
                                    value={dataproduit.prixautoProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="12500"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {stepCategory.stepCategory3 && (
                            <>
                              <div className="ProductText">
                                <div className="ProductText">
                                  <p>
                                    Type de produit <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectelectronique === "ordinateur" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectelectronique("ordinateur");
                                        setstepelectronique({
                                          ...stepelectronique,
                                          stepelectronique1:
                                            !stepelectronique.stepelectronique1,
                                        });
                                        handleSelect(
                                          "electroniqueProduit",
                                          "ordinateur",
                                        );
                                      }}
                                    >
                                      Ordinateur
                                    </p>
                                    <p
                                      className={`selectcategory ${selectelectronique === "telephone" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectelectronique("telephone");
                                        setstepelectronique({
                                          ...stepelectronique,
                                          stepelectronique2:
                                            !stepelectronique.stepelectronique2,
                                        });
                                        handleSelect(
                                          "electroniqueProduit",
                                          "telephone",
                                        );
                                      }}
                                    >
                                      Téléphone
                                    </p>
                                    <p
                                      className={`selectcategory ${selectelectronique === "TV" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectelectronique("TV");
                                        setstepelectronique({
                                          ...stepelectronique,
                                          stepelectronique3:
                                            !stepelectronique.stepelectronique3,
                                        });
                                        handleSelect(
                                          "electroniqueProduit",
                                          "TV",
                                        );
                                      }}
                                    >
                                      TV
                                    </p>
                                    <p
                                      className={`selectcategory ${selectelectronique === "Console" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectelectronique("Console");
                                        setstepelectronique({
                                          ...stepelectronique,
                                          stepelectronique4:
                                            !stepelectronique.stepelectronique4,
                                        });
                                        handleSelect(
                                          "electroniqueProduit",
                                          "Console",
                                        );
                                      }}
                                    >
                                      Console
                                    </p>
                                    <p
                                      className={`selectcategory ${selectelectronique === "autre" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectelectronique("autre");
                                        setstepelectronique({
                                          ...stepelectronique,
                                          stepelectronique5:
                                            !stepelectronique.stepelectronique5,
                                        });
                                        handleSelect(
                                          "electroniqueProduit",
                                          "autre",
                                        );
                                      }}
                                    >
                                      Autre
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Marque <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="marqueelectroProduit"
                                    value={dataproduit.marqueelectroProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Apple"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Modèle / Référence <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="modeleelectroProduit"
                                    value={dataproduit.modeleelectroProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="iPhone 14"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Spécifications techniques <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="specialelectroProduit"
                                    value={dataproduit.specialelectroProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Stockage: 256GB, RAM: 8GB"
                                  />
                                </div>

                                <div className="ProductText">
                                  <p>
                                    Accessoires inclus <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="accessoireelectroProduit"
                                    value={dataproduit.accessoireelectroProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Chargeur, câble, boîte d'origine"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                          {stepCategory.stepCategory4 && (
                            <>
                              <div className="ProductText">
                                <div className="ProductText">
                                  <p>
                                    Genre <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectgenre === "hommme" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectgenre("homme");
                                        setstepgenre({
                                          ...stepgenre,
                                          stepgenre1: !stepgenre.stepgenre1,
                                        });
                                        handleSelect("genreProduit", "homme");
                                      }}
                                    >
                                      Homme
                                    </p>
                                    <p
                                      className={`selectcategory ${selectgenre === "femme" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectgenre("femme");
                                        setstepgenre({
                                          ...stepgenre,
                                          stepgenre2: !stepgenre.stepgenre2,
                                        });
                                        handleSelect("genreProduit", "femme");
                                      }}
                                    >
                                      Femme
                                    </p>
                                    <p
                                      className={`selectcategory ${selectgenre === "enfant" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectgenre("enfant");
                                        setstepgenre({
                                          ...stepgenre,
                                          stepgenre3: !stepgenre.stepgenre3,
                                        });
                                        handleSelect("genreProduit", "enfant");
                                      }}
                                    >
                                      Enfant
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Catégorie <span>*</span> :
                                  </p>
                                  <div className="ProductCategory">
                                    <p
                                      className={`selectcategory ${selectcategorie === "T-shirt / Top" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcategorie("T-shirt / Top");
                                        setstepcategorie({
                                          ...stepcategorie,
                                          stepcategorie1:
                                            !stepcategorie.stepcategorie1,
                                        });
                                        handleSelect(
                                          "categorieProduit",
                                          "T-shirt / Top",
                                        );
                                      }}
                                    >
                                      T-shirt / Top
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcategorie === "Pantalon / Jean" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcategorie("Pantalon / Jean");
                                        setstepcategorie({
                                          ...stepcategorie,
                                          stepcategorie2:
                                            !stepcategorie.stepcategorie2,
                                        });
                                        handleSelect(
                                          "categorieProduit",
                                          "Pantalon / Jean",
                                        );
                                      }}
                                    >
                                      Pantalon / Jean
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcategorie === "Robe / Jupe" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcategorie("Robe / Jupe");
                                        setstepcategorie({
                                          ...stepcategorie,
                                          stepcategorie3:
                                            !stepcategorie.stepcategorie3,
                                        });
                                        handleSelect(
                                          "categorieProduit",
                                          "Robe / Jupe",
                                        );
                                      }}
                                    >
                                      Robe / Jupe
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcategorie === "Chaussures" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcategorie("Chaussures");
                                        setstepcategorie({
                                          ...stepcategorie,
                                          stepcategorie4:
                                            !stepcategorie.stepcategorie4,
                                        });
                                        handleSelect(
                                          "categorieProduit",
                                          "Chaussures",
                                        );
                                      }}
                                    >
                                      Chaussures
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcategorie === "Accessoire" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcategorie("Accessoire");
                                        setstepcategorie({
                                          ...stepcategorie,
                                          stepcategorie5:
                                            !stepcategorie.stepcategorie5,
                                        });
                                        handleSelect(
                                          "categorieProduit",
                                          "Accessoire",
                                        );
                                      }}
                                    >
                                      Accessoire
                                    </p>
                                    <p
                                      className={`selectcategory ${selectcategorie === "Autre" ? "act" : ""}`}
                                      onClick={() => {
                                        setselectcategorie("Autre");
                                        setstepcategorie({
                                          ...stepcategorie,
                                          stepcategorie6:
                                            !stepcategorie.stepcategorie6,
                                        });
                                        handleSelect(
                                          "categorieProduit",
                                          "Autre",
                                        );
                                      }}
                                    >
                                      Autre
                                    </p>
                                  </div>
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Marque <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="marquehabitProduit"
                                    value={dataproduit.marquehabitProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Nike, Zara, etc."
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Taille (lettre) <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="taillehabitProduit"
                                    value={dataproduit.taillehabitProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="M / L / 38 / 42"
                                  />
                                </div>
                                <div className="ProductText">
                                  <p>
                                    Matière principale <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="matierehabitProduit"
                                    value={dataproduit.matierehabitProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="100% coton"
                                  />
                                </div>

                                <div className="ProductText">
                                  <p>
                                    Couleur <span>*</span> :
                                  </p>
                                  <input
                                    type="text"
                                    name="couleurhabitProduit"
                                    value={dataproduit.couleurhabitProduit}
                                    id=""
                                    onChange={handlechangeproduit}
                                    placeholder="Bleu marine"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          <div className="ProductText">
                            <p>Ajouter un complément d'information :</p>
                            <textarea
                              name="complementinformation"
                              value={dataproduit.complementinformation}
                              onChange={handlechangeproduit}
                              id=""
                              spellCheck
                            />
                          </div>
                        </div>
                        <div className="btnaddProduct">
                          <Button className="accept">Publier le produit</Button>
                        </div>
                      </form>
                    </div>
                  )}
                  <div className="listeProduct">
                    <h2>liste de mes produits publiés</h2>
                    <div className="dashboardSteppersHistory">
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th>Photo</th>
                              <th>Nom Article</th>
                              <th>Categories</th>
                              <th>Quantité</th>
                              <th>Prix Unitaire</th>
                              <th>Statut</th>
                              <th>Modifier</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <img src={img2} alt="" />
                              </td>
                              <td>
                                <p>dimitri</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>2</td>
                              <td>1000</td>
                              <td>
                                <Button className="accept">Activer</Button>
                              </td>
                              <td>
                                <Button>Modifier</Button>
                              </td>
                              <td>
                                <Button className="decline">Supprimer</Button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img src={img2} alt="" />
                              </td>
                              <td>
                                <p>dimitri</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>5</td>
                              <td>1000</td>
                              <td>
                                <Button className="accept">Désactiver</Button>
                              </td>
                              <td>
                                <Button>Modifier</Button>
                              </td>
                              <td>
                                <Button className="decline">Supprimer</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    </div>
                    <h2>Modifier un produit</h2>
                    <div className="">
                      <form action="">
                        <div className="ProductText">
                          <p>
                            Nom du produit <span>*</span> :
                          </p>
                          <input
                            type="text"
                            name=""
                            id=""
                            placeholder="saisir le nom du produit"
                          />
                        </div>
                        <div className="ProductText">
                          <p>
                            Prix du produit <span>*</span> :
                          </p>
                          <input
                            type="number"
                            name=""
                            id=""
                            placeholder="saisir le prix du produit"
                          />
                        </div>
                        <div className="ProductText">
                          <p>
                            Ajouter des photos du produit, 5 maximum et minimun
                            1 <span>*</span> :
                          </p>
                          <p>
                            La photo principale sera la photo de couverture :
                          </p>
                          <div className="ProductPictureItem">
                            <div className="ProductPicture">
                              <img src={pen} alt="" />
                            </div>
                            <input
                              type="file"
                              name=""
                              id=""
                              style={{ display: "none" }}
                            />
                          </div>

                          <p>
                            Cliquez sur les cadres ci-dessous pour ajouter des
                            photos ou modifier :
                          </p>
                          <div className="SecondPicture">
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                <div className="ProductPictureLogo">
                                  <img src={pen} alt="" />
                                  <img src={dup} alt="" />
                                </div>
                              </div>
                              <input
                                type="file"
                                name=""
                                id=""
                                style={{ display: "none" }}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                <div className="ProductPictureLogo">
                                  <img src={pen} alt="" />
                                  <img src={dup} alt="" />
                                </div>
                              </div>
                              <input
                                type="file"
                                name=""
                                id=""
                                style={{ display: "none" }}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                <div className="ProductPictureLogo">
                                  <img src={pen} alt="" />
                                  <img src={dup} alt="" />
                                </div>
                              </div>
                              <input
                                type="file"
                                name=""
                                id=""
                                style={{ display: "none" }}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                <div className="ProductPictureLogo">
                                  <img src={pen} alt="" />
                                  <img src={dup} alt="" />
                                </div>
                              </div>
                              <input
                                type="file"
                                name=""
                                id=""
                                style={{ display: "none" }}
                              />
                            </div>
                            <div className="ProductPictureSecondItem">
                              <div className="ProductPictureSecond">
                                <div className="ProductPictureLogo">
                                  <img src={pen} alt="" />
                                  <img src={dup} alt="" />
                                </div>
                              </div>
                              <input
                                type="file"
                                name=""
                                id=""
                                style={{ display: "none" }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ProductText">
                          <p>
                            Description du produit <span>*</span> :
                          </p>
                          <textarea name="" id="" spellCheck>
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Iste, accusamus mollitia! Voluptatem impedit
                            neque aliquam ad, recusandae fugit ratione
                            voluptatum tempora itaque ut. Quidem deleniti sed
                            corporis fugiat et repudiandae.Lorem ipsum dolor sit
                            amet, consectetur adipisicing elit. Iste, accusamus
                            mollitia! Voluptatem impedit neque aliquam ad,
                            recusandae fugit ratione voluptatum tempora itaque
                            ut. Quidem deleniti sed corporis fugiat et
                            repudiandae.Lorem ipsum dolor sit amet, consectetur
                            adipisicing elit. Iste, accusamus mollitia!
                            Voluptatem impedit neque aliquam ad, recusandae
                            fugit ratione voluptatum tempora itaque ut. Quidem
                            deleniti sed corporis fugiat et repudiandae.Lorem
                            ipsum dolor sit amet, consectetur adipisicing elit.
                            Iste, accusamus mollitia! Voluptatem impedit neque
                            aliquam ad, recusandae fugit ratione voluptatum
                            tempora itaque ut. Quidem deleniti sed corporis
                            fugiat et repudiandae.
                          </textarea>
                          <div className="addWriteIa">
                            <Button>
                              Aider vous de l'IA pour modifier la description
                            </Button>
                            <progress />
                          </div>
                        </div>
                        <div className="ProductText">
                          <p>Ajouter une vidéo du produit :</p>
                          <div className="ProductPictureItem">
                            <div className="ProductPicture">
                              <img src={pen} alt="" />
                            </div>
                            <input
                              type="file"
                              accept="video/*"
                              name=""
                              id=""
                              style={{ display: "none" }}
                            />
                          </div>
                        </div>
                        <div className="ProductText">
                          <p>
                            Sélectionner une catégorie de produit <span>*</span>{" "}
                            :
                          </p>
                          <div className="ProductCategory">
                            <p>Immobilier</p>
                            <p>Automobile</p>
                            <p>électronique</p>
                            <p>Mode</p>
                            <p>emploi</p>
                            <p>Autre</p>
                          </div>
                        </div>
                        <div className="ProductItems">
                          <>
                            <div className="">
                              <div className="ProductText">
                                <p>
                                  Ville <span>*</span> :
                                </p>
                                <input type="text" placeholder="Ex: Lyon" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Code postal <span>*</span> :
                                </p>
                                <input type="text" placeholder="69001" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Adresse <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="12 rue de la République"
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Surface (m²) <span>*</span> :
                                </p>
                                <input type="number" placeholder="65" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Type de bien <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Appartement</p>
                                  <p>Maison</p>
                                  <p>Studio</p>
                                  <p>Terrain</p>
                                  <p>Autre</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Nombre de pièces <span>*</span> :
                                </p>
                                <input type="number" placeholder="3" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Nombre de chambres <span>*</span> :
                                </p>
                                <input type="number" placeholder="2" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Nombre de salles de bain <span>*</span> :
                                </p>
                                <input type="number" placeholder="1" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Étage / étages total <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="3ème / 5 étages"
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Ascenseur <span>*</span> :
                                </p>
                                <div className="InputRadioProductText">
                                  <div className="InputRadioProductTextItem">
                                    <input type="radio" name="ascenseur" />
                                    <label>Oui</label>
                                  </div>
                                  <div className="InputRadioProductTextItem">
                                    <input type="radio" name="ascenseur" />
                                    <label>Non</label>
                                  </div>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Meublé <span>*</span> :
                                </p>
                                <div className="InputRadioProductText">
                                  <div className="InputRadioProductTextItem">
                                    <input type="radio" name="meuble" />
                                    <label>Oui</label>
                                  </div>
                                  <div className="InputRadioProductTextItem">
                                    <input type="radio" name="meuble" />
                                    <label>Non</label>
                                  </div>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Parking / Garage <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Aucun</p>
                                  <p>Parking privé</p>
                                  <p>Garage</p>
                                  <p>Box</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  DPE (Diagnostic Perf. Énergétique){" "}
                                  <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>A</p>
                                  <p>B</p>
                                  <p>C</p>
                                  <p>D</p>
                                  <p>E</p>
                                  <p>F</p>
                                  <p>G</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Charges mensuelles (€) <span>*</span> :
                                </p>
                                <input type="number" placeholder="120" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Disponibilité <span>*</span> :
                                </p>
                                <input type="date" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Prix (€) / Loyer <span>*</span> :
                                </p>
                                <input type="number" placeholder="950" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Description détaillée <span>*</span> :
                                </p>
                                <textarea placeholder="Coup de cœur assuré pour cet appartement lumineux..."></textarea>
                              </div>
                            </div>
                          </>
                          <>
                            <div className="ProductText">
                              <div className="ProductText">
                                <p>
                                  Marque <span>*</span> :
                                </p>
                                <input type="text" placeholder="Renault" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Modèle <span>*</span> :
                                </p>
                                <input type="text" placeholder="Clio" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Année / Mise en circulation <span>*</span> :
                                </p>
                                <input type="number" placeholder="2020" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Kilométrages <span>*</span> :
                                </p>
                                <input type="number" placeholder="45000" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Carburant <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Essence</p>
                                  <p>Diesel</p>
                                  <p>Hybride</p>
                                  <p>Électrique</p>

                                  <p>Autre</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Puissance (ch) <span>*</span> :
                                </p>
                                <input type="number" placeholder="90" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Boîte de vitesse <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Manuelle</p>
                                  <p>Automatique</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Nombre de portes <span>*</span> :
                                </p>
                                <input type="number" placeholder="5" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Couleur <span>*</span> :
                                </p>
                                <input type="text" placeholder="Rouge" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Nombre de propriétaires précédents{" "}
                                  <span>*</span> :
                                </p>
                                <input type="number" placeholder="2" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Options principales <span>*</span> :
                                </p>
                                <div className="InputRadioProductText">
                                  <div className="InputRadioProductTextItem">
                                    <input type="checkbox" name="" />
                                    <label>Climatisation</label>
                                  </div>
                                  <div className="InputRadioProductTextItem">
                                    <input type="checkbox" name="" />
                                    <label>GPS</label>
                                  </div>
                                  <div className="InputRadioProductTextItem">
                                    <input type="checkbox" name="" />
                                    <label>Toit ouvrant</label>
                                  </div>
                                  <div className="InputRadioProductTextItem">
                                    <input type="checkbox" name="" />
                                    <label>Caméra de recul</label>
                                  </div>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Prix (€) <span>*</span> :
                                </p>
                                <input type="number" placeholder="12500" />
                              </div>
                            </div>
                          </>
                          <>
                            <div className="ProductText">
                              <div className="ProductText">
                                <p>
                                  Type de produit <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Ordinateur</p>
                                  <p>Téléphone</p>
                                  <p>TV</p>
                                  <p>Console</p>
                                  <p>Autre</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Marque <span>*</span> :
                                </p>
                                <input type="text" placeholder="Apple" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Modèle / Référence <span>*</span> :
                                </p>
                                <input type="text" placeholder="iPhone 14" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Spécifications techniques <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="Stockage: 256GB, RAM: 8GB"
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  État <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Neuf </p>
                                  <p>Comme neuf</p>
                                  <p>Très bon état</p>
                                  <p>Bon état</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Accessoires inclus <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="Chargeur, câble, boîte d'origine"
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Garantie restante <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Oui </p>
                                  <p>Non</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Prix (€) <span>*</span> :
                                </p>
                                <input type="number" placeholder="650" />
                              </div>
                            </div>
                          </>
                          <>
                            <div className="ProductText">
                              <div className="ProductText">
                                <p>
                                  Genre <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Homme</p>
                                  <p>Femme</p>
                                  <p>Enfant</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Catégorie <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>T-shirt / Top</p>
                                  <p>Pantalon / Jean</p>
                                  <p>Robe / Jupe</p>
                                  <p>Chaussures</p>
                                  <p>Accessoire</p>
                                  <p>Autre</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Marque <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="Nike, Zara, etc."
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Taille (lettre) <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="M / L / 38 / 42"
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Matière principale <span>*</span> :
                                </p>
                                <input type="text" placeholder="100% coton" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  État <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Neuf avec étiquette</p>
                                  <p>Comme neuf</p>
                                  <p>Très bon état</p>
                                  <p>Bon état</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Couleur <span>*</span> :
                                </p>
                                <input type="text" placeholder="Bleu marine" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Prix (€) <span>*</span> :
                                </p>
                                <input type="number" placeholder="25" />
                              </div>
                            </div>
                          </>
                          <>
                            <div className="ProductText">
                              <div className="ProductText">
                                <p>
                                  Intitulé du poste <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="Développeur Full Stack"
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Entreprise <span>*</span> :
                                </p>
                                <input type="text" placeholder="TechCorp" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Type de contrat <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>CDI</p>
                                  <p>CDD</p>
                                  <p>Freelance</p>
                                  <p>Intérim</p>
                                  <p>Stage</p>
                                  <p>Alternance</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Niveau d'expérience requis <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>Débutant</p>
                                  <p>Junior (1-2 ans)</p>
                                  <p>Confirmé (3-5 ans)</p>
                                  <p>Senior (5+ ans)</p>
                                  <p>Expert</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Salaire (brut annuel / TJM) <span>*</span> :
                                </p>
                                <input type="number" placeholder="45000" />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Localisation (Ville / Remote) <span>*</span> :
                                </p>
                                <input
                                  type="text"
                                  placeholder="Paris / Full Remote"
                                />
                              </div>
                              <div className="ProductText">
                                <p>
                                  Télétravail <span>*</span> :
                                </p>
                                <div className="ProductCategory">
                                  <p>0% (100% présentiel)</p>
                                  <p>1-2 jours/semaine</p>
                                  <p>3-4 jours/semaine</p>
                                  <p>100% télétravail</p>
                                  <p>à négocier</p>
                                </div>
                              </div>
                              <div className="ProductText">
                                <p>
                                  Description de la mission <span>*</span> :
                                </p>
                                <textarea placeholder="Nous recherchons un profil dynamique..."></textarea>
                              </div>
                            </div>
                          </>
                          <div className="ProductText">
                            <p>Ajouter un complément d'information :</p>
                            <textarea name="" id="">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicings
                            </textarea>
                          </div>
                        </div>
                        <div className="btnaddProduct">
                          <Button className="accept">
                            Modifier le produit
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="">
                    <h2>Produits achetés</h2>
                    <div className="dashboardSteppersHistory">
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th>Photo</th>
                              <th>Nom Article</th>
                              <th>Categories</th>
                              <th>Quantité</th>
                              <th>Prix </th>
                              <th>Statut</th>
                              <th>Commenter</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <img src={img2} alt="" />
                              </td>
                              <td>
                                <p>dimitri</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>2</td>
                              <td>1000</td>
                              <td>
                                <Button className="accept">Livrer</Button>
                              </td>
                              <td>
                                <Button>Commenter</Button>
                              </td>
                              <td>
                                <Button className="decline">Supprimer</Button>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <img src={img2} alt="" />
                              </td>
                              <td>
                                <p>dimitri</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>5</td>
                              <td>1000</td>
                              <td>
                                <Button className="accept">
                                  En cours de livraison
                                </Button>
                              </td>
                              <td>
                                <Button>Commenter</Button>
                              </td>
                              <td>
                                <Button className="decline">Supprimer</Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    </div>
                    <div className="ProductText">
                      <h2>
                        Commenter votre produit réçu,vous pouvez ajouter aussis
                        des étoiles
                      </h2>
                      <p>
                        Votre avis concernnant le Iphone 13 <span>*</span> :
                      </p>
                      <textarea placeholder="Nous recherchons un profil dynamique..."></textarea>
                    </div>
                    <div className="btnaddProductAvis">
                      <Stack spacing={1}>
                        <Rating
                          name="half-rating"
                          defaultValue={4}
                          precision={0.5}
                        />
                      </Stack>
                      <Button>envoyer l'avis</Button>
                    </div>
                  </div>
                  <div className="">
                    <h2>liste des médias</h2>
                    <div className="">
                      <p>Image :</p>
                      <p>Vidéos :</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step.step6 && (
              <div className="dashboardSteppers">
                <div className="dashboardStepperSms">
                  <div className="MessageProfil">
                    <div className="MessageSearch">
                      <p>Mes messages</p>
                      <input
                        type="search"
                        name=""
                        id=""
                        placeholder="Entrer un nom "
                      />
                    </div>
                    <div className="ProfilUser">
                      {Profil.map((p) => (
                        <div className="ProfilUserItem" key={p.id}>
                          <img src={p.photo} alt="" />
                          <div className="ProfilUserText">
                            <p>{p.name}</p>
                            <span>{p.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="MessageItem">
                    <div className="MessageItemHeader">
                      <img src={img2} alt="" />
                      <p>Dimitri</p>
                    </div>
                    <div className="MessageItemContent">
                      <div className="SmsHome">
                        <p>
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Recusandae earum omnis praesentium dolorum
                          corporis repellat id eligendi corrupti voluptatum!
                          Voluptates minima quae itaque omnis exercitationem
                          maiores fugit necessitatibus et iusto.
                        </p>
                        <span>12:50</span>
                      </div>
                      <div className="AwayHome">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Magnam quod sint dolorum, quibusdam error
                          dolorem? Accusantium nostrum commodi ut deserunt sint
                          quia necessitatibus dolore distinctio quaerat
                          sapiente. Facere, odio assumenda!
                        </p>
                        <span>12:50</span>
                      </div>
                      <div className="AwayHome">
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Magnam quod sint dolorum, quibusdam error
                          dolorem? Accusantium nostrum commodi ut deserunt sint
                          quia necessitatibus dolore distinctio quaerat
                          sapiente. Facere, odio assumenda! Lorem ipsum dolor
                          sit amet consectetur adipisicing elit. Magnam quod
                          sint dolorum, quibusdam error dolorem? Accusantium
                          nostrum commodi ut deserunt sint quia necessitatibus
                          dolore distinctio quaerat sapiente. Facere, odio
                          assumenda!
                        </p>
                        <span>12:50</span>
                      </div>
                      <div className="SmsHome">
                        <p>
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Recusandae earum omnis praesentium dolorum
                          corporis repellat id eligendi corrupti voluptatum!
                          Voluptates minima quae itaque omnis exercitationem
                          maiores fugit necessitatibus et iusto.
                        </p>
                        <span>12:50</span>
                      </div>
                      <div className="SmsHome">
                        <p>
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Recusandae earum omnis praesentium dolorum
                          corporis repellat id eligendi corrupti voluptatum!
                          Voluptates minima quae itaque omnis exercitationem
                          maiores fugit necessitatibus et iusto.
                        </p>
                        <span>12:50</span>
                      </div>
                    </div>
                    <div className="MessageOption">
                      <div className="MessageOptionMedia">
                        <div className="MessageOptionMediaItem">
                          <p>Icônes</p>
                          <img src={star} alt="" />
                        </div>
                        <div className="MessageOptionMediaItem">
                          <p>Photo</p>
                          <img src={image} alt="" />
                        </div>
                        <div className="MessageOptionMediaItem">
                          <p>Média</p>
                          <img src={media} alt="" />
                        </div>
                      </div>
                      <div className="MessageOptionText">
                        <textarea
                          name=""
                          id=""
                          placeholder="saisir votre message"
                        ></textarea>
                      </div>
                      <div className="MessageSend">
                        <div className="MessageOptionMediaItem">
                          <p>Envoyer</p>
                          <Button>
                            <img src={send} alt="" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {step.step7 && (
              <div className="dashboardSteppers">
                <h2>Prenuim</h2>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Tendances des produits</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="dashboardStepperx">
                    <p style={{ padding: "20px 0" }}>Janvier 2026</p>
                    <div className="dashboardSteppersHistory">
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th>Numéro</th>
                              <th>Nom produit</th>
                              <th>Categories</th>
                              <th>Recherche</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <p>1</p>
                              </td>
                              <td>
                                <p>appartements</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>5</td>
                            </tr>
                            <tr>
                              <td>
                                <p>1</p>
                              </td>
                              <td>
                                <p>appartements</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>5</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    </div>
                  </div>
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>produits qui se vendent le plus</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="dashboardStepperx">
                    <p style={{ padding: "20px 0" }}>Janvier 2026</p>
                    <div className="dashboardSteppersHistory">
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th>Numéro</th>
                              <th>photo</th>
                              <th>Nom produit</th>
                              <th>Categories</th>
                              <th>articles vendus</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <p>1</p>
                              </td>
                              <td>
                                <img src={img2} alt="" />
                              </td>
                              <td>
                                <p>appartements</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>5</td>
                            </tr>
                            <tr>
                              <td>
                                <p>2</p>
                              </td>
                              <td>
                                <img src={img2} alt="" />
                              </td>
                              <td>
                                <p>appartements</p>
                              </td>
                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                              <td>5</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    </div>
                  </div>
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Catégories populaires</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="dashboardStepperx">
                    <p style={{ padding: "20px 0" }}>Janvier 2026</p>
                    <div className="dashboardSteppersHistory">
                      <>
                        <table>
                          <thead>
                            <tr>
                              <th>Numéro</th>
                              <th>Categories</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <p>1</p>
                              </td>

                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <p>1</p>
                              </td>

                              <td>
                                <p>IMMOBILIER</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    </div>
                  </div>
                </div>
                <div className="">
                  <h2>Activer le mode prenuim et béneficier de:</h2>
                  <ul>
                    <li>Visualisation des retours utilisateurs.</li>
                    <li>Réponse aux messages des clients sous vos articles.</li>
                    <li>Avoir une tendance des produits les plus vendus.</li>
                    <li>
                      Se faire aider par l'IA pour rédiger ses descriptions de
                      ses articles.
                    </li>
                    <li>Être notifier en premier des dernières activités.</li>
                  </ul>
                </div>
              </div>
            )}
            {step.step8 && (
              <div className="dashboardSteppers">
                <h2>Paramètre</h2>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Se déconnecter</p>
                    <div className="">
                      <img
                        src={parastep.parastep1 ? up : down}
                        alt=""
                        onClick={() => {
                          setparastep({
                            ...parastep,
                            parastep1: !parastep.parastep1,
                          });
                        }}
                      />
                    </div>
                  </div>
                  {parastep.parastep1 && (
                    <div className="SettingItem">
                      <p>dimitri, voulez vous vraiment vous déconnecter ?</p>
                      <div className="Settingbtn">
                        <Button
                          className="decline"
                          onClick={() => navigate("/connexion")}
                        >
                          oui
                        </Button>
                        <Button
                          onClick={() => {
                            setSelecttext("dashboard");
                            setStep({
                              step1: true,
                              step2: false,
                              step3: false,
                              step4: false,
                              step5: false,
                              step6: false,
                              step7: false,
                              step8: false,
                              step9: false,
                            });
                          }}
                        >
                          non
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Changer de mot de passe</p>
                    <div className="">
                      <img
                        src={parastep.parastep2 ? up : down}
                        alt=""
                        onClick={() =>
                          setparastep({
                            ...parastep,
                            parastep2: !parastep.parastep2,
                          })
                        }
                      />
                    </div>
                  </div>
                  {parastep.parastep2 && (
                    <div className="SettingItem">
                      <p>Dimitri, Vous voulez changer vos mots de passe?</p>
                      <div className="SettingInput">
                        <form action="" onSubmit={handlesubmitpassword}>
                          <div className="">
                            <p>Mot de passe actuel</p>
                            <input
                              type="text"
                              name="passwordUser"
                              value={dataform.passwordUser}
                              id=""
                              onChange={handlechangepassword}
                            />
                          </div>
                          <div className="">
                            <p>Nouveau mot de passe</p>
                            <input
                              type="text"
                              name="confirmpasswordUser"
                              id=""
                              value={dataform.confirmpasswordUser}
                              onChange={handlechangepassword}
                            />
                          </div>
                          {showrestriction && (
                            <div className="Restriction">
                              {restriction.map((p) => (
                                <div
                                  className="RestrictionPart"
                                  key={p.id}
                                  style={{
                                    color: checkpassword(p) ? "green" : "red",
                                  }}
                                >
                                  <img
                                    src={checkpassword(p) ? tr : fa}
                                    alt=""
                                  />
                                  <p>{p.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="formbtn">
                            <Button className="accept" type="submit">
                              Sauvegarder
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Changer photo de profil</p>
                    <div className="">
                      <img
                        src={parastep.parastep3 ? up : down}
                        alt=""
                        onClick={() =>
                          setparastep({
                            ...parastep,
                            parastep3: !parastep.parastep3,
                          })
                        }
                      />
                    </div>
                  </div>
                  {parastep.parastep3 && (
                    <div className="SettingItem">
                      <p>Dimitri, Vous voulez changer votre photo de profil?</p>
                      <div className="SettingInput">
                        <form action="" onSubmit={handlesubmitpicture}>
                          <div className="PictureHeader">
                            <img src={pictureprofil} alt="" />
                            <div className="PictureAdd">
                              <img
                                src={pen}
                                alt=""
                                onClick={handlechangepicture}
                              />
                              <input
                                type="file"
                                name="userPhoto"
                                id=""
                                style={{ display: "none" }}
                                ref={refpicture}
                                onChange={handlechangeprofil}
                              />
                            </div>
                          </div>
                          <p style={{ textAlign: "center", padding: "10px 0" }}>
                            Vous pouvez choisir un des avatars ci-dessous :
                          </p>
                          <div className="avatarsPictureItem">
                            {avatar.map((p) => (
                              <div className="avatarsPicture" key={p.id}>
                                <img
                                  src={p.photo}
                                  alt=""
                                  onClick={() => setpictureprofil(p.photo)}
                                />
                              </div>
                            ))}
                          </div>

                          <div className="formbtn">
                            <Button className="accept" type="submit">
                              Sauvegarder
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Supprimer le compte</p>
                    <div className="">
                      <img
                        src={parastep.parastep4 ? up : down}
                        alt=""
                        onClick={() =>
                          setparastep({
                            ...parastep,
                            parastep4: !parastep.parastep4,
                          })
                        }
                      />
                    </div>
                  </div>
                  {parastep.parastep4 && (
                    <div className="SettingItem">
                      <p>
                        dimitri, voulez vous vraiment supprimer votre compte ?
                      </p>
                      <div className="Settingbtn">
                        <Button
                          className="decline"
                          onClick={() => setOpen(true)}
                        >
                          oui
                        </Button>
                        <Button
                          onClick={() =>
                            setparastep({
                              ...parastep,
                              parastep4: !parastep.parastep4,
                            })
                          }
                        >
                          non
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Changer police des messages</p>
                    <div className="">
                      <img
                        src={parastep.parastep5 ? up : down}
                        alt=""
                        onClick={() =>
                          setparastep({
                            ...parastep,
                            parastep5: !parastep.parastep5,
                          })
                        }
                      />
                    </div>
                  </div>
                  {parastep.parastep5 && (
                    <div className="SettingItem">
                      <p>
                        Selectionner une police de votre choix pour vos Messages
                      </p>
                      <p style={{ fontFamily: `${policeprofil}` }}>
                        Hello dimitri, phrase test.
                      </p>

                      <div className="SettingPolice">
                        <form action="" onSubmit={handlesubmitpolice}>
                          <div className="SettingPoliceForm">
                            {styles.map((p) => (
                              <div className="SettingPoliceItem" key={p.id}>
                                <p
                                  onClick={() => setpoliceprofil(p.police)}
                                  className={`choosepolice ${policeprofil === p.police ? "act" : ""}`}
                                >
                                  {p.police}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="formbtn">
                            <Button className="accept" type="submit">
                              Sauvegarder
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>informations sur le compte</p>
                    <div className="">
                      <img
                        src={parastep.parastep6 ? up : down}
                        alt=""
                        onClick={() =>
                          setparastep({
                            ...parastep,
                            parastep6: !parastep.parastep6,
                          })
                        }
                      />
                    </div>
                  </div>
                  {parastep.parastep6 && (
                    <div className="SettingItem">
                      <p>Nom : DIMITRI SIMO</p>
                      <p>Email : simodimitri08@gmail.com</p>
                      <p>Date d'adhésion : 11/05/2024</p>
                      <p>Statut : vendeur profil certifié ⭐⭐⭐ </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {step.step9 && (
              <div className="dashboardStepperx">
                <h2>Historiques</h2>
                <p>Janvier 2026</p>
                <div className="dashboardSteppersHistory">
                  <>
                    <div className="dashboardSteppersHistoryAction">
                      <div className="HistoryAction">
                        <p>Télécharger</p>
                        <img src={save} alt="" />
                      </div>
                      <div className="HistoryAction">
                        <p>Supprimer</p>
                        <img src={dup} alt="" />
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Photo</th>
                          <th>Nom Article</th>
                          <th>Categories</th>
                          <th>Quantité</th>
                          <th>Prix Total</th>
                          <th>Nom du vendeur</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img src={img2} alt="" />
                          </td>
                          <td>
                            <p>dimitri</p>
                          </td>
                          <td>
                            <p>IMMOBILIER</p>
                          </td>
                          <td>1</td>
                          <td>1000</td>
                          <td>dimitri</td>
                          <td>06/12/2015</td>
                        </tr>
                        <tr>
                          <td>
                            <img src={img2} alt="" />
                          </td>
                          <td>
                            <p>dimitri</p>
                          </td>
                          <td>
                            <p>IMMOBILIER</p>
                          </td>
                          <td>1</td>
                          <td>1000</td>
                          <td>dimitri</td>
                          <td>06/12/2015</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                  <>
                    <div className="dashboardSteppersHistoryAction">
                      <div className="HistoryAction">
                        <p>Télécharger</p>
                        <img src={save} alt="" />
                      </div>
                      <div className="HistoryAction">
                        <p>Supprimer</p>
                        <img src={dup} alt="" />
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Photo</th>
                          <th>Nom Article</th>
                          <th>Categories</th>
                          <th>Quantité</th>
                          <th>Prix Total</th>
                          <th>Nom du vendeur</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <img src={img2} alt="" />
                          </td>
                          <td>
                            <p>dimitri</p>
                          </td>
                          <td>
                            <p>IMMOBILIER</p>
                          </td>
                          <td>1</td>
                          <td>1000</td>
                          <td>dimitri</td>
                          <td>06/12/2015</td>
                        </tr>
                        <tr>
                          <td>
                            <img src={img2} alt="" />
                          </td>
                          <td>
                            <p>dimitri</p>
                          </td>
                          <td>
                            <p>IMMOBILIER</p>
                          </td>
                          <td>1</td>
                          <td>1000</td>
                          <td>dimitri</td>
                          <td>06/12/2015</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {open && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          className="customdialog"
        >
          <DialogContent>
            <DialogContentText
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              <p>voulez vous vraiment supprimer votre compte 🥲</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="optiondialog">
            <Button onClick={() => setOpen(false)} className="retour">
              Retour
            </Button>
            <Button className="accept">confirmer</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ProfilUser;
