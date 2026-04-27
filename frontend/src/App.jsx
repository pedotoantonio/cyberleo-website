import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Story from './pages/Story';
import Characters from './pages/Characters';
import Videos from './pages/Videos';
import Parents from './pages/Parents';
import Privacy from './pages/Privacy';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStories from './pages/admin/Stories';
import NotFound from './pages/NotFound';
import CookieBanner from './components/CookieBanner';
import { CookieConsentProvider } from './hooks/useCookieConsent';

function App() {
  return (
    <CookieConsentProvider>
      <Routes>
        {/* Story page outside layout for full storybook experience */}
        <Route path="storie/:slug" element={<Story />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="storie" element={<Stories />} />
          <Route path="personaggi" element={<Characters />} />
          <Route path="video" element={<Videos />} />
          <Route path="genitori" element={<Parents />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/stories" element={<AdminStories />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieBanner />
    </CookieConsentProvider>
  );
}

export default App;
