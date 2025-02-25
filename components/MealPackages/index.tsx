import Image from 'next/image';
import { useState } from 'react';
import packagesData from '@/data/packages.json';
import PackagePopup from '../PackagePopup';

interface Package {
  id: string;
  title: string;
  price: number;
  description: string;
  elements: Element[];
  image: string;
  persons: number;
}
interface Element {
  name: string;
  number: number;
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
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl text-center mb-16 font-extrabold">
          <span className="bg-gradient-to-r from-black to-[#ec8b2a] bg-clip-text text-transparent">Choose Your Package</span>
        </h2>
        <div className="flex justify-center gap-8 max-w-4xl mx-auto">
          {packages.map((pkg) => (
              <PackageCart 
                key={pkg.id} 
                pkg={pkg} 
                onSelect={(packageInfo: PackageInfo) => {
                  setSelectedPackage(packageInfo);
                  setIsPopupOpen(true);
                }}
              />
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

interface PackageCartProps {
  pkg: Package;
  onSelect: (packageInfo: PackageInfo) => void;
}





function PackageCart({pkg, onSelect}: PackageCartProps) {
  return(
  <div 
  className="bg-white text-black w-1/3 shadow-xl 
             transition-all duration-500 hover:shadow-2xl 
             border-2 border-green-900 group"
>
  <h3 className="text-2xl border-b-2 my-2 font-extrabold text-center text-black font-playfair">
        {pkg.title}
  </h3>
  <div className="relative h-48 mb-2 overflow-hidden rounded-xl">
    <div>
      <Image
        src={pkg.image}
        alt={pkg.title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    <div className="absolute top-3 right-3 bg-gradient-to-r from-golden to-[#ec8b2a] 
                   text-neutral-900 px-4 py-2 rounded-full text-sm font-bold 
                   shadow-[0_4px_10px_rgba(218,159,56,0.3)]
                   bg-[#78c32a] group-hover:bg-[#ec8b2a] transition-color duration-700 border border-white/20
                   transform group-hover:scale-105 transition-transform
                   hover:shadow-[0_6px_15px_rgba(218,159,56,0.4)]">
      ${pkg.price}
    </div>
  </div>
  <div className='px-4'>
      <p className="text-center text-black text-xs">
        {pkg.description}
      </p>
      <div className="flex my-3 font-light justify-center">
        <div className="grid border border-black/20 text-xs rounded-xl p-2 grid-cols-4 gap-2">
          {pkg.elements.map((element) => (
            <div className='flex flex-col items-center justify-center'  key={element.name}>
              <div className="">
                  {element.name}
              </div>
              <div className="">
                  ({element.number})
              </div>
            </div>
          ))}
        </div>
      </div>
  </div>
  <div className='flex px-4 pb-2 justify-center'>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSelect({
          id: pkg.id,
          persons: pkg.persons
        });
      }}
      className="w-full bg-[#78c32a] text-white py-3 rounded-xl
                font-bold tracking-wide
                transition-all duration-300
                relative overflow-hidden
                transform hover:scale-105
                shadow-[0_0_15px_rgba(26,71,42,0.3)]
                hover:shadow-[0_0_20px_rgba(26,71,42,0.5)]
                flex items-center justify-center gap-2
                before:absolute before:inset-x-0 before:bottom-0 before:h-0 hover:before:h-full
                before:bg-[#FD8D14] before:transition-all before:duration-300 before:ease-out
                before:-z-10"
    >
      <span className="relative z-10">Customize Package</span>
    </button>
  </div>
</div>)
}