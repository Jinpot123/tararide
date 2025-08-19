import React, { useState } from "react";
import { Car, User, CheckCircle, XCircle, MessageSquare, CreditCard, Star } from "lucide-react";

const steps = {
  driver: [
    {
      icon: <Car className="w-8 h-8 text-blue-500" />,
      title: "Post a Ride",
      description: "Driver clicks Ride Now, adds ride title, start and end destination.",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "Confirm Ride Details",
      description: "Review ride info and confirm to make it visible to passengers.",
    },
    {
      icon: <User className="w-8 h-8 text-purple-500" />,
      title: "Wait for Passengers",
      description: "Passengers can now view your ride and request a seat.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
      title: "Message Passenger",
      description: "Drivers can message passengers directly after a request.",
    },
    {
      icon: <XCircle className="w-8 h-8 text-red-500" />,
      title: "Accept or Reject",
      description: "Drivers can accept or reject passenger requests.",
    },
  ],
  passenger: [
    {
      icon: <User className="w-8 h-8 text-blue-500" />,
      title: "Book a Ride",
      description: "Passenger clicks Ride Now, selects pickup, destination, and seats.",
    },
    {
      icon: <Car className="w-8 h-8 text-green-500" />,
      title: "Choose Ride",
      description: "Only driver routes that match the passenger’s trip will show.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
      title: "Message Driver",
      description: "Passenger can message driver while waiting for confirmation.",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-purple-500" />,
      title: "Payment",
      description: "After drop-off, passenger pays via cash or e-wallet (PayMongo).",
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Rate Driver",
      description: "Leave a rating and feedback after the ride.",
    },
  ],
};

export default function UserGuide() {
  const [role, setRole] = useState("driver");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🚖 TaraRide User Guide</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setRole("driver")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            role === "driver" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Driver Guide
        </button>
        <button
          onClick={() => setRole("passenger")}
          className={`px-4 py-2 rounded-lg font-semibold ${
            role === "passenger" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          Passenger Guide
        </button>
      </div>

      <div className="grid gap-6">
        {steps[role].map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-white shadow-md rounded-xl border"
          >
            <div className="flex-shrink-0">{step.icon}</div>
            <div>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
