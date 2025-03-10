export const formatPhoneForBackend = (phone: string): string => {
    if (phone[0] == "+") {
        return phone;
    } else {
        return `+${phone}`;
    }
};

export const formatPhoneForFrontend = (phone: string): string => {
    if (phone[0] == "+") {
        return phone.slice(1);
    } else {
        return phone;
    }
};
