import { motion } from "framer-motion";

function HowItWorks() {

  const steps = [
    {
      number: "01",
      icon: "👕",
      title: "List It",
      text: "Add clothes sitting unused in your wardrobe."
    },
    {
      number: "02",
      icon: "🔍",
      title: "Find It",
      text: "Discover clothes from people in the community."
    },
    {
      number: "03",
      icon: "↔",
      title: "Swap It",
      text: "Send a swap request and give fashion another life."
    }
  ];

  return (
    <section className="bg-stone-100 py-16">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-2xl mx-auto">

          <p className="text-green-700 font-semibold tracking-widest text-sm">
            SIMPLE & SUSTAINABLE
          </p>

          <h2 className="text-4xl font-bold text-gray-900 mt-3">
            How Swapping Works
          </h2>

          <p className="text-gray-600 mt-4">
            Turn clothes you no longer wear into something new to you.
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-8 mt-14">

          {steps.map((step) => (

            <motion.div
              key={step.number}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >

              <div className="flex justify-between items-start">

                <div className="text-4xl">
                  {step.icon}
                </div>

                <span className="text-5xl font-bold text-stone-200">
                  {step.number}
                </span>

              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-8">
                {step.title}
              </h3>

              <p className="text-gray-600 mt-3 leading-relaxed">
                {step.text}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;
