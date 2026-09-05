# GYBS — Get Your Brand Seen

Static frontend for the GYBS advertising marketplace.

## Current frontend
- Separate Learn More dialog.
- Separate Business, Websites, Crypto, and AI & Apps campaign dialogs.
- Only brand/project name and Gmail are required in the category forms; category-specific fields are optional.
- 3-day free demo messaging.
- Dedicated SOL / BTC / ETH payment layer with copyable wallet addresses.
- Payment QR slots use the exact filenames `solana-qr.png`, `bitcoin-qr.png`, and `ethereum-qr.png`.
- Category/ad artwork slots use `advertising-cat.png`, `business-cat.png`, `website-cat.png`, `crypto-cat.png`, and `ai-apps-cat.png`.

## Important
This is still a frontend. The form does not yet save campaigns, send Gmail/email reminders, verify crypto transactions, or activate campaigns automatically. Those require a backend/database, email service, file storage, and secure payment verification.

Never put private keys, seed phrases, passwords, or admin secrets in frontend files.
