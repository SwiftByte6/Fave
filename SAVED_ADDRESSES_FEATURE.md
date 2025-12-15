# Saved Addresses Feature - Implementation Guide

## Overview
This feature allows users to save their checkout addresses (billing & shipping details) and quickly reuse them on future checkout attempts. Previously entered data is displayed as recommendations with the ability to select, modify, set as default, or delete.

## Architecture

### 1. **Hook: `useSavedAddresses`** ([hooks/useSavedAddresses.ts](hooks/useSavedAddresses.ts))

This custom React hook manages all address-related operations:

```typescript
const {
  addresses,           // Array of all saved addresses
  isLoading,          // Loading state while fetching from localStorage
  saveAddress,        // Function to save a new address
  updateAddress,      // Function to update an existing address
  deleteAddress,      // Function to delete an address
  getDefaultAddress,  // Get the address marked as default
  getRecentAddress,   // Get the most recently saved address
} = useSavedAddresses()
```

**Key Features:**
- ✅ Stores up to 5 addresses (configurable via `MAX_SAVED_ADDRESSES`)
- ✅ Uses browser `localStorage` for persistence
- ✅ Auto-loads default/recent address on page load
- ✅ Prevents data loss with try-catch error handling

---

### 2. **Component: `SavedAddressesSection`** ([component/SavedAddressesSection.tsx](component/SavedAddressesSection.tsx))

React component that displays saved addresses with a beautiful UI.

**Props:**
```typescript
interface SavedAddressesProps {
  onSelectAddress: (address: SavedAddress) => void  // Callback when user selects an address
  currentFormData?: Partial<SavedAddress>           // Optional: current form data
}
```

**Features:**
- 📋 Shows up to 2 addresses by default (expandable)
- ✨ Expandable cards with full address details
- 🎯 "Use" button to instantly load address into form
- ⭐ Set as default address
- 🗑️ Delete addresses
- 📅 Shows when address was saved
- 🏷️ Shows "Default" badge on default address

**UI Sections:**
1. Address list (expandable)
2. Quick actions (Use button)
3. Details view (email, phone, full address)
4. Management options (Set as default, Delete)

---

### 3. **Updated Checkout Page** ([app/checkout/page.jsx](app/checkout/page.jsx))

Integration points:

```jsx
// Import the hook and component
import SavedAddressesSection from '@/component/SavedAddressesSection'
import { useSavedAddresses } from '@/hooks/useSavedAddresses'

// Inside component
const { saveAddress, getDefaultAddress, getRecentAddress } = useSavedAddresses()

// On mount - load default or recent address
useEffect(() => {
  const defaultAddr = getDefaultAddress()
  const recentAddr = getRecentAddress()
  const addrToUse = defaultAddr || recentAddr
  
  if (addrToUse) {
    setForm({ ...addrToUse })
  }
}, [])

// Handle selecting a saved address
const handleSelectSavedAddress = (address) => {
  setForm({
    name: address.name,
    email: address.email,
    // ... other fields
  })
}

// Save address on successful order creation
if (saveCurrentAddress) {
  saveAddress({
    name: form.name,
    email: form.email,
    // ... other fields
    isDefault: false,
  })
}
```

**New Features:**
- 🔄 Automatic loading of default/recent address on page load
- 💾 Checkbox to save current address for future use
- 📍 Saved addresses section above the form
- ✅ Auto-save on successful order creation

---

## Data Structure

```typescript
interface SavedAddress {
  id: string           // Unique identifier (auto-generated)
  name: string
  email: string
  phone: string
  address: string
  city: string
  pincode: string
  country: string
  isDefault: boolean   // Only one address can be default
  savedAt: number      // Timestamp when saved
}
```

**Storage Format:**
- Stored as JSON array in `localStorage` key: `fave_saved_addresses`
- Max 5 addresses stored (older ones removed automatically)
- All data persists across browser sessions

---

## User Flow

### First-Time User
1. User fills checkout form manually
2. Sees "Save this address for future orders" checkbox (unchecked by default)
3. Completes payment
4. Address is saved automatically if checkbox was checked

### Returning User
1. User visits checkout page
2. Sees "Saved Addresses" section with up to 2 recent addresses
3. Can:
   - Click "Use" button to instantly load address
   - Expand card to see full details
   - Click "Show all X addresses" to see all saved addresses
   - Set an address as default
   - Delete unwanted addresses
4. Default/recent address is auto-loaded if no action taken

---

## Implementation Details

### LocalStorage Keys
```
fave_saved_addresses = [
  {
    id: "addr_1702553400000",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address: "123 Main St, Apartment 4B",
    city: "Mumbai",
    pincode: "400001",
    country: "India",
    isDefault: true,
    savedAt: 1702553400000
  },
  // ... more addresses
]
```

