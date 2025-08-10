# Setup Local Images for Hotel Management System

If CDN images are still blocked, here's how to use local images:

## Option 1: Download Images to Public Folder

1. **Create images folder:**

   ```bash
   mkdir public/images
   mkdir public/images/hotel
   ```

2. **Download hotel images** (manually or via script):

   - Download 6 high-quality hotel images
   - Name them: hotel-1.jpg, hotel-2.jpg, etc.
   - Place in `/public/images/hotel/`

3. **Update image URLs in code:**
   ```javascript
   const hotelImages = [
     {
       url: "/images/hotel/hotel-1.jpg",
       alt: "Luxury Hotel Lobby",
       title: "Grand Lobby Experience",
     },
     // ... more images
   ];
   ```

## Option 2: Use Base64 Encoded Images

For small images, convert to base64 and embed directly in code:

```javascript
const hotelImages = [
  {
    url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    alt: "Hotel image",
    title: "Hotel Experience",
  },
];
```

## Option 3: Professional Stock Photo APIs

Use paid services with better CORS support:

- Pexels API
- Getty Images API
- Adobe Stock API

## Recommended Image Specifications

- **Resolution**: 1920x1080 (Full HD)
- **Format**: JPEG (for photos), WebP (for smaller sizes)
- **Size**: < 500KB per image
- **Aspect Ratio**: 16:9 for backgrounds
