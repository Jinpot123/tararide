import React from "react";
import { Car, Users, MessageSquare } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <Car className="w-12 h-12 text-green-500" />,
      title: "Carpooling",
      description:
        "Share rides with others going the same way — save on travel costs, reduce congestion, and help the environment.",
    },
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Smart Match",
      description:
        "Our system automatically filters and shows you only the most relevant drivers near your pickup and dropoff points, making your search effortless.",
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-yellow-500" />,
      title: "Messaging",
      description:
        "Passengers and drivers can directly message each other for smoother coordination before and during rides.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="services">
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          What We Offer
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
