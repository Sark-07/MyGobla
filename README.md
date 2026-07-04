# Our Eternal Bond (One Wish Willow)

A beautiful, interactive birthday puzzle experience built for Gobla.

## Features

- **Interactive Mystery:** A sequential puzzle game where the user must decipher codes, match memories, connect stars, and forge word chains to unlock their birthday wish.
- **Retro Product Aesthetic:** Designed with a vintage, magical catalog vibe, utilizing a carefully selected color palette (cream, brown, red, gold).
- **Responsive UI:** Fully mobile-friendly and beautiful across all devices.
- **Sound & Effects:** Features subtle background ambiance, magical chimes, text-to-speech narration, and interactive particle effects to create an immersive experience.
- **Wish Sealing (EmailJS):** Automatically and silently seals the user's final birthday wish and sends it to their designated email using EmailJS.

## Technology Stack

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS 4.3**
- **EmailJS** for silent background email delivery

## Running Locally

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (automatically clears the cache if needed):
   ```bash
   npm start
   ```

3. Open `http://localhost:5173` in your browser.

## Customization

The email delivery system is powered by EmailJS. If you wish to configure it for another account:
1. Update your Service ID, Template ID, and Public Key in `src/pages/WishReveal.tsx`.
2. Ensure your EmailJS template expects `wish_text` and `email` variables (if applicable).

---
*Created as a digital birthday gift. 100% magical.*
