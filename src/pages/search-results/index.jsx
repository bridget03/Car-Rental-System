import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import BreadCrumb from "@/components/breadcrumb";

import Link from "next/link";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { AiOutlineStar } from "react-icons/ai";
import { FaListUl } from "react-icons/fa";
import { FaThLarge } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

const validateDateTime = (values) => {
  const errors = {};
  const { sD, sT, eD, eT } = values;

  if (!sD || !sT) {
    errors.sD = "Pick-up Date and Time are required!";
  } else {
    const pickUpDateTime = new Date(`${sD}T${sT}`);
    if (pickUpDateTime < new Date()) {
      errors.sD = "Pick-up Date and Time must be in the future!";
    }
  }

  if (!eD || !eT) {
    errors.eD = "Drop-off Date and Time are required!";
  } else {
    const pickUpDateTime = new Date(`${sD}T${sT}`);
    const dropOffDateTime = new Date(`${eD}T${eT}`);

    if (dropOffDateTime <= pickUpDateTime) {
      errors.eD = "Drop-off Date and Time must be after Pick-up Date and Time!";
    }
  }

  return errors;
};

const SearchResults = () => {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [sortBy, setSortBy] = useState("priceLow");

  const [viewMode, setViewMode] = useState("list");

  const searchFilters = router.query;
  useEffect(() => {
    console.log("Received searchFilters:", searchFilters);

    fetch("/api/cars")
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
      })
      .catch((err) => console.error("Failed to fetch cars", err));
  }, []);

  useEffect(() => {
    if (!cars.length) return;

    setFilteredCars(
      cars.filter((car) => {
        const matchesBrand = searchFilters.carBrand
          ? car.brand
              ?.toLowerCase()
              .includes(searchFilters.carBrand.toLowerCase())
          : true;

        const matchesLocation = searchFilters.location
          ? car.location
              ?.toLowerCase()
              .includes(searchFilters.location.toLowerCase())
          : true;

        return matchesBrand && matchesLocation;
      })
    );
  }, [cars, searchFilters]);

  const handleSearch = (values) => {
    router.push({
      pathname: "/search-results",
      query: values,
    });
  };

  useEffect(() => {
    if (!filteredCars.length) return;

    setFilteredCars((prevCars) => {
      return [...prevCars].sort((a, b) => {
        switch (sortBy) {
          case "nameAsc":
            return a.name.localeCompare(b.name);
          case "nameDesc":
            return b.name.localeCompare(a.name);
          case "priceLow":
            return (
              Number(a.basePrice.replace(/\./g, "")) -
              Number(b.basePrice.replace(/\./g, ""))
            );
          case "priceHigh":
            return (
              Number(b.basePrice.replace(/\./g, "")) -
              Number(a.basePrice.replace(/\./g, ""))
            );
          case "ratings":
            return b.ratings - a.ratings;
          default:
            return 0;
        }
      });
    });
  }, [sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className={styles.searchPage}>
      <BreadCrumb />
      <Formik
        initialValues={{
          carBrand: searchFilters.carBrand || "",
          location: searchFilters.location || "",
          sD: searchFilters.sD || "",
          sT: searchFilters.sT || "",
          eD: searchFilters.eD || "",
          eT: searchFilters.eT || "",
        }}
        validationSchema={Yup.object({
          carBrand: Yup.string().required("Please provide a car brand!"),
          location: Yup.string().required("Please provide a pick-up location!"),
        })}
        validate={validateDateTime}
        onSubmit={(values) => {
          handleSearch(values);
        }}
      >
        {() => (
          <Form className={styles.searchForm}>
            <div className={styles.formGroup}>
              <label htmlFor="carBrand" className={styles.label}>
                CAR BRAND
              </label>
              <Field
                type="text"
                className={styles.input}
                id="carBrand"
                name="carBrand"
                placeholder="Enter car brand you want to rent ..."
              />
              <ErrorMessage
                name="carBrand"
                component="span"
                className={styles.error}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="pickUpLocation" className={styles.label}>
                PICK-UP LOCATION
              </label>
              <Field
                type="text"
                className={styles.input}
                id="pickUpLocation"
                name="location"
                placeholder="Enter car location ..."
              />
              <ErrorMessage
                name="location"
                component="span"
                className={styles.error}
              />
            </div>

            <div className={styles.flexRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>PICK-UP DATE AND TIME</label>
                <div className={styles.flexRow}>
                  <Field
                    type="date"
                    className={styles.input}
                    id="pickUpDate"
                    name="sD"
                  />
                  <Field
                    type="time"
                    className={styles.input}
                    id="pickUpTime"
                    name="sT"
                  />
                </div>
                <ErrorMessage
                  name="sD"
                  component="span"
                  className={styles.error}
                />
                <ErrorMessage
                  name="sT"
                  component="span"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>DROP-OFF DATE AND TIME</label>
                <div className={styles.flexRow}>
                  <Field
                    type="date"
                    className={styles.input}
                    id="dropOffDate"
                    name="eD"
                  />
                  <Field
                    type="time"
                    className={styles.input}
                    id="dropOffTime"
                    name="eT"
                  />
                </div>
                <ErrorMessage
                  name="eD"
                  component="span"
                  className={styles.error}
                />
                <ErrorMessage
                  name="eT"
                  component="span"
                  className={styles.error}
                />
              </div>
            </div>

            <div className={styles.buttonWrapper}>
              <button type="submit" className={styles.button}>
                SEARCH
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <h2>Search Results</h2>
      <div className={styles.searchContainer}>
        <div className={styles.searchInfo}>
          {filteredCars.length === 1 ? (
            <p>There is 1 car available for you</p>
          ) : filteredCars.length > 1 ? (
            <p>There are {filteredCars.length} cars available for you</p>
          ) : (
            <p>No car available for you</p>
          )}
        </div>

        <div className={styles.viewModeToggle}>
          <button
            className={viewMode === "list" ? styles.activeButton : ""}
            onClick={() => setViewMode("list")}
          >
            <FaThLarge />
          </button>
          <button
            className={viewMode === "table" ? styles.activeButton : ""}
            onClick={() => setViewMode("table")}
          >
            <FaListUl />
          </button>
          <div className={styles.sortContainer}>
            <label htmlFor="sortSelect">Sort by: </label>
            <select
              id="sortSelect"
              className={styles.sortSelect}
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="nameAsc">Name (A → Z)</option>
              <option value="nameDesc">Name (Z → A)</option>
              <option value="priceLow">Price (Low → High)</option>
              <option value="priceHigh">Price (High → Low)</option>
              <option value="ratings">Ratings (High → Low)</option>
            </select>
          </div>
        </div>
      </div>
      {viewMode === "list" ? (
        <div className={styles.carList}>
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div key={car.name} className={styles.carCard}>
                <div className={styles.imageSlider}>
                  <Image
                    src={car.images.front}
                    width={300}
                    height={200}
                    alt={`${car.name} - Front View`}
                    className={styles.carImage}
                  />
                </div>

                <div className={styles.carInfo}>
                  <h3>{car.name}</h3>
                  <p className={styles.location}>
                    <span>Location:</span> {car.location}
                  </p>
                  <p
                    className={`${styles.status} ${
                      car.status === "Available"
                        ? styles.statusAvailable
                        : car.status === "Booked"
                        ? styles.statusBooked
                        : styles.statusStopped
                    }`}
                  >
                    <span>Status:</span> {car.status}
                  </p>
                  <p className={styles.price}>
                    <span>type of Price: </span> {car.basePrice} VND/day
                  </p>
                  <p>
                    <span>Deposit:</span> {car.deposit} VND
                  </p>
                  <p className={styles.ratings}>
                    {car.ratings} <FaStar style={{ color: "#ffa600de" }} /> |{" "}
                    {car.rides} rides
                  </p>

                  <div className={styles.buttonGroup}>
                    <Link
                      href={`/book-car/?carId=${car.id}&sD=${searchFilters.sD}&sT=${searchFilters.sT}&eD=${searchFilters.eD}&eT=${searchFilters.eT}`}
                      className={`${styles.button} ${styles.rentButton}`}
                    >
                      Rent Now
                    </Link>
                    <Link
                      href={`/cars/${car.id}`}
                      className={`${styles.button} ${styles.viewButton}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noResults}>No cars found.</p>
          )}
        </div>
      ) : (
        <table className={styles.carTable}>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Image</th>
              <th>Ratings</th>
              <th>No of Rides</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car, index) => (
              <tr key={car.name}>
                <td>{index + 1}</td>
                <td>{car.name}</td>
                <td>
                  <Image
                    src={car.images.front || "/default-car.jpg"}
                    width={100}
                    height={60}
                    alt={car.name}
                  />
                </td>
                <td>{car.ratings}/5</td>
                <td>{car.rides}</td>
                <td>{car.basePrice} VND/day</td>
                <td>{car.location}</td>
                <td>{car.status}</td>
                <td className={styles.tableButton}>
                  <Link
                    href={`/book-car/?carId=${car.id}&sD=${searchFilters.sD}&sT=${searchFilters.sT}&eD=${searchFilters.eD}&eT=${searchFilters.eT}`}
                    className={`${styles.button} ${styles.rentButton}`}
                  >
                    Rent Now
                  </Link>
                  <Link
                    href={`/cars/${car.id}`}
                    className={`${styles.button} ${styles.viewButton}`}
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchResults;
