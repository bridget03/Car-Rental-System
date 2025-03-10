import { useRouter } from "next/router";
import React from "react";
import styles from "./index.module.css";
import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";

const customBreadcrumbs: { [key: string]: string } = {
  cars: "Cars",
  "cars/[id]": "Car Detail",
  "my-booking": "My Bookings",
  "my-booking/[id]": "Booking Detail",
};

const BreadCrumb = () => {
  const router = useRouter();
  const pathArray = router.pathname.split("/").filter(Boolean);
  const currentPathArray = router.asPath.split("/").filter(Boolean);

  let accumulatedPath = "";

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      {[
        { name: "Home", path: "/" },
        ...pathArray.map((segment, index) => {
          accumulatedPath += `/${currentPathArray[index] || segment}`;

          let key = pathArray.slice(0, index + 1).join("/");
          let displayName =
            customBreadcrumbs[key] ||
            decodeURIComponent(segment).replace(/-/g, " ");

          if (segment === "view-list-car-owner" && pathArray[index + 1]) {
            displayName = "Car Detail";
          }
          if (segment === "bookings" && pathArray[index + 1]) {
            displayName = "Booking Detail";
          }
          return {
            name: displayName,
            path: accumulatedPath,
          };
        }),
      ].map((crumb, index, array) => (
        <span key={crumb.path} className={styles.breadcrumbItem}>
          {index > 0 && <IoChevronForwardOutline />}
          {index === array.length - 1 ? (
            <span className={styles.currentPage}>{crumb.name}</span>
          ) : (
            <Link href={crumb.path} className={styles.breadcrumbLink}>
              {crumb.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
};

export default BreadCrumb;
