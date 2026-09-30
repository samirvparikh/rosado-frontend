# ROSADO PERFUME — Premium E-Commerce + Custom Perfume Builder

Build a production-ready, premium luxury perfume e-commerce web application for **ROSADO PERFUME**.

The application must be designed from the attached ROSADO PERFUME business and technical specification. Do not simplify the Custom Perfume Builder into a normal product-selection flow.

The primary customer experience is:

**Discover → Explore → Customize → Preview → Add to Cart → Checkout → Order**

The website must feel like a premium fragrance brand rather than a generic e-commerce catalog.

---

# 1. TECH STACK

Build the frontend using:

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Modern component architecture
* Responsive design
* Context API or Zustand for cart/custom-builder state
* Axios or fetch-based API service layer
* React Hook Form for forms
* Proper loading, error and empty states

Architecture must be API-ready.

Initially use realistic mock data, but structure every service so that it can later connect to a real backend API.

Do not tightly couple UI components to mock data.

---

# 2. BRAND / DESIGN DIRECTION

Brand:

**ROSADO PERFUME**

Positioning:

Premium luxury fragrance brand.

The UI should communicate:

* Luxury
* Elegance
* Premium fragrance
* Minimalism
* Sophistication
* High-quality product photography
* Smooth customization experience

Avoid:

* Generic Shopify-style appearance
* Overly colorful UI
* Cheap-looking cards
* Excessive gradients
* Excessive animation
* Cluttered interfaces

Use a refined luxury visual system.

Suggested design direction:

* Warm white / ivory backgrounds
* Deep charcoal / black typography
* Soft neutral tones
* Subtle gold/rose-gold accents
* Large perfume imagery
* Elegant typography
* Generous whitespace
* Rounded but sophisticated cards
* Premium micro-interactions

Create reusable design tokens for:

* Colors
* Typography
* Spacing
* Border radius
* Shadows
* Buttons
* Cards

---

# 3. MAIN NAVIGATION

Desktop header:

ROSADO logo

Navigation:

* HOME
* SHOP
* MEN
* WOMEN
* UNISEX
* CUSTOM PERFUME
* ABOUT ROSADO
* CONTACT

Right side:

* Search
* Wishlist
* Account
* Cart

Mobile:

Use a clean mobile menu/drawer.

Cart should display an item count.

---

# 4. HOME PAGE

Create a premium luxury homepage.

## Hero Section

Large perfume visual.

Headline:

**Your Fragrance. Your Bottle. Your ROSADO.**

Primary CTA:

**Create Your Perfume**

Secondary CTA:

**Shop Perfumes**

Use premium animation and image reveal effects.

---

## Featured Collection

Display premium product cards containing:

* Product image
* Product name
* Short fragrance description
* Price
* Rating
* Add to Cart
* Wishlist

---

## Custom Perfume Builder Feature

This must be one of the most visually prominent homepage sections.

Show the concept:

**Choose → Customize → Create**

CTA:

**Build Your Perfume**

The section should visually communicate that customers can create their own perfume.

---

## Fragrance Categories

Display:

* Fresh
* Woody
* Floral
* Oriental
* Citrus
* Sweet
* Musky
* Oud

Each category should have a premium visual card.

---

## Best Sellers

Display premium product cards.

---

## Why ROSADO?

Show:

* Premium Fragrances
* Carefully Selected Ingredients
* Customizable Perfumes
* Premium Packaging
* Quality-focused

---

## Reviews

Create customer testimonial/review section.

---

## Brand Story

Premium visual section introducing ROSADO.

---

## Footer

Include:

* Shop
* Custom Perfume
* About
* Contact
* Privacy Policy
* Terms & Conditions
* Shipping Policy
* Return Policy
* Social Media
* Newsletter

---

# 5. SHOP PAGE

Create a premium product listing page.

Filters:

### Audience

* Men
* Women
* Unisex

### Fragrance Family

* Woody
* Floral
* Fresh
* Citrus
* Fruity
* Sweet / Gourmand
* Oud
* Musky
* Aquatic
* Amber
* Spicy
* Green

### Occasion

* Everyday Wear
* Office Wear
* Date Night
* Party & Events
* Wedding
* Formal
* Casual
* Travel
* Special Occasions

### Season

* Summer
* Winter
* Monsoon
* Spring
* All Season

### Time

* Day
* Evening
* Night
* All Day

### Performance

* Light
* Moderate
* Strong
* Intense

