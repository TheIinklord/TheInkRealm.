# TheInkRealm — custom-built website

A responsive website inspired by the layout and content of the provided SITE123 reference. It is built from scratch with HTML, CSS, JavaScript, and a Vercel serverless endpoint.

## What's included

- Home / hero section and The Ink Lord visual
- Portfolio concept cards
- Commission categories
- Four-step commission process
- About section
- Commission request form
- Mobile navigation
- Vercel API endpoint that emails new requests through Resend
- Quote-first flow: customers request a quote; you confirm price; you then send a Stripe payment link manually
- Basic security headers and server-side input validation

## Deploy to Vercel

1. Upload these files to a new GitHub repository (keep `api/commission.js` inside the `api` folder).
2. In Vercel, import that repository and deploy it. Framework preset can be **Other**; no build command is needed.
3. In the Vercel project, open **Settings → Environment Variables** and add:
   - `RESEND_API_KEY` — your Resend API key
   - `RESEND_FROM_EMAIL` — a sender address on a domain verified in Resend, for example `TheInkRealm <orders@your-verified-domain.com>`
   - `COMMISSION_NOTIFICATION_EMAIL` — the email address where you want new requests delivered
4. Redeploy after adding the environment variables.
5. Test the live commission form with a request you can recognize. Confirm the email arrives before sharing the site publicly.

## Stripe quote-first workflow

This starter intentionally does **not** charge visitors or create payment links automatically. When a request arrives, review the project and email the customer a quote. After they approve, create a payment link in Stripe and send it to them. Never put Stripe secret keys in browser-side code.

## Customize the artwork

The colorful hero and portfolio artwork are CSS-made concept illustrations. Replace them with your own finished artwork as you choose. Add image files under `public/` and update the relevant sections in `index.html` to use them.

## Important

- The form sends notification emails to the studio. It does not yet send an automatic customer confirmation.
- `RESEND_FROM_EMAIL` must be a verified sender/domain accepted by your Resend account.
- Add your final policies (commission terms, refunds, delivery timelines, privacy policy, and contact details) before accepting paid work.
- This project is a deployable starter, but it is not live until you deploy it and configure the environment variables.
