import { useEffect, useState } from "react";
import { Categories } from "../store/Frontbdd";
import "../style/home.css";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Siderbar from "../ui/Siderbar";
const Categorie = () => {
  const [CategorieActive, setCategorieActive] = useState<string>();
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (
      location.pathname === "/categories" ||
      location.pathname.startsWith("/categories/immobilier")
    ) {
      setCategorieActive(Categories[0].name);
    }
    if (location.pathname === "/categories/auto") {
      setCategorieActive(Categories[1].name);
    }
    if (location.pathname === "/categories/mode") {
      setCategorieActive(Categories[2].name);
    }
    if (location.pathname === "/categories/electronique") {
      setCategorieActive(Categories[3].name);
    }
    if (location.pathname === "/categories/emploi") {
      setCategorieActive(Categories[4].name);
    }
    if (location.pathname === "/categories/autre") {
      setCategorieActive(Categories[5].name);
    }
  });
  useEffect(() => {
    if (!type) {
      // On redirige vers la première catégorie de la liste
      navigate(Categories[0].link, { replace: true });
    }
  }, [type]);
  return (
    <div className="">
      <Siderbar />
      <div className="HomeCategory">
        {Categories.map((p) => {
          const catSlug = p.name.toLowerCase();
          return (
            <Link to={`/categories/${catSlug}`} key={p.id}>
              <div
                className={`HomeCategorySelect ${
                  CategorieActive === p.name ? "act" : ""
                }`}
                onClick={() => setCategorieActive(p.name)}
              >
                <img src={p.photo} alt={p.name} />
                <p>{p.name}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="SelectionCategory">{<Outlet />}</div>
    </div>
  );
};

export default Categorie;
