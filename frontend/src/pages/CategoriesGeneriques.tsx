import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Elements } from "../store/Frontbdd";
import { useEffect, useState } from "react";
const CategoriesGeneriques = () => {
  const { type, subtype } = useParams();
  const navigate = useNavigate();
  const [CategorieActive, setCategorieActive] = useState<string>();
  if (!type) return;
  // type as keyof typeof Elements:liste des cles possibles de elements
  const data = Elements[type as keyof typeof Elements];
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === `/categories/${type}/${subtype}`) {
      //si l'item existe on accède à la propriété name
      setCategorieActive(data.find((item) => item.link === subtype)?.name);
    }
  });
  useEffect(() => {
    // Si pas de sous-catégorie dans l'URL, on redirige vers la première sous-catégorie de la catégorie
    if (!subtype && data.length > 0) {
      navigate(`/categories/${type}/${data[0].link}`, { replace: true });
      setCategorieActive(data[0].name);
    }
  }, [type, subtype]);
  return (
    <div className="ImmobilierMain">
      <div className="ImmobilierMainItem">
        {data.map((item) => (
          <Link key={item.id} to={`/categories/${type}/${item.link}`}>
            <div
              className={`ImmobilierMainItemElement ${CategorieActive === item.name ? "active" : ""}`}
              onClick={() => setCategorieActive(item.name)}
            >
              <img src={item.photo} alt={item.name} />
              <p>{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="ImmobilierMainPhoto">
        <Outlet />
      </div>
    </div>
  );
};

export default CategoriesGeneriques;
