import { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Gyms } from "./containers/Gyms";
import { Header } from "./components/Header";
import { Gym } from "./containers/Gym";
import { Profile } from "./containers/Profile";
import { Battle } from "./containers/Battle";
import { Toastr } from "./components/Toast";

function App() {
  const [showLoader, setShowLoader] = useState({
    mintFakemon: false,
    createGym: false,
    battle: false,
    attackFakemon: false,
    fleeBattle: false,
  });

  // To trigger toast showing for 2s
  const [toastCount, setToastCount] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const showToastMessage = (message) => {
    setToastMessage(message);
    setToastCount((curr) => curr + 1);
  };

  const setIndividualShowLoader = (loaderStatus) => {
    setShowLoader({ ...showLoader, ...loaderStatus });
  };

  const showError = (error) => {
    // Convert "Error: VM Exception while processing transaction: reverted with reason string 'Battle expired'" into "Battle expired"
    const errorMessage = error.error
      ? error.error.data.message
          .split(
            "Error: VM Exception while processing transaction: reverted with reason string "
          )[1]
          .split("'")[1]
      : error.message;

    showToastMessage(errorMessage);
  };

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Navigate replace to="/profile" />} />
        <Route path="/profile" element={<Profile showLoader={showLoader} />} />
        <Route path="/gyms" element={<Gyms showLoader={showLoader} />} />
        <Route path="/gyms/:id" element={<Gym />} />
        <Route
          path="/gyms/:id/battle"
          element={<Battle showLoader={showLoader} />}
        />
      </Routes>

      <Toastr message={toastMessage} toastCount={toastCount} />
    </>
  );
}

export default App;