### Size

* 30 ML
* 50 ML
* 100 ML

### Price

Dynamic price range.

Additional filters:

* Best Seller
* New Arrival
* Featured
* Sale

Sorting:

* Featured
* Price Low → High
* Price High → Low
* Newest
* Best Selling

Support multiple filters simultaneously.

---

# 6. PRODUCT CARD

Create reusable ProductCard component.

Display:

* Product image
* Product name
* Short description
* Price
* Rating
* Wishlist button
* Add to Cart button
* Badge where applicable

Possible badges:

* New
* Best Seller
* Featured
* Limited Edition
* Trending
* Sale

Do NOT make Bottle or Cap cards behave like products.

---

# 7. PRODUCT DETAIL PAGE

Route:

`/perfumes/:slug`

Layout:

Left:

* Large image
* Thumbnail gallery
* Image zoom
* Lifestyle images
* Packaging images

Right:

* Product name
* Rating
* Price
* Available sizes
* Fragrance family
* Description
* Fragrance notes
* Quantity
* Add to Cart
* Buy Now
* Wishlist

Fragrance Notes:

### TOP NOTES

Bergamot
Lemon

### HEART NOTES

Rose
Jasmine

### BASE NOTES

Musk
Amber

Display notes visually using premium cards/icons.

---

# 8. CUSTOM PERFUME BUILDER

This is the MOST IMPORTANT feature.

Route:

`/custom-perfume`

Create a beautiful multi-step wizard.

Steps:

1. Choose Size
2. Choose Fragrance
3. Customize Bottle
4. Choose Cap
5. Preview
6. Add to Cart

Show a progress indicator.

Example:

● Size
────
○ Fragrance
────
○ Bottle
────
○ Cap
────
○ Preview

Always display:

* Current step
* Selected options
* Current price
* Continue button
* Back button

On mobile, make the price/summary sticky at the bottom.

---

# 9. BUILDER STATE

Maintain one configuration object:

```ts
interface CustomPerfumeConfiguration {
  size: Size | null;
  fragrance: Fragrance | null;
  bottle: Bottle | null;
  cap: Cap | null;
  basePrice: number;
  bottlePrice: number;
  capPrice: number;
  totalPrice: number;
}
```

The state must persist while navigating between builder steps.

---

# 10. BUILDER STEP 1 — SIZE

Display:

* 30 ML
* 50 ML
* 100 ML

The selected size becomes the base configuration.

Example:

Customer selects:

**50 ML**

This SizeID must be used to filter bottles.

---

# 11. BUILDER STEP 2 — FRAGRANCE

Display fragrance cards.

Each card should contain:

* Image
* Name
* Fragrance family
* Short description
* Notes
* Price / price impact

Example:

**Woody Oud**

Woody · Warm · Long Lasting

Show top / heart / base notes.

---

# 12. BUILDER STEP 3 — BOTTLE

This is a CRITICAL BUSINESS RULE.

Bottle is NOT a product.

Bottle is a component of a Custom Perfume.

When customer selects:

**50 ML**

Only bottles with:

```text
Bottle.SizeID = selected SizeID
AND Bottle.Status = Active
```

can be displayed.

Example:

50 ML selected:

* Premium Glass 50 ML
* Classic Glass 50 ML

Do NOT show:

* 30 ML bottles
* 100 ML bottles

If the customer changes:

50 ML → 100 ML

then:

1. Reload bottle list.
2. Remove incompatible selected bottle.
3. Reset bottle selection.
4. Display only 100 ML bottles.

Never allow an incompatible bottle to remain selected.

---

# 13. BOTTLE MASTER

Bottle data structure:

```ts
interface Bottle {
  id: string;
  name: string;
  code: string;
  image: string;
  sizeId: string;
  additionalPrice: number;
  stock: number;
  status: "ACTIVE" | "INACTIVE";
  sortOrder: number;
}
```

Bottle is NEVER directly added to cart.

There must be NO:

"Add Bottle to Cart"

button.

Bottle only exists inside Custom Perfume configuration.

---

# 14. BUILDER STEP 4 — CAP

Display active caps.

Example:

* Classic Black
* Premium Gold
* Modern Silver

Each cap:

* ID
* Name
* Image
* Additional price
* Stock
* Status
* Sort order

Cap is also NOT a product.

There must be NO:

"Add Cap to Cart"

button.

Cap only belongs to a Custom Perfume configuration.

---

# 15. FUTURE CAP COMPATIBILITY

