import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Vans from './components/Vans';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VanDetail from './components/VanDetail';
import Navigators from './components/Host/Navigators';
import Dashboard from './components/Host/Dashboard';
import Income from './components/Host/Income';
import Reviews from './components/Host/Reviews';
import Protector from './components/Protector';
import HostVans from './components/Host/HostVans';
import HostVanDetail from './components/Host/HostVanDetail';
import Details from './components/Host/Details';
import Pricing from './components/Host/Pricing';
import Photos from './components/Host/Photos';
import AddVanForm from './components/Host/AddVanForm';
import Wishlist from './components/Host/Wishlist';
import Booking from './components/Host/Booking';
import Cart from './components/Host/Cart';
import Checkout from './components/Host/Checkout';



function App() {

  return (
    <Routes>
      <Route>
        <Route path='/' element={<Header />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='vans' element={<Vans />} />
          <Route path='van/:id' element={<VanDetail />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<SignUp />} />
          <Route element={<Protector />}>
            <Route path='host' element={<Navigators />}>
              <Route index element={<Dashboard />} />
              <Route path='income' element={<Income />} />
              <Route path='wishlist' element={<Wishlist />} />
              <Route path='bookings' element={<Booking />} />
              <Route path='reviews' element={<Reviews />} />
              <Route path='checkout' element={<Checkout />} />
              <Route path='cart' element={<Cart />} />
              <Route path='vans' element={<HostVans />} />
              <Route path='addvan' element={<AddVanForm />} />
              <Route path='van/:id' element={<HostVanDetail />}>
                <Route index element={<Details />} />
                <Route path='pricing' element={<Pricing />} />
                <Route path='photos' element={<Photos />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<h1>Error Page</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
