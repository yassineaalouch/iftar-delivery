// Import necessary dependencies
import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/router';

// Define interfaces for type safety
interface Option {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Selection {
  option: Option;
  quantity: number;
}

interface Category {
  name: string;
  options: Option[];
}

interface PackagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  packageInfo: { id: string; persons: number } | null;
}

// Define available package options with categories and items
const packageOptions: Category[] = [
  {
    name: 'Drinks',
    options: [
      { id: 'tea', name: 'Moroccan Tea', price: 2, image: '/images/products/tea.jpeg' },
      { id: 'coffee', name: 'Coffee', price: 2, image: '/images/products/coffee.jpeg' }
    ]
  },
  {
    name: 'Soup', 
    options: [
      { id: 'hrira', name: 'Hrira', price: 3, image: '/images/products/hrira.jpeg' },
      { id: 'hsoua', name: 'Hsoua', price: 3, image: '/images/products/hsoua.jpeg' }
    ]
  },
  {
    name: 'Baked',
    options: [
      { id: 'msemen', name: 'Msemen', price: 2, image: '/images/products/msemen.jpeg' },
      { id: 'beghrir', name: 'Beghrir', price: 2, image: '/images/products/beghrir.jpeg' }
    ]
  },
  {
    name: 'Sweet',
    options: [
      { id: 'chebakia', name: 'Chebakia', price: 1, image: '/images/products/chebakia.jpeg' },
      { id: 'briwat', name: 'Briwat', price: 1, image: '/images/products/briwat.jpeg' }
    ]
  }
];

