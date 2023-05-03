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
          <Route path="http://157.230.181.102:3000/" element={<HomePage />} />
          <Route path="http://157.230.181.102:3000/profile" element={<ProfilePage />} exact />
          <Route path="http://157.230.181.102:3000/help" element={<HelpPage />} />
          <Route path="http://157.230.181.102:3000/predictions" element={<PredictionPage />} />
          <Route path="http://157.230.181.102:3000/search" element={<SearchPage />} />
        </Route>
        <Route path="http://157.230.181.102:3000/login" element={<LoginPage />} />
        <Route path="http://157.230.181.102:3000/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
