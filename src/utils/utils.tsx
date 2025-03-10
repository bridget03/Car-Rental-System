export const scrollToTop = () => {
    setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 1);
};

export const getRentDuration = (
    start: { date: string | string[]; time: string | string[] },
    end: { date: string | string[]; time: string | string[] }
): string | number => {
    const pickup = new Date(start.date + "T" + start.time);
    const dropOff = new Date(end.date + "T" + end.time);

    const diffMs = dropOff.getTime() - pickup.getTime();

    // Convert to hours, minutes, days
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // Calculate components
    const days = Math.floor(totalHours / 24) + 1;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    return days;
};

export const getRentTotalPayment = (basePrice: string | number, days: number | string) => {
    basePrice = typeof basePrice === "string" ? parseInt(basePrice) : basePrice;
    days = typeof days === "string" ? parseInt(days) : days;
    return basePrice * days;
};