Design the architecture so that cap-size compatibility can be added later.

Support an optional relationship:

```text
CapSizeMapping
----------------
CapID
SizeID
Status
```

Initially caps may be available for all sizes.

Do not hard-code compatibility logic into React.

---

# 16. BUILDER STEP 5 — PREVIEW

Before adding the configuration to cart, display:

# YOUR CUSTOM PERFUME

Size:

50 ML

Fragrance:

Woody Oud

Bottle:

Premium Glass 50 ML

Cap:

Classic Black

Price breakdown:

Base Perfume: ₹399
Bottle: ₹50
Cap: ₹0
-------

Total: ₹449

Button:

**Add to Cart**

Price must update dynamically whenever the configuration changes.

---

# 17. CUSTOM CART ITEM

Do NOT store only:

```text
Custom Perfume - ₹449
```

Store the complete configuration.

Example:

```json
{
  "productType": "CUSTOM_PERFUME",
  "fragranceId": "FRG001",
  "sizeId": "SIZE50",
  "bottleId": "BTL002",
  "capId": "CAP001",
  "basePrice": 399,
  "bottlePrice": 50,
  "capPrice": 0,
  "finalPrice": 449,
  "quantity": 1
}
```

The cart UI should clearly show:

CUSTOM ROSADO PERFUME

50 ML

Woody Oud

Premium Glass Bottle

Classic Black Cap

₹449

Qty: 1

Customer must be able to understand exactly what they configured.

---

# 18. NORMAL PRODUCT CART

Ready-made perfume should work normally.

Example:

ROSADO Royal Oud

50 ML

₹499

Qty: 1

Normal products:

Product → Add to Cart → Checkout

---

# 19. CART PAGE

Create a premium cart page.

Show:

* Product image
* Product name
* Product type
* Size
* Configuration
* Quantity
* Unit price
* Total
* Remove
* Wishlist / Save
* Continue Shopping

For custom products show:

* Fragrance
* Bottle
* Cap
* Size

Do not expose Bottle/Cap as independent cart products.

---

# 20. CHECKOUT

Create a clean multi-section checkout.

Customer information:

* Full Name
* Mobile
* Email
* Address
* City
* State
* Pincode

Checkout sections:

1. Customer Details
2. Shipping Address
3. Shipping Method
4. Coupon
5. Payment
6. Order Summary

Show complete custom perfume configuration inside order summary.

---

# 21. ORDER

For custom perfume order, backend/order system must preserve:

```text
Order Number
Product Type
Product Name
Size
Fragrance
Bottle
Cap
Quantity
Base Price
Bottle Price
Cap Price
Discount
Tax
Shipping
Final Price
```

Example:

```text
Order #ROS10025

Product Type:
CUSTOM_PERFUME

Size:
50 ML

Fragrance:
Woody Oud

Bottle:
Premium Glass 50 ML

Cap:
Classic Black

Quantity:
1

Final Price:
₹449
```

---

# 22. ORDER SNAPSHOT

This is extremely important.

When an order is placed, store a snapshot of the configuration.

Do NOT depend on current master data.

For example:

Today:

Premium Gold Cap = ₹50

Customer orders it.

Later:

Premium Gold Cap = ₹100

The old order must still display:

Premium Gold Cap = ₹50

Therefore OrderItem should store:

```text
ProductName
SizeName
FragranceName
BottleName
CapName
BasePrice
BottlePrice
CapPrice
Discount
Tax
FinalPrice
```

Historical orders must never change because master data changed.

---

# 23. INVENTORY

Bottle and Cap are not customer-facing products.

However, they MUST have inventory.

Bottle inventory:

```text
BottleID
CurrentStock
ReservedStock
AvailableStock
ReorderLevel
Status
```

Cap inventory:

```text
CapID
CurrentStock
ReservedStock
AvailableStock
ReorderLevel
Status
```

Future support should allow fragrance/raw-material inventory.

---

# 24. PRODUCT DATA ARCHITECTURE

Do NOT put everything into one Product table.

Use separate masters.

Core masters:

* Product Master
* Product Size
* Fragrance Master
* Fragrance Notes
* Size Master
* Bottle Master
* Cap Master
* Category Master
* Fragrance Family Master
* Occasion Master
* Season Master
* Time of Day Master
* Intensity Master
* Longevity Master
* Scent Character Master
* Collection Master
* Product Images

Use IDs and relationships.

