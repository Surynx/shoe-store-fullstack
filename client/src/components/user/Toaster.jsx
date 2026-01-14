import { Toaster } from "react-hot-toast";

function ToasterDark() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "#3b2f2f",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
        },

        success: {
          style: {
            background: "#3b2f2f",
          },
        },

        error: {
          style: {
            background: "#3b2f2f",
          },
        },
      }}
      containerStyle={{
        bottom: "40px",
      }}
    />
  );
}

export default ToasterDark;
