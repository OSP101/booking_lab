"use client";
import { useEffect } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

const TourGuide = () => {
  useEffect(() => {
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: "shadow-md bg-white p-4 rounded-lg",
        scrollTo: true,
        cancelIcon: { enabled: true },
      },
    });

    tour.addStep({
      id: "step-1",
      text: "Welcome! This is the booking form.",
      attachTo: { element: "form", on: "bottom" },
      buttons: [
        { text: "Next", action: tour.next },
      ],
    });

    tour.addStep({
      id: "step-2",
      text: "Enter your Booking ID here.",
      attachTo: { element: "#bookingId", on: "bottom" },
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Next", action: tour.next },
      ],
    });

    tour.addStep({
      id: "step-3",
      text: "Click this button to book your lab.",
      attachTo: { element: "#submitButton", on: "top" },
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Finish", action: tour.complete },
      ],
    });

    tour.start();
  }, []);

  return null;
};

export default TourGuide;
