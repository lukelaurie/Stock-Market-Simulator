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
          <Route path="157.230.181.102:8080/" element={<HomePage />} />
          <Route path="157.230.181.102:8080/profile" element={<ProfilePage />} exact />
          <Route path="157.230.181.102:8080/help" element={<HelpPage />} />
          <Route path="157.230.181.102:8080/predictions" element={<PredictionPage />} />
          <Route path="157.230.181.102:8080/search" element={<SearchPage />} />
        </Route>
        <Route path="157.230.181.102:8080/login" element={<LoginPage />} />
        <Route path="157.230.181.102:8080/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
