-- Run this once, in Supabase → SQL Editor → New Query → paste all of this → Run.
-- Enables the "Content" tab in the admin panel: editable copy for the homepage,
-- About page, Contact page, Quote page, Footer, and Terms & Policies page.
-- Safe to run more than once — every statement here is idempotent, and the
-- seed values below match the site's current copy exactly, so nothing changes
-- visually until the owner edits something in /admin/content.

create table if not exists page_content (
  page_key text primary key,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into page_content (page_key, content) values
('home', $content$
{
  "hero": {
    "heading": "Precision garments & full-grain leather goods.",
    "subcopy": "A manufacturer, wholesaler and exporter dedicated to quality craftsmanship — from our own premium collections to custom manufacturing for brands worldwide."
  },
  "about": {
    "eyebrow": "About Us",
    "heading": "Built on craftsmanship. Trusted for the long run.",
    "body": "H&H Global LLC is a manufacturer, wholesaler and exporter delivering premium garments and full-grain leather goods — plus custom manufacturing, private label and OEM production for brands worldwide.\n\nFrom material selection to sampling, production, quality control and international shipping, we stay hands-on through every stage so your product ships exactly to spec."
  },
  "process": {
    "eyebrow": "How It Works",
    "heading": "From spec to shipped, in four steps.",
    "steps": [
      { "title": "Share Your Specs", "description": "Tell us quantity, fabric or leather, finish and timeline through a quick quote request." },
      { "title": "Sample & Confirm", "description": "We produce a sample and lock in pricing once you approve the spec." },
      { "title": "Production & QC", "description": "Your run goes into production with quality control checks at every stage." },
      { "title": "Ship & Deliver", "description": "Finished goods are packed and shipped worldwide, on the timeline we quoted." }
    ]
  },
  "cta": { "eyebrow": "Get a Quote", "heading": "Have a bulk order in mind?" }
}
$content$::jsonb),

('company_stats', $content$
{
  "years": { "num": "12+", "label": "Years crafting" },
  "orders": { "num": "1,400+", "label": "Orders fulfilled" },
  "minUnits": { "num": "25", "label": "Unit minimum" },
  "turnaround": { "num": "24 hrs", "label": "Avg. quote turnaround" }
}
$content$::jsonb),

('about', $content$
{
  "hero": {
    "eyebrow": "About",
    "heading": "A workshop built on craftsmanship, trusted worldwide.",
    "body": "Welcome to H&H Global LLC — a manufacturer, wholesaler, exporter and brand dedicated to delivering quality products with exceptional craftsmanship, from our own collections to custom manufacturing for brands worldwide."
  },
  "story": {
    "heading": "From material to finished good, we stay hands-on.",
    "body": "Our business was founded with a passion for creating premium leather products and garments that combine durability, functionality, and modern design. Through our own brand, we offer carefully developed products that reflect our commitment to quality and attention to detail.\n\nIn addition to our branded collection, we proudly provide custom manufacturing services for businesses, retailers, distributors, startups, and established brands worldwide. Whether you need private-label production, OEM manufacturing, custom designs, or products developed according to your specifications, our team has the expertise and production capabilities to bring your ideas to life.\n\nWe work closely with our clients throughout the manufacturing process — from product development and material selection to sampling, production, quality control, and international shipping — so brands can meet their exact requirements while maintaining the highest standards of quality and reliability."
  },
  "offer": {
    "eyebrow": "What We Offer",
    "heading": "One partner, every stage of the product journey.",
    "offerings": [
      { "title": "Our Own Premium Product Collections" },
      { "title": "Custom Manufacturing & Product Development" },
      { "title": "Private Label & White Label Services" },
      { "title": "OEM & ODM Production" },
      { "title": "Leather Products & Garments" },
      { "title": "Bulk & Wholesale Supply" },
      { "title": "Quality Control & Export Services" },
      { "title": "Global Shipping & Business Support" }
    ]
  },
  "closingCta": {
    "badge": "A Strong Partnership",
    "heading": "Every successful product starts with a partner you can trust.",
    "body": "Whether you're purchasing from our brand or creating your own, we're committed to delivering quality, professionalism, and long-term value."
  }
}
$content$::jsonb),

('contact', $content$
{
  "eyebrow": "Contact",
  "heading": "Get in touch",
  "email": "hello@hhglobalcompany.com",
  "phone": "+92 300 0000000",
  "address": "Karachi, Pakistan"
}
$content$::jsonb),

('quote', $content$
{
  "intro": {
    "eyebrow": "Consultation",
    "heading": "Ready to define your requirements?",
    "body": "Every project begins with a conversation. Detail your necessity below and our manufacturing team will provide a tailored estimate within 24 hours."
  },
  "thankYou": {
    "eyebrow": "Request Received",
    "heading": "Thanks — we're on it.",
    "body": "Your quote request has been received. Our manufacturing team will review it and reply to your email within 24 hours with pricing, minimum order quantity and lead time."
  }
}
$content$::jsonb),

('footer', $content$
{
  "tagline": "We prioritize durability and ethical sourcing above all. Every piece is a testament to functional longevity.",
  "social": { "instagram": "/", "linkedin": "/", "behance": "/" },
  "copyrightLine": "HH Global Company Workshop. All rights reserved.",
  "geoLine": "Karachi, Pakistan — Lat: 24.8607° N, Lon: 67.0011° E"
}
$content$::jsonb),

('terms', $content$
{
  "eyebrow": "Legal",
  "heading": "Terms & Policies",
  "intro": "Shipping and lead times, returns and repairs, terms of sale, and how we handle your information — everything that governs a wholesale order with H&H Global LLC.",
  "sections": [
    {
      "id": "shipping",
      "heading": "Shipping & Lead Times",
      "factCards": [
        { "num": "50 pcs", "label": "Minimum order quantity" },
        { "num": "3–6 wks", "label": "Standard lead time at MOQ" }
      ],
      "body": "We currently supply wholesale orders only, with a Minimum Order Quantity (MOQ) of 50 pieces for both custom-made products and our in-house branded products intended for resale.\n\nStandard production lead times for MOQ orders range from 3 to 6 weeks. Lead times for quantities exceeding the MOQ may vary depending on order size, production requirements, and shipping carrier availability."
    },
    {
      "id": "returns",
      "heading": "Returns & Repairs",
      "factCards": [
        { "num": "14 days", "label": "Window to report defects" },
        { "num": "100 pcs", "label": "Threshold for buyer-side freight" }
      ],
      "body": "All custom-made and made-to-order products are considered final sale and are not eligible for return or exchange.\n\nCustomers must inspect all goods upon receipt. Any claim for workmanship defects must be submitted in writing, along with clear photographs of the issue, within 14 days of delivery.\n\nIf products are found to have workmanship defects, we will repair or replace the defective items at our discretion.\n\nFor defective quantities of up to 100 pieces, all replacement and shipping costs will be borne by us.\n\nFor defective quantities exceeding 100 pieces, replacement items will be provided; however, applicable freight and shipping charges may be the responsibility of the buyer, subject to mutual agreement and the selected shipping method.\n\nClaims submitted after the 14-day inspection period may not be eligible for repair, replacement, or compensation."
    },
    {
      "id": "terms-of-sale",
      "heading": "Terms of Sale",
      "factCards": [],
      "body": "Pricing for custom products is quoted based on the customer's specifications, materials, and order requirements.\n\nPayments can be made securely through Stripe Checkout or via bank transfer. Full payment terms will be provided with the quotation.\n\nApplicable taxes, customs duties, import fees, and other government charges are the responsibility of the buyer unless otherwise stated in writing."
    },
    {
      "id": "privacy",
      "heading": "Privacy Policy",
      "factCards": [],
      "body": "We collect and use customer information solely for order processing, customer support, and business communications.\n\nWe do not sell, rent, or share personal information with third parties for marketing purposes. Customer information is handled with appropriate security measures and used only as necessary to provide our products and services."
    }
  ],
  "closingNote": "Questions about any of the above? We're happy to walk through it before you order."
}
$content$::jsonb)

on conflict (page_key) do nothing;
