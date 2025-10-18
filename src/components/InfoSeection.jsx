export default function InfoSection() {
  return (
    <section className="text-center text-gray-500 max-w-2xl pt-12 sm:pt-24 md:pt-36 mx-auto px-4 ">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-blue-800">
        About the Project
      </h2>
      <p className="text-base sm:text-lg leading-relaxed">
        This project uses machine learning to analyze passenger data from the Titanic
        and predict the likelihood of survival. Enter your details such as age,
        gender, and ticket class to see how these factors might have influenced the outcome.
      </p>
    </section>
  );
}