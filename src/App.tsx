import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import SundaySchool from './pages/SundaySchool';
import ChurchMembers from './pages/ChurchMembers';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import { ProtectedRoute } from './components/ProtectedRoute';
import { LanguageProvider } from './lib/LanguageContext';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard/*" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Public Routes */}
          <Route path="*" element={
            <div className="app-container">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/sunday-school" element={<SundaySchool />} />
                  <Route path="/church-members" element={<ChurchMembers />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </LanguageProvider>
    </Router>
  );
}

export default App;
