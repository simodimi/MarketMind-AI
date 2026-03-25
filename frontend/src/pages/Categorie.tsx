import { useEffect, useState } from "react";
import { Categories } from "../store/Frontbdd";
import "../style/home.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Siderbar from "../ui/Siderbar";
const Categorie = () => {
  const [search, setSearch] = useState<string>(Categories[0].name);
  const location = useLocation();
  const navigate = useNavigate();
  //disparition du profil de l'user lorsque l'on clique en dehors
  //gestion du lien de l'url
  useEffect(() => {
    if (
      location.pathname === "/categories/immobilier" ||
      location.pathname.startsWith("/categories/immobilier/")
    )
      setSearch(Categories[0].name);
    if (location.pathname === "/categories/auto") setSearch(Categories[1].name);
    if (location.pathname === "/categories/mode") setSearch(Categories[2].name);
    if (
      location.pathname === "/categories/electronique" ||
      location.pathname.startsWith("/categories/electronique/")
    )
      setSearch(Categories[3].name);
    if (location.pathname === "/categories/emploi")
      setSearch(Categories[4].name);
    if (location.pathname === "/categories/autre")
      setSearch(Categories[5].name);
  }, [location.pathname]);
  useEffect(() => {
    if (
      location.pathname === "/categories" ||
      location.pathname === "/categories/"
    ) {
      navigate("/categories/immobilier/", { replace: true });
    }
    if (location.pathname === "/categories/electronique") {
      navigate("/categories/electronique/ordinateur", { replace: true });
    }
  }, [location.pathname, navigate]);
  return (
    <div className="">
      <Siderbar />
      <div className="HomeCategory">
        {Categories.map((p) => (
          <Link to={p.link} key={p.id}>
            <div
              className={`HomeCategorySelect ${search === p.name ? "act" : ""}`}
              onClick={() => setSearch(p.name)}
            >
              <img src={p.photo} alt={p.name} />
              <p>{p.name}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="SelectionCategory">{<Outlet />}</div>
    </div>
  );
};

export default Categorie;