Avoid storing classification data as arbitrary free text.

---

# 25. PRODUCT MASTER

Fields:

```text
ProductID
SKU
ProductName
Slug
ProductType
ShortDescription
Description
Brand
Status
BasePrice
SalePrice
CostPrice
MRP
TaxRate
DiscountType
DiscountValue
```

Product types initially:

```text
READY_MADE
CUSTOM_PERFUME
```

Architecture should allow future:

```text
GIFT_SET
BUNDLE
LIMITED_EDITION
```

---

# 26. PRODUCT SIZE

Create separate ProductSize relation.

```text
ProductSizeID
ProductID
SizeID
SKU
MRP
SellingPrice
CostPrice
Stock
Status
```

A product can have multiple sizes.

Example:

Royal Oud:

30 ML → ₹299
50 ML → ₹499
100 ML → ₹799

---

# 27. FRAGRANCE MASTER

Fields:

```text
FragranceID
FragranceName
Slug
ShortDescription
Description
Gender
Status
Image
```

Fragrance should be independent from Product.

---

# 28. FRAGRANCE NOTES

Create Note Master:

```text
NoteID
NoteName
NoteType
Image
Status
```

NoteType:

```text
TOP
HEART
BASE
```

Create mapping:

```text
FragranceNote
----------------
FragranceID
NoteID
NoteType
SortOrder
```

Example:

Royal Oud:

TOP:

* Bergamot
* Lemon

HEART:

* Rose
* Cinnamon

BASE:

* Oud
* Amber
* Musk

---

# 29. PRODUCT CLASSIFICATION

Products must support multiple values for:

* Audience
* Fragrance Family
* Occasion
* Season
* Time of Day
* Intensity
* Longevity
* Scent Character
* Collection

Do NOT use a single field such as:

```text
Occasion = Wedding
```

Instead use mapping tables.

Example:

```text
Product
  ↓
ProductOccasion
  ↓
Occasion
```

Same concept for:

* ProductFragranceFamily
* ProductSeason
* ProductTimeOfDay
* ProductIntensity
* ProductCollection

---

# 30. PRODUCT IMAGES

Create a separate ProductImage model.

Fields:

```text
ProductImageID
ProductID
ImageURL
ImageType
SortOrder
IsPrimary
Status
```

Image types:

* MAIN
* GALLERY
* LIFESTYLE
* PACKAGING
* DETAIL

---

# 31. PRODUCT BADGES

Do not make badges separate product categories.

Use flags:

```text
IsNewArrival
IsBestSeller
IsFeatured
IsLimitedEdition
IsTrending
IsSale
```

---

# 32. CUSTOM PERFUME CONFIGURATION

Create:

```text
CustomPerfumeConfigurationID
SizeID
FragranceID
BottleID
CapID
BasePrice
BottlePrice
CapPrice
TotalPrice
Status
```

Future optional fields:

```text
CustomName
PersonalMessage
GiftPackaging
```

---

# 33. API ARCHITECTURE

Create a clean API service layer.

Expected endpoints:

```text
GET /api/products
GET /api/products/:id
GET /api/fragrances
GET /api/bottles?size=50ML
GET /api/caps
POST /api/cart
POST /api/orders
```

Additional recommended endpoints:

```text
GET /api/sizes
GET /api/categories
GET /api/fragrance-families
GET /api/occasions
GET /api/seasons
GET /api/time-of-day
GET /api/intensities
GET /api/collections
GET /api/products/:id/recommendations
POST /api/custom-perfume/validate
POST /api/custom-perfume/price
```

The frontend must not calculate final order pricing as the source of truth.

---

# 34. SECURITY

NEVER trust frontend values for:

* Price
* Stock
* Bottle availability
* Cap availability
* Product availability
* Discount
* Tax
* Shipping
* Final order amount

Backend must validate everything.

Example attack:

User selects:

50 ML

Frontend displays:

50 ML Bottle A

But malicious user sends:

```text
sizeId = 50ML
bottleId = 100ML bottle
```

Backend MUST reject this.

Validation:

```text
Bottle.SizeID === SelectedSizeID
```

If cap compatibility is enabled:

```text
Cap is compatible with SelectedSizeID
```

must also be validated.

Backend must recalculate:

```text
Product
+
Size
+
Fragrance
+
Bottle
+
Cap
+
Quantity
+
Discount
+
Tax
+
Shipping
=
Final Order Amount
```

Never accept final price directly from browser.

---

