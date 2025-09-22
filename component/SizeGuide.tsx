'use client'
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FaRuler, FaInfoCircle } from 'react-icons/fa'

interface SizeGuideProps {
  isOpen: boolean
  onClose: () => void
  productType?: 'saree' | 'lehenga' | 'choli' | 'salwar' | 'general'
}

const SizeGuide = ({ isOpen, onClose, productType = 'general' }: SizeGuideProps) => {
  const [activeTab, setActiveTab] = useState('measurements')
  const [selectedSize, setSelectedSize] = useState('')

  const sizeCharts = {
    saree: {
      title: 'Saree Size Guide',
      description: 'Sarees are typically one-size-fits-all, but blouse measurements are crucial for the perfect fit.',
      measurements: [
        { name: 'Bust', XS: '30-32', S: '32-34', M: '34-36', L: '36-38', XL: '38-40', XXL: '40-42' },
        { name: 'Waist', XS: '26-28', S: '28-30', M: '30-32', L: '32-34', XL: '34-36', XXL: '36-38' },
        { name: 'Hip', XS: '34-36', S: '36-38', M: '38-40', L: '40-42', XL: '42-44', XXL: '44-46' },
        { name: 'Length', XS: '5.5-6.0', S: '5.5-6.0', M: '5.5-6.0', L: '5.5-6.0', XL: '5.5-6.0', XXL: '5.5-6.0' }
      ],
      tips: [
        'Saree length is typically 5.5-6 meters (18-20 feet)',
        'Blouse should fit snugly but not restrict movement',
        'Consider your height when choosing saree length',
        'Petite women may prefer shorter sarees (5.5m)',
        'Tall women can opt for longer sarees (6m+)'
      ]
    },
    lehenga: {
      title: 'Lehenga Size Guide',
      description: 'Lehengas come in separate pieces - choli (top), lehenga (skirt), and dupatta. Each piece has different sizing.',
      measurements: [
        { name: 'Bust', XS: '30-32', S: '32-34', M: '34-36', L: '36-38', XL: '38-40', XXL: '40-42' },
        { name: 'Waist', XS: '26-28', S: '28-30', M: '30-32', L: '32-34', XL: '34-36', XXL: '36-38' },
        { name: 'Hip', XS: '34-36', S: '36-38', M: '38-40', L: '40-42', XL: '42-44', XXL: '44-46' },
        { name: 'Length', XS: '38-40', S: '40-42', M: '42-44', L: '44-46', XL: '46-48', XXL: '48-50' }
      ],
      tips: [
        'Lehenga skirt should fall 2-3 inches above the ground',
        'Choli should fit comfortably without being too tight',
        'Consider your height for lehenga length',
        'Petite: 38-40", Average: 42-44", Tall: 46-48"',
        'Dupatta length is typically 2.5-3 meters'
      ]
    },
    choli: {
      title: 'Choli Size Guide',
      description: 'Cholis are fitted tops that require precise measurements for the perfect fit.',
      measurements: [
        { name: 'Bust', XS: '30-32', S: '32-34', M: '34-36', L: '36-38', XL: '38-40', XXL: '40-42' },
        { name: 'Under Bust', XS: '28-30', S: '30-32', M: '32-34', L: '34-36', XL: '36-38', XXL: '38-40' },
        { name: 'Waist', XS: '26-28', S: '28-30', M: '30-32', L: '32-34', XL: '34-36', XXL: '36-38' },
        { name: 'Length', XS: '12-13', S: '13-14', M: '14-15', L: '15-16', XL: '16-17', XXL: '17-18' }
      ],
      tips: [
        'Choli should fit snugly but allow comfortable breathing',
        'Length should cover your midriff completely',
        'Consider your bust size for proper support',
        'Sleeve length varies by style preference',
        'Back closure should be secure and comfortable'
      ]
    },
    salwar: {
      title: 'Salwar Kameez Size Guide',
      description: 'Salwar kameez sets include a top (kameez), bottom (salwar), and dupatta.',
      measurements: [
        { name: 'Bust', XS: '30-32', S: '32-34', M: '34-36', L: '36-38', XL: '38-40', XXL: '40-42' },
        { name: 'Waist', XS: '26-28', S: '28-30', M: '30-32', L: '32-34', XL: '34-36', XXL: '36-38' },
        { name: 'Hip', XS: '34-36', S: '36-38', M: '38-40', L: '40-42', XL: '42-44', XXL: '44-46' },
        { name: 'Length', XS: '38-40', S: '40-42', M: '42-44', L: '44-46', XL: '46-48', XXL: '48-50' }
      ],
      tips: [
        'Kameez length should fall at your desired level',
        'Salwar should be comfortable around waist and hips',
        'Dupatta length is typically 2.5-3 meters',
        'Consider your height for proper proportions',
        'Anarkali styles may have different length requirements'
      ]
    },
    general: {
      title: 'General Size Guide',
      description: 'General measurements for Indian ethnic wear. Use this as a starting point for all traditional clothing.',
      measurements: [
        { name: 'Bust', XS: '30-32', S: '32-34', M: '34-36', L: '36-38', XL: '38-40', XXL: '40-42' },
        { name: 'Waist', XS: '26-28', S: '28-30', M: '30-32', L: '32-34', XL: '34-36', XXL: '36-38' },
        { name: 'Hip', XS: '34-36', S: '36-38', M: '38-40', L: '40-42', XL: '42-44', XXL: '44-46' },
        { name: 'Shoulder', XS: '14-15', S: '15-16', M: '16-17', L: '17-18', XL: '18-19', XXL: '19-20' }
      ],
      tips: [
        'Always measure yourself before ordering',
        'Use a flexible measuring tape',
        'Measure over light clothing, not heavy winter wear',
        'Keep the tape snug but not tight',
        'If between sizes, choose the larger size for comfort'
      ]
    }
  }

  const currentChart = sizeCharts[productType]

  const howToMeasure = [
    {
      title: 'Bust',
      description: 'Measure around the fullest part of your bust, keeping the tape horizontal.',
      icon: '👗'
    },
    {
      title: 'Waist',
      description: 'Measure around your natural waistline, keeping the tape comfortably loose.',
      icon: '📏'
    },
    {
      title: 'Hip',
      description: 'Measure around the fullest part of your hips, keeping the tape horizontal.',
      icon: '📐'
    },
    {
      title: 'Length',
      description: 'Measure from shoulder to desired length for tops, waist to desired length for bottoms.',
      icon: '📏'
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaRuler className="text-pink-500 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">{currentChart.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Description */}
        <div className="p-6 pb-4">
          <p className="text-gray-600 text-lg">{currentChart.description}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('measurements')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'measurements'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Size Chart
          </button>
          <button
            onClick={() => setActiveTab('how-to')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'how-to'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            How to Measure
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'tips'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Styling Tips
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'measurements' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Size Chart (in inches)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-pink-50">
                        <th className="border border-gray-200 p-3 text-left font-semibold text-gray-700">Measurement</th>
                        <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">XS</th>
                        <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">S</th>
                        <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">M</th>
                        <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">L</th>
                        <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">XL</th>
                        <th className="border border-gray-200 p-3 text-center font-semibold text-gray-700">XXL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentChart.measurements.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-200 p-3 font-medium text-gray-700">{row.name}</td>
                          <td className="border border-gray-200 p-3 text-center text-gray-600">{row.XS}</td>
                          <td className="border border-gray-200 p-3 text-center text-gray-600">{row.S}</td>
                          <td className="border border-gray-200 p-3 text-center text-gray-600">{row.M}</td>
                          <td className="border border-gray-200 p-3 text-center text-gray-600">{row.L}</td>
                          <td className="border border-gray-200 p-3 text-center text-gray-600">{row.XL}</td>
                          <td className="border border-gray-200 p-3 text-center text-gray-600">{row.XXL}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Size Recommendation */}
              <div className="bg-pink-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaInfoCircle className="text-pink-500" />
                  Size Recommendation
                </h4>
                <p className="text-gray-600 text-sm">
                  Based on your measurements, we recommend size <strong>{selectedSize || 'M'}</strong>. 
                  If you're between sizes, we suggest going with the larger size for comfort.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'how-to' && (
            <div className="grid md:grid-cols-2 gap-6">
              {howToMeasure.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <h4 className="font-semibold text-gray-800">{item.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
              
              <div className="md:col-span-2 bg-pink-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Pro Tips:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Use a flexible measuring tape</li>
                  <li>• Measure over light clothing, not heavy winter wear</li>
                  <li>• Keep the tape snug but not tight</li>
                  <li>• Have someone help you for more accurate measurements</li>
                  <li>• Measure yourself in the morning for most accurate results</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Styling Tips for {productType === 'saree' ? 'Sarees' : productType === 'lehenga' ? 'Lehengas' : 'Ethnic Wear'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {currentChart.tips.map((tip, index) => (
                  <div key={index} className="bg-pink-50 rounded-lg p-4">
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Our styling experts are here to help you find the perfect fit. 
                  Contact us for personalized size recommendations.
                </p>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition-colors">
                  Contact Stylist
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <p>All measurements are in inches. For centimeters, multiply by 2.54</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                Download Size Chart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeGuide

