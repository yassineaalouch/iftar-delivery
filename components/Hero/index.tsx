const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-primary via-neutral to-accent flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/patterns/star-pattern.png')]"></div>
      <div className="container mx-auto px-4 py-20 text-center text-white relative z-10">
        <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight">
          Ramadan Kareem
        </h1>
        <h2 className="text-2xl md:text-3xl mb-6 text-secondary font-medium">
          Daily Iftar Meals Delivered to Your Doorstep
        </h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-200">
          Experience the convenience of fresh, traditional iftar meals delivered right on time. 
          From farm-fresh ingredients to authentic recipes, we ensure your iftar is both blessed and delicious.
        </p>
        <button className="bg-secondary text-neutral px-8 py-4 rounded-full text-lg font-medium 
                         hover:bg-secondary/90 transition-colors transform hover:scale-105 duration-200">
          Order Now for Suhoor Delivery
        </button>
      </div>
    </section>
  );
};

export default Hero; 