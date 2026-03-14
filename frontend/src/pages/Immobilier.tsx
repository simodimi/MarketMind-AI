import { Link, Outlet } from "react-router-dom";
import { Elements } from "../store/Frontbdd";
import "../style/category.css";
import { useState } from "react";
const Immobilier = () => {
  const [CategorieActive, setCategorieActive] = useState<string>(
    Elements.Immobilier[0].name,
  );
  return (
    <div className="ImmobilierMain">
      <div className="ImmobilierMainItem">
        {Elements.Immobilier.map((p) => (
          <Link to={p.link} key={p.id}>
            <div
              className={`ImmobilierMainItemElement ${CategorieActive === p.name ? "active" : ""}`}
              onClick={() => setCategorieActive(p.name)}
            >
              <img src={p.photo} alt="" />
              <p>{p.name}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="ImmobilierMainPhoto">{<Outlet />}</div>
    </div>
  );
};

export default Immobilier;
