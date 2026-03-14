import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Service from "./pages/Service";
import Paiement from "./pages/Paiement";
import Categorie from "./pages/Categorie";
import Auto from "./pages/Auto";
import Autre from "./pages/Autre";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/*" element={<Categorie />}>
          {/*<Route index element={<Immobilier />} />autre méthode*/}
          <Route path="auto" element={<Auto />} />
          <Route path="autre" element={<Autre />} />
          <Route path="emploi" element={<Emploi />} />
          <Route path="electronique" element={<Electronique />} />
          <Route path="immobilier" element={<Immobilier />}>
            <Route index element={<Maison />} />
            <Route path="maison" element={<Maison />} />
            <Route path="appartement" element={<Appartement />} />
            <Route path="terrain" element={<Terrain />} />
            <Route path="bureau" element={<Bureau />} />
            <Route path="autre" element={<Autres />} />
            <Route path="describe/:nom" element={<DescribeImmobilier />} />
          </Route>
          <Route path="mode" element={<Mode />} />
        </Route>
        <Route path="/service" element={<Service />} />
        <Route path="/paiement" element={<Paiement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
