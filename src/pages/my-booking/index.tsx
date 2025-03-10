import { BookingListItem } from "@/components/Bookings/BookingListItem";
import BreadCrumb from "@/components/breadcrumb";
import { Booking } from "@/utils/types/Booking";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import styles from "./styles.module.css";
import {
  Pagination,
  PaginationArrow,
  PaginationEllipsis,
  PaginationEnd,
  PaginationItem,
} from "@/components/pagination/Pagination";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};

const MyBookingsPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { page = "1", itemsPerPage: queryItemsPerPage = "10", sort = "newest" } = router.query;

  const [sortOption, setSortOption] = useState<string>(sort as string);
  const [currentPage, setCurrentPage] = useState<number>(Number(page));
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(queryItemsPerPage));
  const [isChanging, setIsChanging] = useState(false);

  const {
    data: bookings,
    error,
    isLoading,
    mutate,
  } = useSWR(
    session
      ? `/api/bookings?page=${currentPage}&itemsPerPage=${itemsPerPage}&sort=${sortOption}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    const newPage = Number(router.query.page);
    const newItemsPerPage = Number(router.query.itemsPerPage);
    const newSort = router.query.sort as string;

    if (!isNaN(newPage) && newPage > 0) {
      setCurrentPage(newPage);
    }
    if (!isNaN(newItemsPerPage) && newItemsPerPage > 0) {
      setItemsPerPage(newItemsPerPage);
    }
    if (newSort) {
      setSortOption(newSort);
    }
  }, [router.query]);

  const handleSortChange = async (newSort: string) => {
    setIsChanging(true);
    setSortOption(newSort);

    const oldData = bookings;
    try {
      await router.push(
        {
          query: { ...router.query, sort: newSort, page: 1 },
        },
        undefined,
        { shallow: true }
      );
      await mutate();
    } catch (error) {
      mutate(oldData, false);
    } finally {
      setIsChanging(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setIsChanging(true);
    setCurrentPage(newPage);

    const oldData = bookings;
    try {
      await router.push(
        {
          query: { ...router.query, page: newPage },
        },
        undefined,
        { shallow: true }
      );
      await mutate();
    } catch (error) {
      mutate(oldData, false);
    } finally {
      setIsChanging(false);
    }
  };

  const handleItemsPerPageChange = async (newItemsPerPage: number) => {
    setIsChanging(true);
    setItemsPerPage(newItemsPerPage);

    const oldData = bookings;
    try {
      await router.push(
        {
          query: { ...router.query, page: 1, itemsPerPage: newItemsPerPage },
        },
        undefined,
        { shallow: true }
      );
      await mutate();
    } catch (error) {
      mutate(oldData, false);
    } finally {
      setIsChanging(false);
    }
  };
  const updateBookingData = async (updatedBooking: any) => {
    console.log("update");
    await mutate();
  };
  return (
    <div>
      <main className={`${styles.container} ${isChanging ? styles.changing : ""}`}>
        <BreadCrumb />
        <h1>My Bookings</h1>
        <div className={styles.header}>
          <div>You have {bookings?.total || 0} bookings</div>
          <div className={styles.action}>
            <select
              className={styles.select}
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              disabled={isChanging}
            >
              <option value="newest">Latest → Newest</option>
              <option value="oldest">Newest → Latest</option>
              <option value="price_high">Price highest → Lowest</option>
              <option value="price_low">Price lowest → Highest</option>
            </select>
          </div>
        </div>

        <div className={styles.bookingsList}>
          {bookings?.data?.map((booking: Booking) => (
            <div
              key={booking.id}
              className={`${styles.bookingItem} ${isChanging ? styles.fadeOut : styles.fadeIn}`}
            >
              <BookingListItem
                updateBookingData={updateBookingData}
                booking={booking}
                car={booking.car}
                forPage="list"
              />
            </div>
          ))}
        </div>
        <div className={styles.footer}>
          <Pagination
            className={styles.pagination}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={bookings?.total || 0}
            currentPage={currentPage}
          >
            <PaginationEnd
              href={`?page=1&itemsPerPage=${itemsPerPage}&sort=${sortOption}`}
              isDisabled={currentPage === 1}
              position="start"
            />
            <PaginationArrow
              direction="left"
              href={`?page=${currentPage - 1}&itemsPerPage=${itemsPerPage}&sort=${sortOption}`}
              isDisabled={currentPage === 1}
            />

            {Array.from(
              { length: Math.ceil((bookings?.total || 0) / itemsPerPage) },
              (_, i) => i + 1
            ).map((pageNum) => (
              <PaginationItem
                key={pageNum}
                href={`?page=${pageNum}&itemsPerPage=${itemsPerPage}&sort=${sortOption}`}
                isActive={currentPage === pageNum}
              >
                {pageNum}
              </PaginationItem>
            ))}

            {Math.ceil((bookings?.total || 0) / itemsPerPage) > 7 &&
              currentPage < Math.ceil((bookings?.total || 0) / itemsPerPage) - 3 && (
                <>
                  <PaginationEllipsis />
                  <PaginationItem
                    href={`?page=${Math.ceil(
                      (bookings?.total || 0) / itemsPerPage
                    )}&itemsPerPage=${itemsPerPage}&sort=${sortOption}`}
                  >
                    {Math.ceil((bookings?.total || 0) / itemsPerPage)}
                  </PaginationItem>
                </>
              )}

            <PaginationArrow
              direction="right"
              href={`?page=${currentPage + 1}&itemsPerPage=${itemsPerPage}&sort=${sortOption}`}
              isDisabled={currentPage === Math.ceil((bookings?.total || 0) / itemsPerPage)}
            />
            <PaginationEnd
              href={`?page=${Math.ceil(
                (bookings?.total || 0) / itemsPerPage
              )}&itemsPerPage=${itemsPerPage}&sort=${sortOption}`}
              isDisabled={currentPage === Math.ceil((bookings?.total || 0) / itemsPerPage)}
              position="end"
            />
          </Pagination>
        </div>
      </main>
    </div>
  );
};

export default MyBookingsPage;
