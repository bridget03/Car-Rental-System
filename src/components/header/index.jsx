import { ToastContext } from "@/components/Toast/ToastContextProvider";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import Modal from "../Modals/Modal";
import Overlay from "../Overlay/Overlay";
import styles from "./styles.module.css";
import classNames from "classnames";

import useScrollHandling from "@hooks/useScrollHandling";

export default function Header({ onLoginClick }) {
  const { createToast } = useContext(ToastContext);

  const { data: session } = useSession();
  const loginState = session?.user ? true : false;
  const userRole = session?.user.role;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const { scrollPosition } = useScrollHandling();

  const [fixedPosition, setFixedPosition] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await signOut({ redirect: false });
      createToast({
        type: "success",
        title: "Success",
        message: "Log out successfully",
      });
      router.push("/");
    } catch (error) {
      alert("Error log out");
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    {
      scrollPosition > 83 ? setFixedPosition(true) : setFixedPosition(false);
    }
  }, [scrollPosition]);

  return (
    <>
      <header
        id="header"
        className={classNames(styles.header, styles.topHeader, {
          [styles.fixedHeader]: fixedPosition,
        })}
      >
        <div className={styles.headerContainer}>
          <h1>
            <Link href="/" className={styles.logo}>
              <div>
                <div className={`${styles.logoContainer} ${styles.logoLight}`}>
                  <Image
                    src={"/logo-color-light.svg"}
                    width={50}
                    height={50}
                    alt="Page Logo"
                  ></Image>
                </div>
                <div className={`${styles.logoContainer} ${styles.logoDark}`}>
                  <Image
                    src={"/logo-color-dark.svg"}
                    width={50}
                    height={50}
                    alt="Page Logo"
                  ></Image>
                </div>
              </div>
              <span className={styles.logoText}>Rent a car today!</span>
            </Link>
          </h1>

          <nav className={styles.navbar}>
            {!loginState ? (
              <ul className={styles.navList}>
                <li>
                  <Link href="/about-us" className={styles.navLink}>
                    ABOUT US
                  </Link>
                </li>
                <li>
                  <button className={styles.navButton} onClick={onLoginClick}>
                    SIGN UP
                  </button>
                </li>
                <li>
                  <button className={styles.navButton} onClick={onLoginClick}>
                    LOG IN
                  </button>
                </li>
              </ul>
            ) : (
              <ul className={styles.navList}>
                <li>
                  <Link href="/about-us" className={styles.navLink}>
                    ABOUT US
                  </Link>
                </li>
                <li className={styles.dropdownContainer} ref={dropdownRef}>
                  <button
                    className={styles.navButton}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {userRole === "customer" ? (
                      <p>Hi {session?.user.name}</p>
                    ) : (
                      <p>Hi {session?.user.name}</p>
                    )}
                  </button>
                  {dropdownOpen && (
                    <ul className={styles.dropdownMenu}>
                      <li>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => router.push("/edit-profile")}
                        >
                          My Profile
                        </button>
                      </li>
                      <li>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => router.push("/my-booking")}
                        >
                          My Bookings
                        </button>
                      </li>
                      <li>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => router.push("/my-wallet")}
                        >
                          My Wallet
                        </button>
                      </li>
                      <li>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => setIsModalOpen(true)}
                        >
                          Log Out
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </nav>
        </div>
      </header>
      <Overlay isOpen={isModalOpen} handleCloseModal={handleCloseModal}>
        <Modal
          title="Log out"
          type="confirm"
          cancelText="Cancel"
          confirmText="OK"
          handleCloseModal={handleCloseModal}
          onConfirm={handleLogout}
        >
          Are you sure you want to log out
        </Modal>
      </Overlay>
    </>
  );
}
