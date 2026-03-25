import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Service from "./pages/Service";
import Paiement from "./pages/Paiement";
import Categorie from "./pages/Categorie";
import Auto from "./pages/Auto";
import Emploi from "./pages/Emploi";
import Electronique from "./pages/Electronique";
import Immobilier from "./pages/Immobilier";
import Mode from "./pages/Mode";
import Maison from "./components/Immobilier/Maison";
import Appartement from "./components/Immobilier/Appartement";
import Terrain from "./components/Immobilier/Terrain";
import Bureau from "./components/Immobilier/Bureau";
import Autres from "./components/Immobilier/Autres";
import DescribeImmobilier from "./components/Immobilier/DescribeImmobilier";
import Like from "./pages/Like";
import { useState } from "react";
import Ordinateur from "./components/Electronique/Ordinateur";
import Telephone from "./components/Electronique/Telephone";
import Froid from "./components/Electronique/Froid";
import AutresEl from "./components/Electronique/AutresEl";
import Autre from "./pages/Autre";
import DescribeElectronique from "./components/Electronique/DescribeElectronique";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import ForgetPassword from "./pages/ForgetPassword";

export interface LikingEvent {
  id: number;
  nom: string;
  photo: string;
  link: string;
}
function App() {
  const [likingEvent, setlikingEvent] = useState<LikingEvent[] | null>(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/motdepasseoublie" element={<ForgetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/categories/*" element={<Categorie />}>
          {/*<Route index element={<Immobilier />} />autre méthode*/}
          <Route path="auto" element={<Auto />} />
          <Route path="autre" element={<Autre />} />
          <Route path="emploi" element={<Emploi />} />
          <Route path="electronique" element={<Electronique />}>
            <Route index element={<Electronique />} />
            <Route
              path="ordinateur"
              element={<Ordinateur setlikingEvent={setlikingEvent} />}
            />
            <Route path="telephone" element={<Telephone />} />
            <Route path="froid" element={<Froid />} />
            <Route path="autre" element={<AutresEl />} />
            <Route path="describe/:nom" element={<DescribeElectronique />} />
          </Route>
          <Route path="immobilier" element={<Immobilier />}>
            <Route index element={<Maison setlikingEvent={setlikingEvent} />} />
            <Route
              path="maison"
              element={<Maison setlikingEvent={setlikingEvent} />}
            />
            <Route path="appartement" element={<Appartement />} />
            <Route path="terrain" element={<Terrain />} />
            <Route path="bureau" element={<Bureau />} />
            <Route path="autre" element={<Autres />} />
            <Route path="describe/:nom" element={<DescribeImmobilier />} />
          </Route>
          <Route path="mode" element={<Mode />} />
        </Route>
        <Route path="/service" element={<Service />} />
        <Route
          path="/like"
          element={
            <Like likingEvent={likingEvent} setlikingEvent={setlikingEvent} />
          }
        />
        <Route path="/paiement" element={<Paiement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
