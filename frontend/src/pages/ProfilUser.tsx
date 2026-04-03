import React, { useEffect, useState } from "react";
import logo from "../assets/icone/market.png";
import { Link } from "react-router-dom";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const COLORS: string[] = ["#0088FE", "#00C49F", "#FFBB28"];
  const [timeWord, settimeWord] = useState("");
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
  if (isLoading) {
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
              {/* Sidebar items... */}
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
  }

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
                  <Button>Ajouter un produit + </Button>
                </div>
                <div className="dashboardStepperPublication">
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
                          Ajouter des photos du produit, 5 maximum et minimun 1{" "}
                          <span>*</span> :
                        </p>
                        <p>La photo principale sera la photo de couverture :</p>
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
                          neque aliquam ad, recusandae fugit ratione voluptatum
                          tempora itaque ut. Quidem deleniti sed corporis fugiat
                          et repudiandae.Lorem ipsum dolor sit amet, consectetur
                          adipisicing elit. Iste, accusamus mollitia! Voluptatem
                          impedit neque aliquam ad, recusandae fugit ratione
                          voluptatum tempora itaque ut. Quidem deleniti sed
                          corporis fugiat et repudiandae.Lorem ipsum dolor sit
                          amet, consectetur adipisicing elit. Iste, accusamus
                          mollitia! Voluptatem impedit neque aliquam ad,
                          recusandae fugit ratione voluptatum tempora itaque ut.
                          Quidem deleniti sed corporis fugiat et
                          repudiandae.Lorem ipsum dolor sit amet, consectetur
                          adipisicing elit. Iste, accusamus mollitia! Voluptatem
                          impedit neque aliquam ad, recusandae fugit ratione
                          voluptatum tempora itaque ut. Quidem deleniti sed
                          corporis fugiat et repudiandae.
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
                          Sélectionner une catégorie de produit <span>*</span> :
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
                            Lorem ipsum dolor sit amet, consectetur adipisicings
                          </textarea>
                        </div>
                      </div>
                      <div className="btnaddProduct">
                        <Button className="accept">Publier le produit</Button>
                      </div>
                    </form>
                  </div>
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
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="SettingItem">
                    <p>dimitri, voulez vous vraiment vous déconnecter ?</p>
                    <div className="Settingbtn">
                      <Button className="decline">oui</Button>
                      <Button>non</Button>
                    </div>
                  </div>
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Changer de mot de passe</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="SettingItem">
                    <p>Dimitri, Vous voulez changer vos mots de passe?</p>
                    <div className="SettingInput">
                      <form action="">
                        <div className="">
                          <p>Mot de passe actuel</p>
                          <input type="text" name="" id="" />
                        </div>
                        <div className="">
                          <p>Nouveau mot de passe</p>
                          <input type="text" name="" id="" />
                        </div>
                        <div className="formbtn">
                          <Button className="accept">Sauvegarder</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Changer photo de profil</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="SettingItem">
                    <p>Dimitri, Vous voulez changer votre photo de profil?</p>
                    <div className="SettingInput">
                      <form action="">
                        <div className="PictureHeader">
                          <img src={img2} alt="" />
                          <div className="PictureAdd">
                            <img src={pen} alt="" />
                            <input
                              type="file"
                              name=""
                              id=""
                              style={{ display: "none" }}
                            />
                          </div>
                        </div>
                        <p style={{ textAlign: "center", padding: "10px 0" }}>
                          Vous pouvez choisir un des avatars ci-dessous :
                        </p>
                        <div className="avatarsPictureItem">
                          {avatar.map((p) => (
                            <div className="avatarsPicture" key={p.id}>
                              <img src={p.photo} alt="" />
                            </div>
                          ))}
                        </div>

                        <div className="formbtn">
                          <Button className="accept">Sauvegarder</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Supprimer le compte</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="SettingItem">
                    <p>
                      dimitri, voulez vous vraiment supprimer votre compte ?
                    </p>
                    <div className="Settingbtn">
                      <Button className="decline">oui</Button>
                      <Button>non</Button>
                    </div>
                  </div>
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>Changer police des messages</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="SettingItem">
                    <p>
                      Selectionner une police de votre choix pour vos Messages
                    </p>
                    <p>Hello dimitri, phrase test.</p>

                    <div className="SettingPolice">
                      <form action="">
                        <div className="SettingPoliceForm">
                          {styles.map((p) => (
                            <div className="SettingPoliceItem" key={p.id}>
                              <p>{p.police}</p>
                            </div>
                          ))}
                        </div>
                        <div className="formbtn">
                          <Button className="accept">Sauvegarder</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="Setting">
                  <div className="SettingHeader">
                    <p>informations sur le compte</p>
                    <div className="">
                      <img src={up} alt="" />
                      <img src={down} alt="" />
                    </div>
                  </div>
                  <div className="SettingItem">
                    <p>Nom : DIMITRI SIMO</p>
                    <p>Email : simodimitri08@gmail.com</p>
                    <p>Date d'adhésion : 11/05/2024</p>
                    <p>Statut : vendeur profil certifié ⭐⭐⭐ </p>
                  </div>
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
    </div>
  );
};

export default ProfilUser;
