# Seven — redesigned storefront

Buildless HTML/CSS/JavaScript storefront. Serve `dist/` using any static host.
Pages: `#/`, `#/homme`, `#/femme`, `#/marque`.

Product pages follow the supplied Blokbrand conversion sequence: hero gallery and thumbnails, benefit row, selection cards, price/CTA, immediate story profiles, personalisation inquiry, assurances, product detail and material explanations, ordering steps, shared stories, collection cards, FAQ, final CTA and sticky ordering bar. The same stories renderer and viewer serve landing and product pages.

Checkout uses Seven's existing WhatsApp number (+212 698 040 572), with a local cart and two-step order preparation. No order is recorded server-side; the visitor must send the prepared WhatsApp message, and Seven confirms stock and delivery.

Product facts and price: supplied Seven archive and presentation dossier. The dossier lists Homme M and Femme S/M, unlike the archive's broader S–XL. Current design uses the dossier's sizes and asks for confirmation. Delivery fees, timing, exchange terms and customisation prices require confirmation; no Blokbrand bonnet pricing, gifts, reviews, urgency or policies are reused.

Generated campaign imagery is disclosed in the stories. Replace with genuine permissioned UGC when available. No generated image is presented as a verified testimonial.
See `IMAGE-PROMPTS.md` for generation prompts. Supplied source archives were extracted into the parent `sources/` folder and retained unchanged.
