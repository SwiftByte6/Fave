'use client'

import React, { useState } from 'react'
import { SavedAddress, useSavedAddresses } from '@/hooks/useSavedAddresses'

interface SavedAddressesProps {
  onSelectAddress: (address: SavedAddress) => void
  currentFormData?: Partial<SavedAddress>
}

const SavedAddressesSection = ({ onSelectAddress, currentFormData }: SavedAddressesProps) => {
  const { addresses, deleteAddress, updateAddress } = useSavedAddresses()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showFullList, setShowFullList] = useState(false)

  if (!addresses || addresses.length === 0) {
    return null
  }

  const displayAddresses = showFullList ? addresses : addresses.slice(0, 2)

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-lg border border-blue-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl"></span>
          Saved Addresses
        </h3>
        <span className="text-sm text-gray-600 font-medium">
          {addresses.length} saved
        </span>
      </div>

      <div className="space-y-3">
        {displayAddresses.map((address) => (
          <div
            key={address.id}
            className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer flex items-start justify-between"
              onClick={() =>
                setExpandedId(expandedId === address.id ? null : address.id)
              }
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {address.name}
                  </h4>
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {address.address}, {address.city} - {address.pincode}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(address.savedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectAddress(address)
                  }}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                >
                  Use
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedId(
                      expandedId === address.id ? null : address.id
                    )
                  }}
                  className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  title="View details"
                >
                  {expandedId === address.id ? '▼' : '▶'}
                </button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedId === address.id && (
              <div className="bg-gray-50 border-t border-gray-200 p-4 text-sm space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600 text-xs font-semibold">EMAIL</p>
                    <p className="text-gray-900">{address.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-semibold">PHONE</p>
                    <p className="text-gray-900">{address.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold">ADDRESS</p>
                  <p className="text-gray-900">{address.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600 text-xs font-semibold">CITY</p>
                    <p className="text-gray-900">{address.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-semibold">PINCODE</p>
                    <p className="text-gray-900">{address.pincode}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-200 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      updateAddress(address.id, {
                        isDefault: !address.isDefault,
                      })
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                      address.isDefault
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {address.isDefault ? '✓ Default' : 'Set as Default'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteAddress(address.id)
                      setExpandedId(null)
                    }}
                    className="flex-1 py-1.5 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {addresses.length > 2 && !showFullList && (
        <button
          onClick={() => setShowFullList(true)}
          className="mt-3 w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-100 rounded transition-colors"
        >
          Show all {addresses.length} addresses
        </button>
      )}

      {showFullList && addresses.length > 2 && (
        <button
          onClick={() => setShowFullList(false)}
          className="mt-3 w-full py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  )
}

export default SavedAddressesSection
