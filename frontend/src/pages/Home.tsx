import { useEffect, useRef, useState } from "react";
import "../style/home.css";
import logo from "../assets/icone/market.png";
import noname from "../assets/icone/noname.png";
import inx from "../assets/icone/in.png";
import out from "../assets/icone/out.png";
import profil from "../assets/icone/profil.png";
import { Categories, defilement, Elements } from "../store/Frontbdd";
import banner from "../assets/icone/MarketMind-AI.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import {
  Autoplay,
  EffectCoverflow,
  Pagination,
  Navigation,
} from "swiper/modules";
import { Link } from "react-router-dom";
const Home = () => {
  const [AfficheProfil, setAfficheProfil] = useState<boolean>(false);
  const [Listreseach, setListreseach] = useState<boolean>(false);
  const refprofil = useRef<HTMLDivElement | null>(null);
  //disparition du profil de l'user lorsque l'on clique en dehors
  useEffect(() => {
    const dissapear = (e: MouseEvent) => {
      if (refprofil.current && !refprofil.current.contains(e.target as Node))
        setAfficheProfil(false);
    };
    document.addEventListener("mousedown", dissapear);
    return () => {
      document.removeEventListener("mousedown", dissapear);
    };
  }, []);

  return (
    <div className="HomeMain">
      <div className="HomeTitle">
        <div className="HomeLogo">
          <img src={logo} alt="" />
          <p>Plateforme SaaS d'achat et de vente</p>
        </div>
        <div className="HomeSearch">
          <input
            type="search"
            name=""
            id=""
            placeholder="recherche d'un produit ou autre... et appuyer sur Enter"
          />
        </div>
        <div className="HomeProfil" ref={refprofil}>
          <div
            className="HomeProfilName"
            onClick={() => setAfficheProfil((prev) => !prev)}
          >
            <img src={noname} alt="" />
            <p>dimitri</p>
          </div>
          {AfficheProfil && (
            <div className="HomeProfilDescription">
              <div className="HomeProfilDescriptionTitle">
                <img src={inx} alt="" />
                <p>Connexion</p>
              </div>
              <div className="HomeProfilDescriptionTitle">
                <img src={out} alt="" />
                <p>Déconnexion</p>
              </div>
              <Link to={"/profiluser"}>
                <div className="HomeProfilDescriptionTitle">
                  <img src={profil} alt="" />
                  <p>Profil</p>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="HomeCategory">
        {Categories.map((p) => (
          <Link to={p.link}>
            <div className="HomeCategoryCard" key={p.id}>
              <img src={p.photo} alt={p.name} />
              <p>{p.name}</p>
            </div>
          </Link>
        ))}
      </div>
      {Listreseach && (
        <div className="SearchElement">
          {Object.entries(Elements).map(([theme, children]) => (
            <div className="SearchElementCard">
              <p>{theme}</p>
              <div className="SearchElementCardElement">
                {children.map((p) => (
                  <div className="SearchElementCardElementCard" key={p.id}>
                    <img src={p.photo} alt={p.name} />
                    <p>{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* défilement des pages */}
      <div className="HomeSwiperContainer">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={3} // Exactement comme l'exemple
          spaceBetween={30} // IMPORTANT: ajoutez ceci
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 200, // Augmenté pour meilleur effet
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true} // Active les boutons de navigation
          speed={2000}
          modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
          className="homeSwiper"
        >
          {defilement.map((p) => (
            <SwiperSlide key={p.id}>
              <Link to={p.link}>
                <img src={p.photo} alt={`slide-${p.id}`} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="Footer">
        <div className="FooterImage">
          <img src={banner} alt="" />
        </div>
        <div className="HomeCategory">
          {Categories.map((p) => (
            <Link to={p.link}>
              <div className="HomeCategoryCard" key={p.id}>
                <img src={p.photo} alt={p.name} />
                <p>{p.name}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="copyright">
          <p>
            <Link to={"/service"} style={{ color: "white" }}>
              Nos services
            </Link>
          </p>
          <p>&copy; MarketMind-AI 2026 </p>
          <p>Dimitri Simo</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
