export default function MainHeader() {
  return (
    <header className="relative flex justify-center items-center h-20">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute">
        <path
          fill="#000b76"
          fill-opacity="1"
          d="M0,192L120,208C240,224,480,256,720,261.3C960,267,1200,245,1320,234.7L1440,224L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
        ></path>
      </svg>


      <h1 className="relative text-white sm:text-3xl font-bold text-center z-10">
        Titanic Survivor Prediction
      </h1>
    </header>
  );
}