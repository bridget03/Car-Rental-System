import { AuthProvider } from "@components/common/AuthContext";
import Header from "@components/header";
import Footer from "@components/footer";
import Overlay from "@/components/Overlay/Overlay";
import { useState } from "react";
import Login from "@/components/Login";
import { useRouter } from "next/router";

export default function Layout({ children }) {
    const router = useRouter();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <>
            <Header onLoginClick={() => setIsLoginModalOpen(true)} />
            <main>{children}</main>
            <Footer onLoginClick={() => setIsLoginModalOpen(true)} />

            <Overlay isOpen={isLoginModalOpen} handleCloseModal={() => setIsLoginModalOpen(false)}>
                <Login
                    onClose={() => setIsLoginModalOpen(false)}
                    // onForgotPwClick={() => {
                    //   // setIsLoginModalOpen(true);
                    //   router.push("/submit-email");
                    // }}
                />
            </Overlay>
        </>
    );
}
