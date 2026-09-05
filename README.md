# GYBS — Get Your Brand Seen

Simple static frontend for the GYBS advertising marketplace.

## Design
- Warm retro-inspired palette: cream, red, mustard, green, blue and dark ink.
- Text-first category cards in a simple 2×2 layout.
- The GYBS logo is the only branding image in the main interface.
- Payment QR images are used only inside the payment layer.

## Assets
Put the logo and payment QR files inside `assets/` with the filenames used by `index.html`.

## Current frontend limits
This is still a frontend-only site. It does not yet store campaign submissions, send automatic Gmail reminders, verify crypto payments, or activate campaigns automatically. Those require a backend/database/email/payment-verification layer.

Never put private keys, seed phrases, passwords or admin secrets in the frontend.
