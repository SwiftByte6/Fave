import { useState, useEffect, useCallback } from 'react'

export interface SavedAddress {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
  country: string
  isDefault: boolean
  savedAt: number
}

const STORAGE_KEY = 'fave_saved_addresses'
const MAX_SAVED_ADDRESSES = 5

export const useSavedAddresses = () => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load addresses from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setAddresses(Array.isArray(parsed) ? parsed : [])
      }
    } catch (error) {
      console.error('Error loading saved addresses:', error)
      setAddresses([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save new address
  const saveAddress = useCallback(
    (address: Omit<SavedAddress, 'id' | 'savedAt'>) => {
      try {
        const newAddress: SavedAddress = {
          ...address,
          id: `addr_${Date.now()}`,
          savedAt: Date.now(),
        }

        setAddresses((prev) => {
          // Remove previous default if this is marked as default
          let updated = prev
          if (newAddress.isDefault) {
            updated = prev.map((addr) => ({
              ...addr,
              isDefault: false,
            }))
          }

          // Add new address and keep only latest 5
          const withNew = [newAddress, ...updated].slice(0, MAX_SAVED_ADDRESSES)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(withNew))
          return withNew
        })

        return newAddress
      } catch (error) {
        console.error('Error saving address:', error)
        return null
      }
    },
    []
  )

  // Update existing address
  const updateAddress = useCallback((id: string, updates: Partial<SavedAddress>) => {
    try {
      setAddresses((prev) => {
        const updated = prev.map((addr) => {
          if (addr.id === id) {
            return {
              ...addr,
              ...updates,
              id: addr.id, // Don't allow changing ID
              savedAt: addr.savedAt, // Don't allow changing savedAt
            }
          }
          // If updating to set as default, unset other defaults
          if (updates.isDefault && updates.isDefault === true) {
            return { ...addr, isDefault: false }
          }
          return addr
        })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    } catch (error) {
      console.error('Error updating address:', error)
    }
  }, [])

  // Delete address
  const deleteAddress = useCallback((id: string) => {
    try {
      setAddresses((prev) => {
        const filtered = prev.filter((addr) => addr.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        return filtered
      })
    } catch (error) {
      console.error('Error deleting address:', error)
    }
  }, [])

  // Get default address
  const getDefaultAddress = useCallback(() => {
    return addresses.find((addr) => addr.isDefault)
  }, [addresses])

  // Get recently used address (most recent)
  const getRecentAddress = useCallback(() => {
    return addresses[0] || null
  }, [addresses])

  return {
    addresses,
    isLoading,
    saveAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress,
    getRecentAddress,
  }
}
