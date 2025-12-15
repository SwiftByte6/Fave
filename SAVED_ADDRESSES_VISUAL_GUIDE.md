# Saved Addresses Feature - Visual Guide

## User Journey Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CHECKOUT PAGE FLOW                        │
└─────────────────────────────────────────────────────────────┘

FIRST TIME USER                          RETURNING USER
─────────────────                        ──────────────

1. Visit /checkout              1. Visit /checkout
   ↓                               ↓
2. Page Loads                   2. Page Loads
   ↓                               ↓
3. No saved addresses           3. useSavedAddresses Hook
   ↓                               ↓
4. Empty form shown             4. Check for Default/Recent
   ↓                               ↓
5. User fills form              5. Auto-fill with Default/Recent
   (name, email, address...)       ↓
   ↓                           6. SavedAddressesSection Component
6. "Save address?" checkbox         shows up to 2 recent addresses
   appears                         ↓
   ↓                           7. User can:
7. (optional) Check box            • Click "Use" to load another
   ↓                               • Expand to see full details
8. Submit Order                     • Set as default
   ↓                               • Delete address
9. saveAddress() called            ↓
   ↓                           8. User fills/modifies form
10. Stored in localStorage          ↓
    (JSON format)               9. Submit Order
    ↓                               ↓
11. localStorage now has         10. Saves address if checkbox
    1 address                        ↓
                                11. localStorage now has
                                    new address added
