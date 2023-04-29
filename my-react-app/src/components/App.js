// imports all of the needed pages
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/Home";
import HelpPage from "./Pages/Help";
import LoginPage from "./Pages/Login";
import PredictionPage from "./Pages/Predictions";
import ProfilePage from "./Pages/Profile";
import SearchPage from "./Pages/Search";
import RegisterPage from "./Pages/Register";


function App() {
  return (
    <BrowserRouter>
        {/* Switches to correct route based on the url */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/predictions" element={<PredictionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
