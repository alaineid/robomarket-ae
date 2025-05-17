import Link from "next/link";

type CallToActionProps = {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

export default function CallToAction({
  headline = "Ready to Welcome a Robot Into Your Life?",
  description = "Browse our collection of premium humanoid robots and find the perfect assistant for your needs.",
  buttonText = "Shop Now",
  buttonLink = "/shop",
}: CallToActionProps) {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 text-center max-w-[2400px]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{headline}</h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          {description}
        </p>
        <Link
          href={buttonLink}
          className="bg-[#4DA9FF] hover:bg-[#3B8CD9] text-white font-bold py-3 px-10 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
