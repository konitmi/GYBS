# GYBS — Get Your Brand Seen

Frontend + first backend-ready campaign system. The frontend remains on GitHub Pages; Supabase provides the free-tier database.

## What is now connected
- Campaign form submissions can be saved to Supabase.
- Every submission gets a unique campaign code such as `GYBS-7K29X`.
- A visitable campaign page is generated at `campaign.html?id=GYBS-7K29X`.
- Pending campaigns show an **UNDER REVIEW** state.
- Approved/live campaigns can be displayed publicly.
- Transaction confirmations can be saved to Supabase.
- Project logos and transaction screenshots are resized client-side and stored as compressed image data for this MVP.

## Free setup
1. Create a free project at Supabase.
2. Open **SQL Editor** and run `supabase-schema.sql`.
3. Copy the project URL and the public **anon/publishable** key into `config.js`.
4. Upload `config.js`, `campaign.html`, `campaign.js`, `supabase-schema.sql`, and the updated `script.js`/`index.html` to your GitHub Pages repo.
5. Open the site, submit a campaign, and the form will give you a campaign link.

### Important security note
Only the public anon/publishable key belongs in the website. **Never put a Supabase service_role/secret key in `config.js` or GitHub.**

## Admin workflow for this MVP
Open Supabase → Table Editor → `campaigns`. After reviewing a submission, change `status` from `pending` to `approved` or `live`. The public campaign page will reflect that status.

## Payment addresses
- SOL: `9ssYqm3chD4YAA9FAVCeQ6C2oXcNFWpvkrsTFwRat7rK`
- RH: `0x95af47ac8d5b35c4263556167e4d77470052d71c`
- BTC: `bc1qdfgrvc04ls60nrpprur26erc6fnpc0dsjxkt2z`

Automatic payment verification, email reminders, scheduling/expiry automation, and a full admin dashboard are **not** enabled yet. Those are the next backend layer.
