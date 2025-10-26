import { motion } from "framer-motion";
import ReviewForm from "@/components/ReviewForm";

const features = [
  {
    title: "Eco-Friendly",
    description: "Reduce air pollution and contribute to a healthier planet by turning crop residue into useful resources.",
    color: "lime"
  },
  {
    title: "Profitable",
    description: "Unlock new income streams from biomass and waste, empowering farmers with economic growth.",
    color: "lime"
  },
  {
    title: "Innovative",
    description: "Leverage cutting-edge technology and smart insights to manage, monitor, and maximize crop residue usage.",
    color: "lime"
  }
];

const FeatureCard = ({ title, description, index }) => (
  <motion.div
    className="bg-green-900/60 backdrop-blur-xl rounded-2xl p-6 flex-1 min-w-[280px] hover:scale-105 transition-transform duration-300 shadow-lg border border-green-700/40"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
  >
    <h3 className="text-xl font-bold text-lime-300 mb-3">{title}</h3>
    <p className="text-green-100 text-sm md:text-base leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default function AboutSection() {
  return (
    <section 
      className="relative w-full bg-gradient-to-br from-green-950 via-emerald-900 to-green-800 text-green-100 py-20 px-4 overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background glow with reduced motion */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/40 via-emerald-900/20 to-transparent blur-3xl pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto text-center">
        <motion.h2 
          id="about-heading"
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide mb-6 text-lime-400 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Welcome to <span className="text-amber-400">Haryali</span>
        </motion.h2>

        <motion.p 
          className="text-lg md:text-xl lg:text-2xl font-medium text-green-200 leading-relaxed max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Haryali is your gateway to turning agricultural residue into sustainable income. 
          Our innovative platform empowers farmers and eco-enthusiasts alike to harness the 
          power of crop residue management, transforming what was once waste into valuable resources. 
          With Haryali, smoke-free fields aren't just a dream—they're a profitable reality.
        </motion.p>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-green-100/90 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Join the Haryali movement today, and become a part of a sustainable future where 
            innovation meets ecology. Your fields, your income, your impact—greener than ever before.
          </p>
        </motion.div>

        <ReviewForm />
      </div>
    </section>
  );
}