const PackagePopup = ({ isOpen, onClose, packageInfo }: PackagePopupProps) => {
  // Initialize hooks and state
  const { addPackage } = useCartStore();
  const router = useRouter();
  const [selections, setSelections] = useState<Record<string, Selection[]>>({});

  // Handle selecting an item from a category
  const handleSelect = (category: string, option: Option) => {
    if (packageInfo?.persons === 1) {
      // For single person package, replace existing selection
      setSelections(prev => ({
        ...prev,
        [category]: [{ option, quantity: 1 }]
      }));
      return;
    }
    
    // For multi-person package, add to existing selections
    setSelections(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), { option, quantity: 1 }]
    }));
  };

  // Update quantity of selected item
  const updateQuantity = (category: string, optionId: string, delta: number) => {
    setSelections(prev => {
      const categorySelections = prev[category] || [];
      const totalQuantity = categorySelections.reduce((sum, sel) => 
        sel.option.id === optionId ? sum : sum + sel.quantity, 0
      );
      
      const updatedSelections = categorySelections.map(sel => {
        if (sel.option.id === optionId) {
          // Ensure quantity stays within valid range
          const newQuantity = Math.max(1, Math.min(
            sel.quantity + delta,
            (packageInfo?.persons || 1) - totalQuantity
          ));
          return { ...sel, quantity: newQuantity };
        }
        return sel;
      });

      return {
        ...prev,
        [category]: updatedSelections
      };
    });
  };

  // Remove an item from selections
  const removeSelection = (category: string, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [category]: prev[category].filter(sel => sel.option.id !== optionId)
    }));
  };

  // Helper functions for calculations and checks
  const getCategoryTotal = (category: string) => {
    return (selections[category] || []).reduce((sum, sel) => sum + sel.quantity, 0);
  };

  const canAddMore = (category: string) => {
    const total = getCategoryTotal(category);
    return total < (packageInfo?.persons || 1);
  };

  // Cart and checkout handling
  const handleAddToCart = () => {
    const packageItems = Object.values(selections).flat().map(({ option, quantity }) => ({
      id: option.id,
      name: option.name,
      price: option.price,
      image: option.image,
      quantity
    }));
    
    const packagePrice = packageInfo?.persons ? packageInfo.persons * 8 : 8;
    const packageName = `${packageInfo?.persons || 1} Person Package`;
    
    addPackage(packageItems, packagePrice, packageName);
    onClose();
  };

  const handleProceedToCheckout = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleContinueShopping = () => {
    handleAddToCart();
  };

  // Package completion checks
  const isComplete = packageOptions.every(category => {
    const categoryTotal = getCategoryTotal(category.name);
    return categoryTotal === (packageInfo?.persons || 1);
  });

  const getRemainingSelections = () => {
    let remaining = 0;
    packageOptions.forEach(category => {
      const categoryTotal = getCategoryTotal(category.name);
      remaining += (packageInfo?.persons || 1) - categoryTotal;
    });
    return remaining;
  };

  // Progress calculation
  const getProgressPercentage = () => {
    const totalRequired = packageOptions.length * (packageInfo?.persons || 1);
    const totalSelected = packageOptions.reduce((sum, category) => 
      sum + getCategoryTotal(category.name), 0
    );
    return (totalSelected / totalRequired) * 100;
  };

  // Summary and price calculations
  const getSelectionSummary = () => {
    return packageOptions.map(category => ({
      name: category.name,
      selections: selections[category.name] || [],
      isComplete: getCategoryTotal(category.name) === (packageInfo?.persons || 1),
      required: packageInfo?.persons || 1,
      totalPrice: (selections[category.name] || [])
        .reduce((sum, { option, quantity }) => sum + (option.price * quantity), 0)
    }));
  };

  const getTotalPrice = () => {
    return Object.values(selections).flat()
      .reduce((sum, { option, quantity }) => sum + (option.price * quantity), 0);
  };

  const isOptionSelected = (category: string, optionId: string) => {
    return selections[category]?.some(sel => sel.option.id === optionId) || false;
  };

  // Don't render if popup is not open
  if (!isOpen) return null;

  // Render popup UI
  return (
    <>
      {/* Background overlay */}
      <div 
        className="fixed max-h-screen inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Main popup container */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-playfair font-bold text-[#1a472a] mb-6">
              Customize Your Package
            </h2>

            {/* Progress bar showing completion status for each category */}
            <div className="mb-6 space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                {packageOptions.map(category => (
                  <span key={category.name}>{category.name}</span>
                ))}
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                {packageOptions.map((category, index) => {
                  const progress = (getCategoryTotal(category.name) / (packageInfo?.persons || 1)) * 100;
                  return (
                    <div 
                      key={category.name}
                      className="h-full flex-1 first:rounded-l-full last:rounded-r-full"
                    >
                      <div 
                        className={`h-full transition-all duration-300 
                          ${progress === 100 ? 'bg-green-500' : 'bg-[#1a472a]'}`}
                        style={{ 
                          width: `${progress}%`,
                          borderRight: index < packageOptions.length - 1 ? '1px solid white' : 'none'
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category sections */}
            <div className="space-y-8">
              {packageOptions.map((category) => (
                <div key={category.name} className="border-b pb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-[#2c5545]">
                      {category.name}
                    </h3>
                    <span className={`text-sm ${
                      getCategoryTotal(category.name) === 1
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}>
                      {packageInfo?.persons === 1 
                        ? (getCategoryTotal(category.name) === 1 ? '✓ Selected' : 'Select one')
                        : `${getCategoryTotal(category.name)} / ${packageInfo?.persons} selected`
                      }
                    </span>
                  </div>
                  <div className="space-y-3">
                    {category.options.map((option) => {
                      const isSelected = isOptionSelected(category.name, option.id);
                      const selection = selections[category.name]?.find(
                        sel => sel.option.id === option.id
                      );

                      return (
                        <div
                          key={option.id}
                          className={`relative flex items-center p-3 rounded-xl border transition-all
                            ${isSelected 
                              ? 'border-[#1a472a] bg-[#1a472a]/5' 
                              : 'border-gray-200 hover:border-[#1a472a]/50'}`}
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={option.image}
                              alt={option.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium text-[#1a472a]">{option.name}</h4>
                            <p className="text-sm text-gray-500">${option.price.toFixed(2)}</p>
                          </div>
                          {packageInfo?.persons === 1 ? (
                            // Single selection mode
                            <button
                              onClick={() => {
                                if (isSelected) {
                                  setSelections(prev => ({
                                    ...prev,
                                    [category.name]: prev[category.name]
                                      .filter(sel => sel.option.id !== option.id)
                                  }));
                                } else {
                                  handleSelect(category.name, option);
                                }
                              }}
                              className={`px-4 py-2 rounded-full transition-all ${
                                isSelected
                                  ? 'bg-[#1a472a] text-white'
                                  : 'bg-[#1a472a]/10 text-[#1a472a] hover:bg-[#1a472a]/20'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          ) : (
                            // Multiple selection mode
                            isSelected ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(category.name, option.id, -1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a472a]/10 text-[#1a472a]"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{selection?.quantity||0}</span>
                                <button
                                  onClick={() => updateQuantity(category.name, option.id, 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a472a]/10 text-[#1a472a]"
                                  disabled={!canAddMore(category.name)}
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeSelection(category.name, option.id)}
                                  className="ml-2 text-red-500 hover:text-red-600"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleSelect(category.name, option)}
                                disabled={!canAddMore(category.name)}
                                className="px-4 py-2 bg-[#1a472a]/10 text-[#1a472a] 
                                         rounded-full hover:bg-[#1a472a]/20"
                              >
                                Add
                              </button>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary and action buttons */}
            <div className="mt-8 pt-6 border-t space-y-4">
              {/* Show summary when package is complete */}
              {isComplete && (
                <div 
                  className="bg-[#1a472a]/5 rounded-xl p-4 mb-4 
                  animate-scale-fade"
                >
                  <h3 className="font-medium text-[#1a472a] mb-2">Your Package Summary:</h3>
                  <div className="space-y-2">
                    {getSelectionSummary().map(({ name, selections, totalPrice }) => (
                      <div key={name} className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">{name}:</span>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {selections.map(({ option, quantity }) => (
                            <span 
                              key={option.id}
                              className="text-sm bg-white rounded-full px-3 py-1 border border-[#1a472a]/20
                                       animate-fade-in"
                            >
                              {option.name} x{quantity}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-[#1a472a]">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-[#1a472a]">
                      Total Items: {Object.values(selections).flat()
                        .reduce((sum, { quantity }) => sum + quantity, 0)}
                    </span>
                    <span className="font-medium text-[#1a472a]">
                      Total Price: ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Progress indicator */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Package Progress:</span>
                <span className="font-medium text-[#1a472a]">
                  {packageOptions.filter(cat => getCategoryTotal(cat.name) === (packageInfo?.persons || 1)).length} 
                  of {packageOptions.length} categories complete
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleProceedToCheckout}
                  disabled={!isComplete}
                  className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300
                    ${isComplete
                      ? 'bg-[#1a472a] hover:bg-[#2c5545] transform hover:scale-105'
                      : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                  {isComplete 
                    ? 'Proceed to Checkout' 
                    : `Select ${getRemainingSelections()} More Items`}
                </button>
                
                <button
                  onClick={handleContinueShopping}
                  disabled={!isComplete}
                  className={`w-full py-3 rounded-xl font-bold border-2 transition-all duration-300
                    ${isComplete
                      ? 'border-[#1a472a] text-[#1a472a] hover:bg-[#1a472a]/5 transform hover:scale-105'
                      : 'border-gray-300 text-gray-300 cursor-not-allowed'
                    }`}
                >
                  {isComplete 
                    ? 'Add to Cart & Continue Shopping' 
                    : `${getRemainingSelections()} Items Remaining`}
                </button>
              </div>

              {/* Validation messages */}
              {!isComplete && (
                <div className="space-y-2">
                  <p className="text-sm text-center text-gray-500">
                    {getRemainingSelections() === 0 
                      ? 'Please review your selections'
                      : `Please select ${getRemainingSelections()} more items to complete your package`}
                  </p>
                  {getSelectionSummary()
                    .filter(({ isComplete, selections }) => !isComplete || selections.length === 0)
                    .map(({ name, selections, required }) => (
                      <p key={name} className="text-sm text-amber-600">
                        {selections.length === 0
                          ? `• Please select items from ${name}`
                          : `• Need ${required - getCategoryTotal(name)} more from ${name}`
                        }
                      </p>
                    ))
                  }
                </div>
              )}
              {isComplete && (
                <p className="text-sm text-center text-green-600">
                  ✓ All selections complete! Choose how you would like to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackagePopup;