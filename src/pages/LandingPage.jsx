import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Stethoscope, Calendar, MapPin, Phone } from 'lucide-react';
import { useCallback } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleSOSClick = useCallback(() => {
    const isLoggedIn = localStorage.getItem('user');
    navigate(isLoggedIn ? '/dashboard' : '/login');
  }, [navigate]);

  const features = [
    {
      icon: <Stethoscope className="h-8 w-8 text-blue-600" />,
      title: "24/7 Emergency Support",
      desc: "Immediate connection to emergency services with priority dispatch system."
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: "Smart Health Dashboard",
      desc: "Comprehensive health tracking and appointment management system."
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: "Real-time Hospital Finder",
      desc: "Locate nearby medical facilities with live bed availability updates."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Navigation Bar */}
      {/* <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ResQMed
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-gray-900">
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Emergency Care at Your
            <span className="block text-blue-600">Fingertips</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            ResQMed revolutionizes emergency response with instant access to medical services,
            real-time hospital information, and comprehensive healthcare management.
          </p>
          
          {/* Emergency Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={handleSOSClick}
              className="group relative px-8 py-4 bg-red-600 text-white rounded-xl 
                       hover:bg-red-700 transition-all duration-300 transform 
                       hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
                <span className="text-lg font-semibold">Emergency SOS</span>
              </div>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-400 
                            rounded-full transform scale-x-0 group-hover:scale-x-100 
                            transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl 
                       transition-all duration-300 transform hover:-translate-y-1 
                       border border-gray-100"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center 
                            justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to ensure your safety?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust ResQMed for their emergency medical needs.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg 
                       hover:bg-blue-50 transition font-semibold"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 border-2 border-white text-white rounded-lg 
                       hover:bg-white/10 transition font-semibold flex items-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2024 ResQMed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;