### Configuration
Located in `hooks/useSavedAddresses.ts`:
```typescript
const STORAGE_KEY = 'fave_saved_addresses'
const MAX_SAVED_ADDRESSES = 5
```

---

## Future Enhancements

### 🔒 Cloud Sync (Supabase Integration)
```typescript
// Save to database for cloud backup
await supabase
  .from('saved_addresses')
  .insert({
    user_id: userId,
    ...address
  })
```

### 🌍 Address Validation
```typescript
// Integrate with address validation API
const validateAddress = async (address) => {
  // Pin code validation
  // City/State matching
  // Format correction
}
```

### 🚀 Quick Checkout
```typescript
// Skip form entirely if address selected
if (selectedAddress) {
  proceedToPayment(selectedAddress)
}
```

### 📊 Analytics
```typescript
// Track saved address usage
trackEvent('saved_address_selected', {
  addressId,
  isDefault,
  savedDaysAgo
})
```

### 🌐 Multiple Address Types
```typescript
interface SavedAddress {
  type: 'home' | 'office' | 'other'  // Add address type
  // ...
}
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| localStorage | ✅ | ✅ | ✅ | ✅ |
| JSON stringify | ✅ | ✅ | ✅ | ✅ |
| useEffect hook | ✅ | ✅ | ✅ | ✅ |

**Limitations:**
- Works only on HTTPS (required by most modern browsers)
- Private/Incognito mode: data cleared on browser close
- Storage limit: ~5-10MB per domain

---

## Testing Checklist

- [ ] Can save address on first checkout
- [ ] Saved address appears in "Saved Addresses" section
- [ ] Clicking "Use" loads address into form
- [ ] Can expand address card to see details
- [ ] Can set address as default
- [ ] Default address auto-loads on page reload
- [ ] Can delete address
- [ ] Maximum 5 addresses stored
- [ ] Older addresses removed when exceeding limit
- [ ] Private/Incognito mode doesn't persist data
- [ ] Works on mobile and desktop
- [ ] UI responsive on all screen sizes

---

## Troubleshooting

### Addresses Not Saving
1. Check browser localStorage is enabled
2. Verify `saveCurrentAddress` checkbox is checked
3. Check browser console for errors
4. Clear browser cache and try again

### Saved Addresses Not Appearing
1. Check `STORAGE_KEY` matches in hook
2. Verify localStorage has data (open DevTools → Application → Storage)
3. Check browser privacy settings not blocking storage
4. Try clearing cache and reloading

### Address Data Corrupted
```javascript
// Reset saved addresses (in browser console)
localStorage.removeItem('fave_saved_addresses')
```

---

## Code Examples

### Manually Save Address
```typescript
const { saveAddress } = useSavedAddresses()

saveAddress({
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '9876543210',
  address: '456 Oak Street',
  city: 'Delhi',
  pincode: '110001',
  country: 'India',
  isDefault: false
})
```

### Get Default Address
```typescript
const { getDefaultAddress } = useSavedAddresses()

const defaultAddr = getDefaultAddress()
if (defaultAddr) {
  console.log(`Default address: ${defaultAddr.name}`)
}
```

### Delete Address
```typescript
const { deleteAddress } = useSavedAddresses()

deleteAddress('addr_1702553400000')
```

---

## Performance Notes

- ✅ No external API calls (uses only localStorage)
- ✅ Fast address lookup (Array operations)
- ✅ Minimal re-renders (using useCallback)
- ✅ Automatic cleanup of old addresses
- ⚠️ localStorage has 5-10MB limit per domain
- ⚠️ Each address ~500 bytes, so 10+ addresses use significant space

---

## Security Considerations

⚠️ **Important**: Data stored in localStorage is:
- **Not encrypted** - visible in DevTools
- **Per-domain** - only accessible from your domain
- **Accessible to JavaScript** - XSS attacks can access it
- **Not transmitted** - stays only on user's device

**Recommendations:**
- Don't store sensitive payment info (credit cards)
- Consider encryption for sensitive data
- Educate users about clearing data on shared devices
- Add logout functionality that clears addresses if needed
- Use HTTPS exclusively

---

## Migration from Old System

If you had addresses stored differently:

```typescript
// Migrate old addresses to new format
const oldAddresses = JSON.parse(localStorage.getItem('old_key'))
const migratedAddresses = oldAddresses.map((addr, idx) => ({
  ...addr,
  id: `addr_${Date.now() + idx}`,
  savedAt: Date.now(),
  isDefault: idx === 0
}))
localStorage.setItem('fave_saved_addresses', JSON.stringify(migratedAddresses))
```
