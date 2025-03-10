import { ToastContextType, ToastType } from "@/utils/types/Car";
import { useEffect, useState } from "react";
import { createContext } from "react";

export const ToastContext = createContext<ToastContextType | null>(null);

export default function ToastContextProvider({
  children,
  defaultDuration,
}: {
  children: React.ReactNode;
  defaultDuration?: number;
}) {
  const [toast, setToast] = useState<ToastType[]>([]);
  const [doneCount, setDoneCount] = useState<number>(0);

  defaultDuration = defaultDuration || 5000;

  const createToast = ({
    type,
    title,
    message,
    duration = defaultDuration,
  }: ToastType) => {
    const newToast = {
      type: type,
      title: title,
      message: message,
      duration: duration,
      doneAt: new Date().getTime() + duration,
    };
    setToast(toast.concat(newToast));
  };
  const addDoneCount = () => {
    setDoneCount((prev) => prev + 1);
  };

  useEffect(() => {
    //clear toast list after every toast is completed
    if (toast.length > 0 && doneCount > 0 && doneCount >= toast.length) {
      setDoneCount(0);
      setToast([]);
    }
  }, [doneCount]);

  return (
    <ToastContext.Provider value={{ toast, createToast, addDoneCount }}>
      {children}
    </ToastContext.Provider>
  );
}
