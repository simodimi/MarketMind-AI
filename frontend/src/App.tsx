import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Service from "./pages/Service";
import Paiement from "./pages/Paiement";
import Categorie from "./pages/Categorie";
import Like from "./pages/Like";
import { useState } from "react";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import ForgetPassword from "./pages/ForgetPassword";
import ProfilUser from "./pages/ProfilUser";
import Notification from "./ui/Notification";
import CategoriesGeneriques from "./pages/CategoriesGeneriques";
import SubCategories from "./components/SubCategories";
import DescribeCategories from "./components/DescribeCategories";

export interface LikingEvent {
  id: number;
  nom: string;
  photo: string | null;
  link: string;
  categories: string;
}
function App() {
  const [likingEvent, setlikingEvent] = useState<LikingEvent[] | null>(null);
  const [steppersms, setsteppersms] = useState<boolean>(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/motdepasseoublie" element={<ForgetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categorie />}>
          <Route path=":type" element={<CategoriesGeneriques />}>
            <Route
              path=":subtype"
              element={<SubCategories setlikingEvent={setlikingEvent} />}
            />
          </Route>
        </Route>
        <Route
          path="/categories/:type/:subtype/:describe"
          element={<DescribeCategories setsteppersms={setsteppersms} />}
        />
        <Route path="/service" element={<Service />} />
        <Route
          path="/like"
          element={
            <Like likingEvent={likingEvent} setlikingEvent={setlikingEvent} />
          }
        />
        <Route path="/paiement" element={<Paiement />} />
        <Route
          path="/profiluser"
          element={
            <ProfilUser steppersms={steppersms} setsteppersms={setsteppersms} />
          }
        />
      </Routes>
      <Notification />
    </BrowserRouter>
  );
}

export default App;
