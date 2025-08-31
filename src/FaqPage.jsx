import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

const faqData = {
  "General": [
    { q: "What is TaraRide?", a: "TaraRide is a community-based carpooling app that connects drivers and passengers in Metro Manila, offering safe, affordable, and convenient daily commutes." },
    { q: "How does TaraRide work?", a: "Drivers post rides through the website or app, passengers can search and book available seats, and payments can be made via cash or PayMongo." },
    { q: "Who can use TaraRide?", a: "TaraRide is designed for students, employees, and daily commuters across Metro Manila." }
  ],
  "Passengers": [
    { q: "How do I book a ride?", a: "Simply search for available rides, choose your route, confirm your booking, and complete your payment." },
    { q: "How do I pay for my ride?", a: "Passengers can pay via cash or PayMongo for a seamless experience." },
    { q: "Can I cancel my booking?", a: "Yes, both drivers and passengers can reject or cancel a booking if needed." },
    { q: "How do I rate drivers?", a: "After your ride, you can rate your driver using our star rating system to help maintain quality and safety." }
  ],
  "Drivers": [
    { q: "How do I post a ride?", a: "Drivers can follow the step-by-step guide on the website homepage to post their ride details." },
    { q: "How do I earn money?", a: "Your ride earnings are tracked and displayed directly in your Driver Dashboard." },
    { q: "How do passengers pay me?", a: "Passengers can pay through cash or PayMongo, with transactions automatically logged in the system." },
    { q: "Can I set my own routes?", a: "Yes. Drivers have full control in choosing their start and end points." }
  ],
  "Account & Technical": [
    { q: "How do I create an account?", a: "Passengers can sign up via the mobile app, while drivers can register through the website." },
    { q: "Can I update my profile?", a: "Yes, you can manage and update your details anytime under Account settings." }
  ]
};

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter questions across categories
  const filteredFAQs = faqData[activeTab].filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">Frequently Asked Questions</h1>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for a question..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {Object.keys(faqData).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setOpenIndex(null); setSearchQuery(""); }}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeTab === tab 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <div key={index} className="border rounded-2xl shadow-sm bg-white">
              <button
                className="flex justify-between w-full p-4 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-600 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
