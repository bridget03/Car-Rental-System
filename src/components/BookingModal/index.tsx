import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useSWR from "swr";
import styles from "./styles.module.css";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  car: { id: string; name: string };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  car,
}) => {
  if (!isOpen) return null;

  const router = useRouter();
  const { data: bookings } = useSWR(
    car.id ? `/api/bookings?carId=${car.id}` : null,
    fetcher
  );

  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  useEffect(() => {
    if (!bookings || !Array.isArray(bookings.bookedDates)) return;

    const bookedDays: Date[] = [];

    bookings.bookedDates.forEach((booking: any) => {
      const start = parseISO(booking.pickupDate);
      const end = parseISO(booking.dropOffDate);

      let current = start;
      while (current <= end) {
        bookedDays.push(new Date(current));
        current = addDays(current, 1);
      }
    });

    setDisabledDates(bookedDays);
  }, [bookings]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Book {car.name}</h2>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedRange.start || !selectedRange.end) return;

            onSubmit(selectedRange);
            router.push(
              `/book-car/?carId=${car.id}&sD=${format(
                selectedRange.start,
                "yyyy-MM-dd"
              )}&sT=${format(selectedRange.start, "HH:mm")}&eD=${format(
                selectedRange.end,
                "yyyy-MM-dd"
              )}&eT=${format(selectedRange.end, "HH:mm")}`
            );
          }}
        >
          <div className={styles.formGroup}>
            <label>Select Date Range</label>
            <DatePicker
              selected={selectedRange.start}
              onChange={(date) => setSelectedRange({ start: date, end: null })}
              selectsStart
              startDate={selectedRange.start}
              endDate={selectedRange.end}
              minDate={new Date()}
              showTimeSelect
              excludeDates={disabledDates}
              className={styles.input}
              placeholderText="Select pickup date"
            />
          </div>

          {selectedRange.start && (
            <div className={styles.formGroup}>
              <label>End Date</label>
              <DatePicker
                selected={selectedRange.end}
                onChange={(date) =>
                  setSelectedRange((prev) => ({ ...prev, end: date }))
                }
                selectsEnd
                startDate={selectedRange.start}
                endDate={selectedRange.end}
                minDate={selectedRange.start}
                excludeDates={disabledDates.filter((date) =>
                  isWithinInterval(date, {
                    start: selectedRange.start!,
                    end: addDays(selectedRange.start!, 30),
                  })
                )}
                showTimeSelect
                className={styles.input}
                placeholderText="Select drop-off date"
              />
            </div>
          )}

          <div className={styles.buttonWrapper}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.confirmBtn}
              disabled={!selectedRange.start || !selectedRange.end}
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
