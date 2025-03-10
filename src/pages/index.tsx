// import { CarDetailsPage } from "@/components/CarDetails/CarDetails";
// import { CarDetails } from "@/components/CarDetails/types";
import CarOwner from "@/components/CarOwner";
import { CarDetails } from "@/utils/types/Car";

import Discount from "@components/home/discount";
import HeroCustomer from "@components/home/hero/customer";
import HeroGuest from "@components/home/hero/guest";
import Location from "@components/home/location";
import WhyUs from "@components/home/whyus";

import FAQPage from "@/components/FAQ";
import TestimonialSlider from "@/components/TestimonialSlider/TestimonialSlider";
import { useSession } from "next-auth/react";
import { useState } from "react";

import Overlay from "@/components/Overlay/Overlay";
import Login from "@/components/Login";
import CarListPage from "./cars";

export default function Index() {
  const { data: session } = useSession();
  const loginState = session?.user ? true : false;
  const userRole = session?.user?.role || "guest";
  console.log(userRole);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <div
      style={{
        backgroundColor: "var(--background)",
      }}
    >
      <main>
        {loginState && userRole === "carOwner" && <CarOwner />}

        {loginState && userRole === "customer" && (
          <>
            <HeroCustomer />
            <WhyUs />
            <CarListPage />
            <Location />
            <TestimonialSlider />
            <FAQPage />
            <Discount />
          </>
        )}

        {!loginState && (
          <>
            <HeroGuest onLoginClick={() => setIsLoginModalOpen(true)} />
            <WhyUs />
            <CarListPage />
            <Location />
            <TestimonialSlider />

            <FAQPage />
            <Discount />
          </>
        )}
      </main>

      <Overlay
        isOpen={isLoginModalOpen}
        handleCloseModal={() => setIsLoginModalOpen(false)}
      >
        <Login
          onClose={() => setIsLoginModalOpen(false)}
          onForgotPwClick={() => setIsLoginModalOpen(true)}
        />
      </Overlay>
    </div>
  );
}
