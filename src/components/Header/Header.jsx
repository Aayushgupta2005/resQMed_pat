import React, { useState, useEffect } from 'react';
import { Container, Logo, LogoutBtn } from '../index';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: 'Home', slug: "/", active: !authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
    { name: "Appointments", slug: "/appointments", active: authStatus },
    { name: "Reports", slug: "/reports", active: authStatus },
    { name: "Settings", slug: "/settings", active: authStatus },
    {name : "book Appointment", slug:"/chatbot", active:authStatus}
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed Header */}
      <header 
        className={`fixed top-0 left-0 w-full h-16 z-[1000] transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}
      >
        <Container>
          <nav className="flex items-center justify-between h-16 px-4">
            <Link to="/" className="z-50">
              <Logo width="120px" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => 
                item.active && (
                  <Link
                    key={item.name}
                    to={item.slug}
                    className="relative px-4 py-2 text-gray-700 hover:text-blue-600 font-medium rounded-full transition-colors duration-200 group"
                  >
                    {item.name}
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  </Link>
                )
              )}
              {authStatus && (
                <LogoutBtn className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105" />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden z-50 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {menuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {/* Mobile Navigation */}
            <div
              className={`fixed inset-0 bg-white/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
                menuOpen ? 'translate-x-0' : 'translate-x-full'
              } md:hidden`}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                {navItems.map((item) =>
                  item.active && (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.slug);
                        setMenuOpen(false);
                      }}
                      className="text-2xl font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                      {item.name}
                    </button>
                  )
                )}
                {authStatus && (
                  <LogoutBtn className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105" />
                )}
              </div>
            </div>
          </nav>
        </Container>
      </header>

      {/* Ensure content does not overlap the fixed header */}
      <div className="pt-16"></div>
    </>
  );
}

export default Header;
