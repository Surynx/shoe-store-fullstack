import { MapPin, Phone, Mail, Clock, Shield, Zap, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ContactPage() {

    const nav = useNavigate();

  return (
    <div className=" min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="hover:text-gray-900 cursor-pointer" onClick={()=>nav("/")}>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Contact</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-sans text-gray-900 mb-3">CONTACT US</h1>
          <p className="text-sm font-sans text-gray-600 max-w-2xl mx-auto">
            Please contact us at the marketer's address for any customer complaints or inquiries. We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Information Cards */}
          <div className="bg-white rounded-lg p-5 border transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Customer Care Email</h3>
                <a href="mailto:customercare@comet.in" className="text-sm text-gray-600 hover:text-blue-600">
                  customercare@comet.in
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Customer Care Number</h3>
                <a href="tel:+919497629774" className="text-sm text-gray-600 hover:text-blue-600">
                  +91 949-762-9774
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-5  transition-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Contact Time</h3>
                <p className="text-sm text-gray-600">Monday to Sunday</p>
                <p className="text-sm text-gray-600">(10:00 AM - 06:00 PM)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Office Address */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
              <div className="ml-3">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Comet Footwear Inc.</h2>
                <h3 className="text-base font-semibold text-gray-700 mb-1">Office Address:</h3>
                <p className="text-sm text-gray-600 mb-0.5">2500 Broadway Avenue, Suite 200</p>
                <p className="text-sm text-gray-600 mb-0.5">Santa Monica, CA 90404</p>
                <p className="text-sm text-gray-600">Los Angeles, California</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Choose Comet?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Quality Assurance</h3>
                <p className="text-sm text-gray-600">We stand behind every product with comprehensive quality guarantees.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Fast Response</h3>
                <p className="text-sm text-gray-600">Our customer care team responds to all inquiries within 24 hours.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <RotateCcw className="h-5 w-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-base font-semibold text-gray-900 mb-1">Easy Returns</h3>
                <p className="text-sm text-gray-600">Hassle-free returns and exchanges within 30 days of purchase.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;