# 35. RESPONSIVE DESIGN

Support:

Desktop:

* 1440px+
* 1280px
* 1024px

Tablet:

* 768px+

Mobile:

* 320px
* 375px
* 390px
* 430px

Mobile experience is extremely important.

The Custom Perfume Builder must work smoothly on mobile.

Use sticky bottom summary on mobile where appropriate.

---

# 36. ANIMATIONS

Use subtle premium animations:

* Product hover
* Image zoom
* Page transitions
* Builder step transitions
* Add-to-cart animation
* Scroll reveal
* Image transitions

Do NOT over-animate.

Performance must remain fast.

---

# 37. PERFORMANCE

Implement:

* Lazy loading
* Optimized images
* WebP / AVIF where appropriate
* Code splitting
* API caching
* Minimal unnecessary React re-renders
* Responsive images
* Loading states
* Skeleton loaders

---

# 38. SEO

Every important page should support:

* SEO title
* Meta description
* Canonical URL
* Open Graph image
* Proper H1/H2 structure
* Product schema
* Breadcrumbs
* Image alt text
* SEO-friendly URLs

Examples:

```text
/perfumes/woody-oud
/custom-perfume
/shop
```

---

# 39. ACCOUNT

Create:

* Login
* Register
* Forgot Password
* My Account
* Profile
* Addresses
* Wishlist
* Orders
* Order Details

Order details must show the exact custom configuration.

---

# 40. SEARCH

Create global product search.

Search by:

* Product name
* Fragrance
* Fragrance family
* Notes
* Collection

Create a premium search overlay/modal.

---

# 41. WISHLIST

Users can add ready-made perfumes to wishlist.

Custom configurations may optionally support save-for-later in the future.

Do not make Bottle or Cap individually wish-listable products.

---

# 42. FIND YOUR FRAGRANCE

Architect the application so a future feature can be added:

**Find Your Fragrance**

Questions:

1. Who are you shopping for?

   * Men
   * Women
   * Unisex

2. What fragrance do you like?

   * Fresh
   * Woody
   * Floral
   * Sweet
   * Oud

3. When will you wear it?

   * Everyday
   * Office
   * Date
   * Party
   * Wedding

4. Which time?

   * Day
   * Evening
   * Night

5. What intensity?

   * Light
   * Moderate
   * Strong
   * Intense

6. Which season?

   * Summer
   * Winter
   * All Season

The recommendation engine should use product attributes and be replaceable/extendable later.

Do not implement complex AI recommendations in V1 unless required.

---

# 43. ADMIN-READY ARCHITECTURE

Even if the admin UI is not implemented initially, structure APIs/models for future administration of:

## Products

* Name
* Images
* Price
* Sizes
* Description
* Notes
* Category
* Status

## Bottle Master

* Bottle name
* Image
* Size
* Price
* Stock
* Status

## Cap Master

* Cap name
* Image
* Price
* Stock
* Status

## Fragrance Master

* Name
* Description
* Fragrance family
* Notes
* Price
* Status

---

# 44. COMPONENT STRUCTURE

Use reusable components.

Suggested structure:

```text
src/
  components/
    Header/
    Footer/
    ProductCard/
    ProductGallery/
    Rating/
    WishlistButton/
    AddToCartButton/
    Price/
    FilterSidebar/
    Search/
    Cart/
    Checkout/

  pages/
    Home/
    Shop/
    ProductDetails/
    CustomPerfume/
    Cart/
    Checkout/
    Login/
    Account/

  custom-builder/
    SizeStep/
    FragranceStep/
    BottleStep/
    CapStep/
    PreviewStep/
    BuilderProgress/
    BuilderSummary/

  services/
    productApi
    cartApi
    orderApi
    customerApi
    customPerfumeApi

  context/
    CartContext
    AuthContext
    CustomPerfumeContext

  hooks/
    useCart
    useAuth
    useCustomPerfume

  utils/
    price
    validation
    formatCurrency

  types/
    product
    fragrance
    bottle
    cap
    cart
    order
    customPerfume

  assets/
```

---

# 45. IMPORTANT UX RULES

The Custom Builder should always make it obvious:

**What did I select?**

**What is my current price?**

**What is my next step?**

Never allow the customer to become confused.

If required selection is missing:

Disable Continue.

Display a clear validation message.

Example:

"Please select a bottle before continuing."

---

# 46. BUILDER PRICE LOGIC

Example:

