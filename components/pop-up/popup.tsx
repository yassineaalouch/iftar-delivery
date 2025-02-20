import { useState } from "react";

const Popup = ({ onClose }: { onClose: () => void }) => {
  type SelectedOptionsType = "accompaniment1" | "accompaniment2" | "drink";

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<SelectedOptionsType, string>>({
    accompaniment1: "",
    accompaniment2: "",
    drink: "",
  });

  const basePrice = 90;
  const totalPrice = (basePrice * quantity).toFixed(2);

  const handleOptionSelect = (category: SelectedOptionsType, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: option }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity ease-in-out duration-300">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-6 relative transform transition-transform duration-300 scale-95 hover:scale-100">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left section: Options */}
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[400px] pr-4">
            {/* Accompaniments */}
            {(["accompaniment1", "accompaniment2"] as const).map((acc) => (
              <div key={acc}>
                <h3 className="text-xl font-semibold text-gray-800">
                  Choix Accompagnement <span className="text-yellow-500 text-sm">• Requis</span>
                </h3>
                <p className="text-gray-500 text-sm">Choisissez un produit</p>
                <div
                  className={`border rounded-lg p-4 flex justify-between items-center mt-2 cursor-pointer transition-all ease-in-out duration-300 ${
                    selectedOptions[acc] === "Petite Frite"
                      ? "border-yellow-500 bg-yellow-100"
                      : "hover:bg-gray-100 hover:border-yellow-500"
                  }`}
                  onClick={() => handleOptionSelect(acc, "Petite Frite")}
                >
                  <span>Petite Frite</span>
                  <span className="text-yellow-500">+</span>
                </div>
              </div>
            ))}

            {/* Drinks */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Choix Boisson <span className="text-yellow-500 text-sm">• Requis</span>
              </h3>
              <p className="text-gray-500 text-sm">Choisissez un produit</p>
              {["Eau Sidi Ali", "Petit Coca Cola", "Petit Coca Cola Zéro"].map((drink) => (
                <div
                  key={drink}
                  className={`border rounded-lg p-4 flex justify-between items-center mt-2 cursor-pointer transition-all ease-in-out duration-300 ${
                    selectedOptions.drink === drink
                      ? "border-yellow-500 bg-yellow-100"
                      : "hover:bg-gray-100 hover:border-yellow-500"
                  }`}
                  onClick={() => handleOptionSelect("drink", drink)}
                >
                  <span>{drink}</span>
                  <span className="text-yellow-500">+</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right section: Product info & Quantity */}
          <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
            <img
              src="/menu-duo.png"
              alt="Menu Duo Mixte"
              className="w-40 h-40 object-contain rounded-lg shadow-lg"
            />
            <h2 className="text-2xl font-bold text-gray-900">Menu Duo Mixte</h2>
            <p className="text-lg text-gray-600">{basePrice} MAD</p>

            {/* Quantity Selector */}
            <div className="flex items-center mt-6">
              <button
                className="p-3 border-2 border-gray-300 rounded-full bg-white hover:bg-gray-200 transition duration-200"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <span className="text-xl">-</span>
              </button>
              <span className="mx-6 text-xl font-semibold">{quantity}</span>
              <button
                className="p-3 border-2 border-gray-300 rounded-full bg-white hover:bg-gray-200 transition duration-200"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <span className="text-xl">+</span>
              </button>
            </div>

            {/* Add to Cart Button */}
            <button className="mt-6 bg-yellow-500 text-white py-3 px-6 rounded-full w-full text-lg font-semibold hover:bg-yellow-600 transition duration-200">
              Ajouter {quantity} pour {totalPrice} MAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