```

---

## Component Architecture

```
┌──────────────────────────────────────────────────────────┐
│                 /app/checkout/page.jsx                    │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │         useSavedAddresses() Hook                   │  │
│  │ • Load from localStorage                           │  │
│  │ • Manage save/delete/update                        │  │
│  └────────────────────────────────────────────────────┘  │
│                          ↓                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │    SavedAddressesSection Component                 │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │ Saved Addresses (showing 2 of 5)             │  │  │
│  │  │                                              │  │  │
│  │  │ ┌─ Address Card 1 ──────────────────────┐   │  │  │
│  │  │ │ John Doe, Mumbai 400001               │   │  │  │
│  │  │ │ [Use] [Details]                       │   │  │  │
│  │  │ └────────────────────────────────────────┘   │  │  │
│  │  │                                              │  │  │
│  │  │ ┌─ Address Card 2 ──────────────────────┐   │  │  │
│  │  │ │ Jane Doe, Delhi 110001 [Default]     │   │  │  │
│  │  │ │ [Use] [Details]                       │   │  │  │
│  │  │ └────────────────────────────────────────┘   │  │  │
│  │  │                                              │  │  │
│  │  │ [Show all 5 addresses]                       │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                          ↓                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Billing & Shipping Details Form                  │  │
│  │                                                    │  │
│  │  [Name]              [Email]                      │  │
│  │  [Phone]             [City]                       │  │
│  │  [Address............................]            │  │
│  │  [Pincode]           [Country]                    │  │
│  │                                                    │  │
│  │  ☐ Save address for future orders                 │  │
│  │                                                    │  │
│  │  [Proceed to Payment]                             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │      Order Summary (Cart Items, Total)             │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Data Storage (localStorage)             │
│                                                          │
│  {                                                      │
│    "fave_saved_addresses": [                           │
│      {                                                  │
│        "id": "addr_1702553400000",                     │
│        "name": "John Doe",                             │
│        "email": "john@example.com",                    │
│        "phone": "9876543210",                          │
│        "address": "123 Main St",                       │
│        "city": "Mumbai",                               │
│        "pincode": "400001",                            │
│        "country": "India",                             │
│        "isDefault": true,                              │
│        "savedAt": 1702553400000                        │
│      },                                                │
│      {...more addresses...}                            │
│    ]                                                   │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
              ↑              ↓              ↑
        On Page Load   On Save Action   On Delete
              
              
┌──────────────────────────────────────────────────────────┐
│              useSavedAddresses() Hook                     │
│                                                           │
│  const {                                                 │
│    addresses,          // [address, address, ...]      │
│    isLoading,         // boolean                         │
│    saveAddress,       // (addr) => SavedAddress         │
│    updateAddress,     // (id, updates) => void          │
│    deleteAddress,     // (id) => void                   │
│    getDefaultAddress, // () => SavedAddress | undefined│
│    getRecentAddress   // () => SavedAddress | undefined│
│  } = useSavedAddresses()                               │
│                                                           │
└──────────────────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────────────────┐
│          React Component State                            │
│                                                           │
│  const [form, setForm] = useState({                      │
│    name: '',                                             │
│    email: '',                                            │
│    phone: '',                                            │
│    address: '',                                          │
│    city: '',                                             │
│    pincode: '',                                          │
│    country: ''                                           │
│  })                                                      │
│                                                           │
│  const [saveCurrentAddress, setSaveCurrentAddress] =     │
│    useState(false)                                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
              ↓
        On Submit Order
              ↓
   Save to Supabase (orders table)
              ↓
   If saveCurrentAddress = true
              ↓
   Call saveAddress(form)
              ↓
   Store in localStorage
              ↓
   Show success toast message
```

---

## Address Card States

```
COLLAPSED STATE
┌──────────────────────────────────────────────┐
│ John Doe, Mumbai - 400001              ⭐    │
│ Saved on Jan 15, 2024                        │
│                                              │
│ [Use Button]              [▼ Expand Button]  │
└──────────────────────────────────────────────┘

EXPANDED STATE
┌──────────────────────────────────────────────┐
│ John Doe, Mumbai - 400001              ⭐    │
│ Saved on Jan 15, 2024                        │
│                                              │
│ [Use Button]              [▲ Collapse Button]│
│                                              │
├──────────────────────────────────────────────┤
│ EMAIL                                        │
│ john@example.com                             │
│                                              │
│ PHONE              │   CITY                  │
│ 9876543210        │   Mumbai                │
│                                              │
│ ADDRESS                                      │
│ 123 Main Street, Apartment 4B                │
│                                              │
│ CITY               │   PINCODE               │
│ Mumbai            │   400001                │
│                                              │
│ [Set as Default]      [Delete]               │
└──────────────────────────────────────────────┘

DEFAULT ADDRESS (Badge shown)
┌──────────────────────────────────────────────┐
│ Jane Doe, Delhi - 110001  [Default] ✓        │
│ Saved on Jan 10, 2024                        │
│                                              │
│ [Use Button]              [▼ Expand Button]  │
└──────────────────────────────────────────────┘
```

---

## Conditional Rendering Logic

```
SavedAddresses Section Visible?
        ↓
    Yes (if addresses.length > 0)
        ↓
    ┌─────────────────────────────────────┐
    │ Show SavedAddressesSection Component │
    └─────────────────────────────────────┘
    
    No (if addresses.length === 0)
        ↓
    ┌──────────────────────────┐
    │ Don't show component     │
    │ (return null)            │
    └──────────────────────────┘


Display Addresses?
        ↓
    If showFullList = false
        ↓
    Show first 2 addresses only
        ↓
    Show "Show all X addresses" button
        ↓
    
    If showFullList = true
        ↓
    Show all addresses (max 5)
        ↓
    Show "Show less" button
```

---

## Address Lifecycle

```
CREATION
  ↓
  User fills checkout form
  ↓
  User checks "Save this address"
  ↓
  User clicks "Proceed to Payment"
  ↓
  Order created successfully
  ↓
  saveAddress() called with form data
  ↓
  New address created with:
    • Unique ID (addr_timestamp)
    • All form fields
    • isDefault = false
    • savedAt = current timestamp
  ↓
  Stored in localStorage
  ↓
  Toast message: "Order created!"

                    ↓

USAGE
  ↓
  User visits checkout page again
  ↓
  useSavedAddresses loads addresses
  ↓
  SavedAddressesSection shows addresses
  ↓
  User clicks "Use" on an address
  ↓
  Form auto-filled with selected address
  ↓
  User can modify and checkout again

                    ↓

MANAGEMENT
  ↓
  User expands address card
  ↓
  Can:
    • Set as Default - marks isDefault = true
    • Delete - removes from localStorage
    • View Details - see full information

                    ↓

DELETION
  ↓
  User clicks Delete button
  ↓
  Address removed from array
  ↓
  localStorage updated
  ↓
  UI re-renders without deleted address
```

---

## Key Features Visualization

```
FEATURE 1: Auto-Load Default/Recent
┌────────────────────────────────────┐
│ Page Load → Check localStorage      │
│      ↓                               │
│ getDefaultAddress() → Found?         │
│      ↓Yes                 ↓No        │
│   Use It        getRecentAddress()  │
│                      ↓Found?         │
│                 ↓Yes        ↓No      │
│                Use It    Empty Form  │
└────────────────────────────────────┘

FEATURE 2: Show "Save Address" Checkbox
┌────────────────────────────────────┐
│ After form inputs:                 │
│                                    │
│ ☐ Save this address for future...  │
│                                    │
│ (Initially unchecked, user decides)│
└────────────────────────────────────┘

FEATURE 3: Save on Order Success
┌────────────────────────────────────┐
│ Order Created? → Yes                │
│        ↓                             │
│ saveCurrentAddress = true?           │
│        ↓Yes              ↓No         │
│ Call saveAddress()    Skip save      │
│        ↓                             │
│ Store in localStorage                │
│        ↓                             │
│ Add to array (max 5)                 │
│        ↓                             │
│ Update UI                            │
└────────────────────────────────────┘

FEATURE 4: Max 5 Addresses
┌────────────────────────────────────┐
│ When saving new address:            │
│        ↓                             │
│ addressCount = 5?                   │
│        ↓Yes              ↓No         │
│ Remove oldest   Just add new        │
│        ↓                 ↓           │
│      Keep 5        Now have N+1     │
│      total         (up to 5)        │
└────────────────────────────────────┘

FEATURE 5: Set Default
┌────────────────────────────────────┐
│ User clicks "Set as Default":       │
│        ↓                             │
│ Current default? → Mark as false    │
│        ↓                             │
│ New address? → Mark as true         │
│        ↓                             │
│ Update localStorage                 │
│        ↓                             │
│ UI updates with badge               │
└────────────────────────────────────┘
```

---

## Mobile Responsive Layout

```
DESKTOP (MD breakpoint and above)
┌────────────────────────────────────────────────┐
│     SAVED ADDRESSES SECTION (65% width)        │
│ ┌──────────────────────────────────────────┐   │
│ │ Saved Addresses                          │   │
│ │ ┌────────────────────────────────────┐   │   │
│ │ │ Address 1              [Use] [▼]   │   │   │
│ │ └────────────────────────────────────┘   │   │
│ │ ┌────────────────────────────────────┐   │   │
│ │ │ Address 2              [Use] [▼]   │   │   │
│ │ └────────────────────────────────────┘   │   │
│ └──────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────┐   │
│ │ Billing & Shipping Form                  │   │
│ │ [Input 1]          [Input 2]             │   │
│ │ [Input 3]          [Input 4]             │   │
│ │ [Textarea..................]             │   │
│ │ [Input 5]          [Input 6]             │   │
│ │ [Checkbox]                               │   │
│ │ [Submit Button]                          │   │
│ └──────────────────────────────────────────┘   │
├────────────────────────────────────────────────┤
│    ORDER SUMMARY (35% width)                   │
│ ┌──────────────────────────────────────────┐   │
│ │ Order Summary                            │   │
│ │ Item 1 ....................... ₹500     │   │
│ │ Item 2 ....................... ₹800     │   │
│ │ ─────────────────────────────────────── │   │
│ │ Total ......................... ₹1300   │   │
│ │ [Proceed to Payment]                     │   │
│ └──────────────────────────────────────────┘   │
└────────────────────────────────────────────────┘

MOBILE (Below MD breakpoint)
┌────────────────────────────┐
│ Saved Addresses            │
│ ┌─────────────────────────┐│
│ │ Address 1      [Use]    ││
│ └─────────────────────────┘│
│ ┌─────────────────────────┐│
│ │ Address 2      [Use]    ││
│ └─────────────────────────┘│
├────────────────────────────┤
│ Billing & Shipping Form    │
│ ┌─────────────────────────┐│
│ │ [Full Width Input 1]    ││
│ │ [Full Width Input 2]    ││
│ │ [Full Width Textarea]   ││
│ │ [Full Width Input 3]    ││
│ │ [Checkbox]              ││
│ │ [Submit Button]         ││
│ └─────────────────────────┘│
├────────────────────────────┤
│ Order Summary              │
│ ┌─────────────────────────┐│
│ │ Item 1 ........... ₹500││
│ │ Item 2 ........... ₹800││
│ │ Total ........... ₹1300││
│ │ [Proceed]              ││
│ └─────────────────────────┘│
└────────────────────────────┘
```

