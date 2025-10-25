// This component renders the footer section of the Titanic app.
// It includes a copyright notice and a simple background color.

export default function Footer() {
  return (
    <footer className="relative flex justify-center items-end mt-10 lg:mt-16 bg-[#000b76]">

        {/* Copyright text displayed at the bottom center */}
        <p className="relative text-white text-xs text-center z-10">
        &copy; 2024 Titanic Survivor Prediction. All rights reserved..
        </p>

    </footer>
  );
}
