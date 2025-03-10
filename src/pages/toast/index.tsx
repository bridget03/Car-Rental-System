// import hết 3 cái này vào
import { ToastContext } from "@/components/Toast/ToastContextProvider";
import { ToastContextType } from "@/components/Toast/type";
import { useContext } from "react";

export default function Page() {
    // lấy ra hàm createToast từ ToastContext
    const { createToast } = useContext(ToastContext) as ToastContextType;
    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
            }}
        >
            <h1>Toast Component</h1>
            <br />

            {/* Xong rồi dùng như thế này nhé */}
            <button onClick={() => createToast({ type: "error", title: "oh no", message: "something is wrong" })}>
                Create Warning Toast
            </button>
            <br />
            <button onClick={() => createToast({ type: "success", title: "oh yeah", message: "nothing is wrong" })}>
                Create Success Toast
            </button>
            <br />
            <button
                onClick={() =>
                    createToast({ type: "success", title: "oh yeah", message: "chờ hơi bị lâu đấy", duration: 20000 })
                }
            >
                Create Super Lâu Toast
            </button>
        </div>
    );
}