```text
Base Perfume       ₹399
Bottle             ₹50
Cap                ₹0
-----------------------
Total              ₹449
```

If bottle changes:

```text
Base Perfume       ₹399
Bottle             ₹100
Cap                ₹0
-----------------------
Total              ₹499
```

Price should update immediately in the UI.

But final price MUST be recalculated and validated by backend.

---

# 47. EMPTY / ERROR / LOADING STATES

Every API-driven screen must support:

Loading:

Skeleton UI.

Empty:

Example:

"No perfumes found."

Error:

"Something went wrong. Please try again."

Custom Builder:

If bottle API fails:

"Unable to load bottles. Please try again."

Cart:

Empty cart page with:

"Your cart is waiting for something special."

CTA:

"Explore ROSADO"

---

# 48. ACCESSIBILITY

Implement:

* Keyboard navigation
* Proper labels
* Button semantics
* Image alt text
* Focus states
* Accessible dialogs
* Accessible form validation
* Good color contrast

---

# 49. CURRENCY

Use Indian Rupee:

**₹**

Display prices consistently.

Use proper Indian number formatting.

Example:

₹1,499

---

# 50. V1 PRIORITY

Must implement:

1. Product Master
2. Product Size
3. Fragrance Master
4. Fragrance Notes
5. Bottle Master
6. Cap Master
7. Audience
8. Fragrance Family
9. Occasion
10. Season
11. Time of Day
12. Intensity
13. Longevity
14. Collections
15. Product Images
16. Custom Perfume Builder
17. Cart
18. Checkout
19. Order configuration snapshot

Later:

* Perfume Finder
* Loyalty Program
* Gift Builder
* Gift Packaging
* Personalized Message
* Subscription
* Reorder
* Advanced Recommendations
* AI Fragrance Recommendation

---

# 51. CRITICAL BUSINESS RULES — NEVER VIOLATE

These rules are mandatory.

### Rule 1

**Bottle is NOT a product.**

### Rule 2

**Cap is NOT a product.**

### Rule 3

Bottle cannot be directly added to cart.

### Rule 4

Cap cannot be directly added to cart.

### Rule 5

Bottle availability depends on selected Size.

### Rule 6

Bottle must have SizeID.

### Rule 7

If Size changes, incompatible Bottle selection must be cleared.

### Rule 8

Cap must support future size compatibility.

### Rule 9

Product classifications support multiple values.

### Rule 10

Fragrance Notes are separate master data.

### Rule 11

Product Size is separate from Product Master.

### Rule 12

Orders store a snapshot of purchased configuration.

### Rule 13

Backend validates price.

### Rule 14

Backend validates stock.

### Rule 15

Backend validates bottle compatibility.

### Rule 16

Backend validates cap compatibility.

### Rule 17

Frontend is never the final authority for price.

### Rule 18

Historical orders must never change when master data changes.

### Rule 19

Bottle and Cap inventory must be independently trackable.

### Rule 20

Custom Perfume Builder must be implemented as a reusable module.

---

# 52. IMPORTANT FINAL FLOW

The complete ROSADO Custom Perfume experience must be:

```text
CUSTOM PERFUME
      ↓
CHOOSE SIZE
      ↓
CHOOSE FRAGRANCE
      ↓
FILTER BOTTLES BY SIZE
      ↓
CHOOSE BOTTLE
      ↓
CHOOSE CAP
      ↓
CALCULATE PRICE
      ↓
FINAL PREVIEW
      ↓
ADD CUSTOM PERFUME TO CART
      ↓
CHECKOUT
      ↓
BACKEND VALIDATION
      ↓
CREATE ORDER
      ↓
SAVE ORDER SNAPSHOT
      ↓
UPDATE INVENTORY
```

---

# 53. FINAL DEVELOPMENT REQUIREMENT

Build the application as a real production-quality application, not a static UI demo.

Use:

* Clean architecture
* Reusable components
* Type-safe models
* API abstraction
* Proper state management
* Form validation
* Responsive design
* Error handling
* Loading states
* Empty states
* SEO structure
* Performance optimization
* Secure pricing/order validation architecture

The most important feature is the **Custom Perfume Builder**.

The final experience should make customers feel:

> "I am creating my own perfume."

ROSADO must feel like a premium fragrance experience, not simply:

> "Select a perfume → Buy it."

The central brand experience is:

**Discover a fragrance → Choose your size → Choose your bottle → Choose your cap → Create your perfume → Buy it.**


