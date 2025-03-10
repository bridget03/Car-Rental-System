import { CarCard } from "@/components/CarOwner/ViewListCars/CarCard";
import CarListDashboard from "@/components/CarOwner/ViewListCars/CarListDashboard";
import { CarBase } from "@/utils/types/Car";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import styles from "./styles.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CarListPage = () => {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const apiUrl = role === "carOwner" ? "/api/cars" : "/api/public/cars?limit=4";
  const { data: cars, error, mutate } = useSWR<CarBase[]>(apiUrl, fetcher);

  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!cars || cars.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1 && !visibleCards.includes(index)) {
              setVisibleCards((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [cars]);

  if (error) return <div>Error loading cars.</div>;
  if (!cars) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      {role === "carOwner" ? (
        <CarListDashboard initialCars={cars} 
        // hasConfirm = {}
        mutate={mutate}
        />
      ) : (
        <>
          {/* <BreadCrumb /> */}
          <h1 className={styles.heading}>
            <span>Latest</span> model
          </h1>
          <div className={styles.grid}>
            {cars.map((car, index) => (
              <div
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`${styles.card} ${visibleCards.includes(index) ? styles.active : ""}`}
              >
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CarListPage;
