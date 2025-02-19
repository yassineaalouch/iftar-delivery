import Image from 'next/image';
import { useState } from 'react';
import packagesData from '@/data/packages.json';

interface Package {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  persons: number;
}

const MealPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const packages = packagesData.packages;

  console.log(selectedPackage);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-playfair text-center mb-12 text-neutral">Choose Your Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="relative h-48 mb-4">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-secondary text-neutral px-3 py-1 rounded-full text-sm font-medium">
                  ${pkg.price}/person
                </div>
              </div>
              <h3 className="text-xl font-playfair font-bold mb-2 text-neutral">{pkg.title}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <button
                onClick={() => setSelectedPackage(pkg)}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Customize Package
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MealPackages; 