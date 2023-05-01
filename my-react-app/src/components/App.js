/**
 * This is the main component which controls which page is 
 * currently being displayed to the user.
 */
// imports all of the needed pages
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home";
import HelpPage from "./Pages/Help";
import LoginPage from "./Pages/Login";
import PredictionPage from "./Pages/Predictions";
import ProfilePage from "./Pages/Profile";
import SearchPage from "./Pages/Search";
import RegisterPage from "./Pages/Register";
import PrivateRoutes from ".././utils/auth";

function App() {
  return (
    <BrowserRouter>
      {/* Switches to correct route based on the url */}
      <Routes>
        {/* Only allows access when user is vlaidated */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} exact />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/predictions" element={<PredictionPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
