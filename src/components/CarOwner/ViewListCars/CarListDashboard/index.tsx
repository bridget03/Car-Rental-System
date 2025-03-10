import {
  Pagination,
  PaginationArrow,
  PaginationEllipsis,
  PaginationEnd,
  PaginationItem,
} from "@/components/pagination/Pagination";
import { CarListDashboardProps } from "@/utils/types/Car";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { CarCard } from "../CarCard";
import styles from "./CarListDashboard.module.css";
import BreadCrumb from "@/components/breadcrumb";
import Link from "next/link";
import { scrollToTop } from "@/utils/utils";
import Modal from "@/components/Modals/Modal";
import Overlay from "@/components/Overlay/Overlay";

const CarListDashboard: React.FC<CarListDashboardProps> = ({
  initialCars,
  hasConfirm = false,
  mutate,
}) => {
  const router = useRouter();
  const { page, itemsPerPage: queryItemsPerPage } = router.query;

  const [sortOption, setSortOption] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(Number(page) || 1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    Number(queryItemsPerPage) || 10
  );
  const [pendingDeposits, setPendingDeposits] = useState<
    Record<string, boolean>
  >({});
  const [pendingPayments, setPendingPayments] = useState<
    Record<string, boolean>
  >({});

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  // Fetch toàn bộ booking data khi load trang
  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const response = await fetch(`/api/bookings/pending`);
        const pendingBookings = await response.json();

        const depositsMap = pendingBookings.reduce(
          (acc: Record<string, boolean>, booking: any) => {
            if (booking.status === "pendingDeposit") acc[booking.carId] = true;
            return acc;
          },
          {}
        );

        const paymentsMap = pendingBookings.reduce(
          (acc: Record<string, boolean>, booking: any) => {
            if (booking.status === "pendingPayment") acc[booking.carId] = true;
            return acc;
          },
          {}
        );

        setPendingDeposits(depositsMap);
        setPendingPayments(paymentsMap);
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      }
    };

    fetchPendingBookings();
  }, []);

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
      scrollToTop();
    }
    if (queryItemsPerPage) {
      setItemsPerPage(Number(queryItemsPerPage));
    }
  }, [page, queryItemsPerPage]);

  const handleConfirmAction = async (
    carId: string,
    actionType: "deposit" | "payment"
  ) => {
    setSelectedCarId(carId);
    if (actionType === "deposit") {
      setIsDepositModalOpen(true);
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const confirmAction = async (actionType: "deposit" | "payment") => {
    if (!selectedCarId) return;

    try {
      const response = await fetch(`/api/bookings/pending`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId: selectedCarId, actionType }),
      });

      if (response.ok) {
        if (actionType === "deposit") {
          setPendingDeposits((prev) => ({ ...prev, [selectedCarId]: false }));
          setIsDepositModalOpen(false);
        } else {
          setPendingPayments((prev) => ({ ...prev, [selectedCarId]: false }));
          setIsPaymentModalOpen(false);
        }
        mutate();
        alert(
          `${
            actionType === "deposit" ? "Deposit" : "Payment"
          } confirmed successfully!`
        );
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to confirm. Please try again.");
      }
    } catch (error) {
      console.error(`Error confirming ${actionType}:`, error);
      alert("An error occurred while confirming.");
    }
  };

  const confirmDeposit = () => confirmAction("deposit");
  const confirmPayment = () => confirmAction("payment");

  const sortCars = (cars: any, option: string) => {
    switch (option) {
      case "newest":
        return [...cars].sort((a, b) => b.productionYear - a.productionYear);
      case "oldest":
        return [...cars].sort((a, b) => a.productionYear - b.productionYear);
      case "price_high":
        return [...cars].sort((a, b) => {
          const priceA = parseInt(a.basePrice);
          const priceB = parseInt(b.basePrice);
          return priceB - priceA;
        });
      case "price_low":
        return [...cars].sort((a, b) => {
          const priceA = parseInt(a.basePrice);
          const priceB = parseInt(b.basePrice);
          return priceA - priceB;
        });
      default:
        return cars;
    }
  };

  const sortedCars = sortCars(initialCars, sortOption);
  const totalPages = Math.ceil(sortedCars.length / itemsPerPage);

  const indexOfLastCar = currentPage * itemsPerPage;
  const indexOfFirstCar = indexOfLastCar - itemsPerPage;
  const currentCars = sortedCars.slice(indexOfFirstCar, indexOfLastCar);

  const handleItemsPerPageChange = (newValue: number) => {
    const newPage = 1;
    router.push({
      query: {
        ...router.query,
        page: newPage,
        itemsPerPage: newValue,
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <BreadCrumb />

        <div className={styles.header}>
          <h1 className={styles.title}>List Cars</h1>
          <div className={styles.actions}>
            <select
              className={styles.select}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="newest">Latest → Newest</option>
              <option value="oldest">Newest → Latest</option>
              <option value="price_high">Price highest → Lowest</option>
              <option value="price_low">Price lowest → Highest</option>
            </select>
            <Link href={"add-car"} style={{ textDecoration: "none" }}>
              <button className={styles.button}>
                <IoMdAdd className={styles.buttonIcon} />
                Add A New Car
              </button>
            </Link>
          </div>
        </div>

        <div className={styles.grid}>
          {currentCars.map((car: any) => (
            <CarCard
              key={car.id}
              car={car}
              hasPendingDeposit={pendingDeposits[car.id]}
              onConfirmDeposit={() => handleConfirmAction(car.id, "deposit")}
              hasPendingPayment={pendingPayments[car.id]}
              onConfirmPayment={() => handleConfirmAction(car.id, "payment")}
            />
          ))}
        </div>

        <Pagination
          className={styles.pagination}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={sortedCars.length}
          currentPage={currentPage}
        >
          <PaginationEnd
            href={`?page=1&itemsPerPage=${itemsPerPage}`}
            isDisabled={currentPage === 1}
            position="start"
          />
          <PaginationArrow
            direction="left"
            href={`?page=${currentPage - 1}&itemsPerPage=${itemsPerPage}`}
            isDisabled={currentPage === 1}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <PaginationItem
                key={pageNum}
                href={`?page=${pageNum}&itemsPerPage=${itemsPerPage}`}
                isActive={currentPage === pageNum}
              >
                {pageNum}
              </PaginationItem>
            )
          )}

          {totalPages > 7 && currentPage < totalPages - 3 && (
            <>
              <PaginationEllipsis />
              <PaginationItem
                href={`?page=${totalPages}&itemsPerPage=${itemsPerPage}`}
              >
                {totalPages}
              </PaginationItem>
            </>
          )}

          <PaginationArrow
            direction="right"
            href={`?page=${currentPage + 1}&itemsPerPage=${itemsPerPage}`}
            isDisabled={currentPage === totalPages}
          />
          <PaginationEnd
            href={`?page=${totalPages}&itemsPerPage=${itemsPerPage}`}
            isDisabled={currentPage === totalPages}
            position="end"
          />
        </Pagination>

        {/* Deposit Modal */}
        <Overlay
          isOpen={isDepositModalOpen}
          handleCloseModal={() => setIsDepositModalOpen(false)}
        >
          <Modal
            type="confirm"
            title="Confirm Deposit"
            handleCloseModal={() => setIsDepositModalOpen(false)}
            onConfirm={confirmDeposit}
            confirmText="Yes"
            cancelText="Cancel"
          >
            <p>
              Please confirm that you have received the deposit for this
              booking.
              <br />
              This will allow the customer to pick-up the car at the agreed date
              and time.
            </p>
          </Modal>
        </Overlay>

        {/* Payment Modal */}
        <Overlay
          isOpen={isPaymentModalOpen}
          handleCloseModal={() => setIsPaymentModalOpen(false)}
        >
          <Modal
            type="confirm"
            title="Confirm Payment"
            handleCloseModal={() => setIsPaymentModalOpen(false)}
            onConfirm={confirmPayment}
            confirmText="Yes"
            cancelText="Cancel"
          >
            <p>
              Please confirm that you have receive the payment for this booking.
              <br />
              This will complete the booking process.
            </p>
          </Modal>
        </Overlay>
      </div>
    </div>
  );
};

export default CarListDashboard;
