import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import NavBar from "./Components/NavBar";
import BookDetails from "./Pages/BookDetails";
import BookReader from "./Pages/BookReader";
import ContactUs from "./Pages/ContactUs";
import HomePage from "./Pages/HomePage";
import AdminDashBoard from "./Pages/AdminDashBoard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { AuthProvider } from "./Contexts/AuthContext";
import { BooksProvider } from "./Contexts/BooksContext";
import LandingPage from "./Pages/LandingPage";
import { ReaderProvider } from "./Contexts/ReaderContext";
import AdminRoute from "./Components/AdminRoutes";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BooksProvider>
          <ReaderProvider>
            <NavBar />
            <Routes>
              <Route index element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashBoard />
                  </AdminRoute>
                }
              />
              <Route path="/bookDetails/:bookId" element={<BookDetails />} />
              <Route path="/reader/:bookId/:bookUrl" element={<BookReader />} />
              <Route path="/contactUs" element={<ContactUs />} />
            </Routes>
          </ReaderProvider>
        </BooksProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
