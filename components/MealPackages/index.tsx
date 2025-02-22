import Image from 'next/image';
import { useState } from 'react';
import packagesData from '@/data/packages.json';
import PackagePopup from '../PackagePopup';

interface Package {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  persons: number;
}

interface PackageInfo {
  id: string;
  persons: number;
}

const MealPackages = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
  const packages: Package[] = packagesData.packages;

  return (
    <section className="py-20 bg-[#1a472a]/10">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl font-playfair text-center mb-12 text-[#1a472a] font-bold">
          Choose Your Package
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 
                         transition-all duration-500 hover:shadow-2xl 
                         transform hover:-translate-y-2 hover:bg-white
                         border border-white/50 group"
            >
              <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-gradient-to-r from-golden to-[#f3c75f] 
                               text-neutral-900 px-4 py-2 rounded-full text-sm font-bold 
                               shadow-[0_4px_10px_rgba(218,159,56,0.3)]
                               backdrop-blur-md border border-white/20
                               transform group-hover:scale-105 transition-transform
                               hover:shadow-[0_6px_15px_rgba(218,159,56,0.4)]">
                  ${pkg.price}/person
                </div>
              </div>
              <h3 className="text-2xl font-playfair font-bold mb-3 text-[#1a472a]
                           group-hover:text-[#2c5545] transition-colors">
                {pkg.title}
              </h3>
              <p className="text-gray-600 mb-6 group-hover:text-gray-800 transition-colors">
                {pkg.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPackage({
                    id: pkg.id,
                    persons: pkg.persons
                  });
                  setIsPopupOpen(true);
                }}
                className="w-full bg-[#1a472a] text-white py-3 rounded-xl
                           font-bold tracking-wide
                           transition-all duration-300
                           hover:bg-[#2c5545] 
                           transform hover:scale-105
                           shadow-[0_0_15px_rgba(26,71,42,0.3)]
                           hover:shadow-[0_0_20px_rgba(26,71,42,0.5)]
                           flex items-center justify-center gap-2
                           group-hover:bg-gradient-to-r from-[#1a472a] to-[#2c5545]"
              >
                <span>Customize Package ({pkg.persons} persons)</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <PackagePopup 
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedPackage(null);
          }}
          packageInfo={selectedPackage}
        />
      </div>
    </section>
  );
};

export default MealPackages;