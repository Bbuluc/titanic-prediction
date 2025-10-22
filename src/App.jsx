// Main application component for the Titanic Survivor Prediction app.
// This component assembles all the major sections of the app:
// - Header (MainHeader)
// - Project information (InfoSection)
// - User input form (FormSection)
// - Footer (Footer)
// -------------------------------------------------------------


import Footer from "./components/Footer";
import FormSection from "./components/Form";
import MainHeader from "./components/Header";
import InfoSection from "./components/infoSection";

function App() {
  return (
    <>
      <MainHeader />
      <InfoSection />
      <FormSection/>
      <Footer />
    </>
  );
}

export default App;
