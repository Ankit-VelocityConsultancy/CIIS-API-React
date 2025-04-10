import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import { Toaster } from "./components/ui/toaster.jsx";
// import { ThemeProvider } from "@/components/themeprovider";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./components/pages/ErrorPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
    <RecoilRoot>
      {/* <ThemeProvider defaultTheme="dark" storageKey="theme"> */}
        <ErrorBoundary
          FallbackComponent={ErrorPage}
          onReset={() => (location.href = "/login")}
        >
          <App />
          <Toaster />
        </ErrorBoundary>
      {/* </ThemeProvider> */}
    </RecoilRoot>
  //</React.StrictMode>
);
