'use client';

import { useState } from 'react';
import { Star, ChevronDown, Sliders, Filter } from 'lucide-react';
import { formalProducts } from '../app/formal-shirt/formal-products';

export default function FormalFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([1000, 2000]);
  const colors = [...new Set(formalProducts.map(p => p.color))];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const ratings = [5, 4, 3];

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <div className="filters-sidebar bg-white shadow-lg rounded-2xl p-6 h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b">
        <Filter size={24} className="text-gray-600" />
        <h3 className="text-xl font-bold text-gray-900">Filters</h3>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('price')}>
          <h4 className="font-semibold text-gray-900">Price</h4>
          <ChevronDown size={20} className={`transition-transform ${expanded === 'price' ? 'rotate-180' : ''}`} />
        </div>
        {expanded === 'price' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>â‚¹{priceRange[0]}</span>
              <Sliders size={20} />
              <span>â‚¹{priceRange[1]}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '60%' }} />
            </div>
            <button className="text-blue-600 text-sm font-medium hover:underline">Apply</button>
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('color')}>
          <h4 className="font-semibold text-gray-900">Color</h4>
          <span className="text-sm text-gray-500">({colors.length})</span>
          <ChevronDown size={20} className={`transition-transform ${expanded === 'color' ? 'rotate-180' : ''}`} />
        </div>
        {expanded === 'color' && (
          <div className="flex flex-wrap gap-2">
            {colors.slice(0,6).map(color => (
              <button key={color} className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-blue-500 hover:shadow-md transition-all" style={{ backgroundColor: color.toLowerCase() }} title={color} />
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('size')}>
          <h4 className="font-semibold text-gray-900">Size</h4>
          <ChevronDown size={20} className={`transition-transform ${expanded === 'size' ? 'rotate-180' : ''}`} />
        </div>
        {expanded === 'size' && (
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(size => (
              <label key={size} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm font-medium text-gray-700">{size}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('rating')}>
          <h4 className="font-semibold text-gray-900">Customer Rating</h4>
          <ChevronDown size={20} className={`transition-transform ${expanded === 'rating' ? 'rotate-180' : ''}`} />
        </div>
        {expanded === 'rating' && (
          <div className="space-y-2">
            {ratings.map(rating => (
              <label key={rating} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex">
                  {Array(rating).fill(0).map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                  <Star key="half" size={16} className="text-gray-300" />
                </div>
                <span className="text-sm text-gray-700">& Up</span>
                <input type="checkbox" className="ml-auto w-4 h-4 text-blue-600 rounded" />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Discount */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => toggleSection('discount')}>
          <h4 className="font-semibold text-gray-900">Discount</h4>
          <ChevronDown size={20} className={`transition-transform ${expanded === 'discount' ? 'rotate-180' : ''}`} />
        </div>
        {expanded === 'discount' && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">10% and above</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">20% and above</span>
            </label>
            <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm font-medium text-gray-700">30% and above</span>
            </label>
          </div>
        )}
      </div>

      <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors mb-4">
        Apply Filters
      </button>
      <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-50 transition-colors">
        Clear All
      </button>
    </div>
  );
}
