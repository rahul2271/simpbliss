// lib/faq.js — all FAQ copy lives here. Edit freely.
// Every page gets its own set, so the questions match what a visitor is
// looking at. Answers only use facts already on the site (alcohol-free,
// IFRA-compliant, unisex, free shipping above ₹1000, contact hours) plus
// general fragrance-care advice. Add policy details (delivery times,
// returns) only once they are final in Shopify Admin > Settings > Policies.

const FREE_SHIP = 'Orders above \u20B91000 ship free.';

const q = (question, answer, link) => ({ q: question, a: answer, ...(link ? { link } : {}) });

const L = {
  finder: { href: '/scent-finder', label: 'Try the scent finder' },
  shipping: { href: '/shipping', label: 'Shipping and returns' },
  contact: { href: '/contact', label: 'Contact us' },
  bulk: { href: '/bulk-orders', label: 'Bulk and wholesale enquiries' },
  shop: { href: '/collections/all', label: 'Shop all essences' },
  about: { href: '/about', label: 'Our craft' },
};

/* ---------- General (the /faq page) ---------- */
export const GENERAL = [
  q('What is a perfume oil?', 'A perfume oil is a concentrated fragrance blended in an oil base instead of alcohol. It sits close to the skin and develops slowly with your body heat, so the scent feels personal rather than loud.'),
  q('Are SIMPBLISS perfume oils alcohol-free?', 'Yes. Our perfume oils are alcohol-free and made to be gentle on the skin.'),
  q('How do I apply it?', 'Apply a small amount to clean, dry pulse points: wrists, sides of the neck and behind the ears. Press, do not rub, so the notes stay intact. Start with one touch and add more if you want it stronger.'),
  q('How long will it last?', 'It depends on your skin, the climate and the scent family. Oils tend to stay closer to the skin than sprays, and moisturised skin holds fragrance longer. Applying after a shower, on slightly hydrated skin, helps.'),
  q('Is it suitable for sensitive skin?', 'Our oils are IFRA-compliant and formulated to be non-irritating. Everyone\u2019s skin is different, so we recommend a small patch test on your inner wrist before first use.'),
  q('Is the fragrance unisex?', 'Yes. Our fragrances are unisex. Choose by mood and scent family rather than by label.', L.finder),
  q('How should I store it?', 'Keep the bottle closed, upright, in a cool and dry place away from direct sunlight and heat. This keeps the scent true for longer.'),
  q('Shipping, delivery and returns', `${FREE_SHIP} For delivery times, return and refund terms, please read our shipping and returns page.`, L.shipping),
  q('Do you offer bulk or wholesale orders?', 'Yes, for corporate gifting, private label and boutique wholesale.', L.bulk),
  q('I have another question.', 'We would be glad to help.', L.contact),
];

/* ---------- Home ---------- */
export const HOME = [
  q('What makes SIMPBLISS different from a regular perfume?', 'SIMPBLISS makes perfume oils, not alcohol sprays. They are alcohol-free, sit close to the skin and unfold slowly with body heat.', L.about),
  q('Are your perfume oils alcohol-free and safe for skin?', 'Yes. They are alcohol-free, IFRA-compliant and formulated to be non-irritating. A quick patch test on the inner wrist before first use is always a good idea.'),
  q('Which scent should I choose?', 'Choose by mood. Oud and woody for depth, floral for romance, oriental and gourmand for warmth, musk and amber for a clean second-skin feel. Or answer three questions and let us suggest a family.', L.finder),
  q('How do I apply a perfume oil?', 'Touch a small amount to clean pulse points such as the wrists and neck. Press rather than rub. Moisturised skin holds scent longer.'),
  q('Is shipping free?', `${FREE_SHIP} Full delivery and return details are on our shipping and returns page.`, L.shipping),
  q('Can I order in bulk or as gifts?', 'Yes. We take corporate gifting, private label and wholesale enquiries.', L.bulk),
];

/* ---------- Shop all ---------- */
export const SHOP_ALL = [
  q('How do I choose between so many essences?', 'Start with the mood you want to wear: woody and smoky, floral and soft, warm and sweet, or clean and musky. The collections group scents by family, and the scent finder narrows it down in three questions.', L.finder),
  q('Are all SIMPBLISS perfume oils unisex?', 'Yes. Our fragrances are unisex, so pick whatever speaks to you.'),
  q('How much perfume oil should I use?', 'One small touch per pulse point is enough. Oils are concentrated, so start light and add more if you want.'),
  q('Is shipping free?', `${FREE_SHIP}`, L.shipping),
  q('Where can I get help choosing?', 'Write to us and we will help you pick. We reply within 24 hours.', L.contact),
];

/* ---------- Collections ---------- */
const FAMILY = {
  'oud-woody': ['Oud and woody', 'Oud and woody scents are deep, warm and often smoky, built around resinous heartwood and dry woods. They feel grounding and suit evenings and cooler weather.'],
  floral: ['Floral', 'Floral scents are built on blooms such as rose and jasmine. They range from soft and powdery to rich and heady, and suit daytime and romantic occasions.'],
  'floral-botanical': ['Floral and botanical', 'Floral and botanical scents are built on blooms and green, natural notes. They range from soft to rich and suit daytime and romantic occasions.'],
  'gourmand-oriental': ['Oriental and gourmand', 'Oriental and gourmand scents are warm, sweet and spiced, with notes like vanilla, resins and amber. They feel opulent and suit festive evenings.'],
  'oriental-gourmand': ['Oriental and gourmand', 'Oriental and gourmand scents are warm, sweet and spiced, with notes like vanilla, resins and amber. They feel opulent and suit festive evenings.'],
  'musk-amber': ['Musk and amber', 'Musk and amber scents are soft, clean and skin-like, with a gentle warmth. They are easy to wear every day.'],
  attarss: ['Attars', 'Attars are traditional concentrated perfume oils, made by distilling botanicals into a base. They are rich, long-lasting and worn in small amounts.'],
  attars: ['Attars', 'Attars are traditional concentrated perfume oils, made by distilling botanicals into a base. They are rich, long-lasting and worn in small amounts.'],
};

export function collectionFaqs({ handle, title, description }) {
  const fam = FAMILY[handle];
  const list = [];
  if (fam) list.push(q(`What does the ${title} collection smell like?`, fam[1]));
  else if (description) list.push(q(`What is in the ${title} collection?`, description.replace(/\s+/g, ' ').trim()));
  list.push(
    q(`Is the ${title} collection alcohol-free?`, 'Yes. All SIMPBLISS perfume oils are alcohol-free and formulated to be gentle on the skin.'),
    q('How do I apply a perfume oil?', 'Touch a small amount to clean pulse points such as the wrists and neck. Press rather than rub, and add more only if you want it stronger.'),
    q('Not sure this is the right family for you?', 'Answer three short questions and we will suggest the scent family that matches your mood.', L.finder),
    q('Is shipping free?', FREE_SHIP, L.shipping),
  );
  return list;
}

/* ---------- Product (uses the product's own Shopify data) ---------- */
const cleanList = (t = '') => t.split('\n').map((l) => l.replace(/^[-\u2022*\s]+/, '').trim()).filter(Boolean).join('. ');

export function productFaqs(product) {
  const t = product.title;
  const top = product.topNotes?.value, heart = product.heartNotes?.value, base = product.baseNotes?.value;
  const price = parseFloat(product.priceRange?.minVariantPrice?.amount || 0);
  const list = [];

  if (top || heart || base) {
    const parts = [top && `top notes: ${top}`, heart && `heart notes: ${heart}`, base && `base notes: ${base}`].filter(Boolean);
    list.push(q(`What are the notes of ${t}?`, `${t} opens with ${parts.join('; ')}.`));
  }
  if (product.ingredients?.value) list.push(q(`What is ${t} made of?`, product.ingredients.value.replace(/\s+/g, ' ').trim()));
  list.push(q(`Is ${t} alcohol-free?`, `Yes. ${t} is an alcohol-free perfume oil, formulated to be gentle on the skin.`));
  list.push(q(`How do I apply ${t}?`, product.howToUse?.value ? cleanList(product.howToUse.value) : 'Touch a small amount to clean, dry pulse points such as the wrists and neck. Press rather than rub. Moisturised skin helps the scent last longer.'));
  list.push(q(`Is ${t} suitable for sensitive skin?`, 'Our oils are IFRA-compliant and formulated to be non-irritating. Everyone\u2019s skin is different, so please patch test on your inner wrist before first use.'));
  list.push(q(`Is ${t} unisex?`, 'Yes. Our fragrances are unisex, so wear it however it suits you.'));
  list.push(q(`How much does ${t} cost and is shipping free?`, `${t} starts at \u20B9${Math.round(price)}. ${FREE_SHIP}`, L.shipping));
  list.push(q('How should I store it?', 'Keep the bottle closed and upright in a cool, dry place away from sunlight and heat.'));
  return list;
}

/* ---------- Brand / info pages ---------- */
export const ABOUT = [
  q('How are SIMPBLISS perfume oils made?', 'We use the traditional Deg-Bhapka method. Botanicals are gently heated over wood fires in copper stills (degs), and the vapour travels through bamboo pipes into receivers (bhapkas) resting in cold water, slowly condensing into oil.'),
  q('Where do your ingredients come from?', 'Wild-harvested oud from Assam, hydro-distilled Damask roses from Kannauj and vetiver from Mysore, among other Indian botanicals.'),
  q('Are your perfume oils alcohol-free?', 'Yes. They are alcohol-free and made to sit close to the skin.'),
  q('Are the fragrances safe for skin?', 'They are IFRA-compliant and formulated to be non-irritating. We still recommend a patch test before first use.'),
  q('Where can I shop?', 'The full range is in the archive.', L.shop),
];

export const SCENT_FINDER = [
  q('How does the scent finder work?', 'You answer three short questions about the places, moods and hours that feel like you. We match your answers to one of four scent families.'),
  q('Which scent families will I be matched to?', 'Oud and woody, floral and botanical, oriental and gourmand, or musk and amber.'),
  q('Can I wear a scent that is not my result?', 'Of course. The finder is a starting point. Fragrance is personal and our oils are unisex.'),
  q('Do I need to know anything about perfume?', 'No. Just answer by instinct.'),
  q('Still unsure?', 'Write to us and we will help you choose.', L.contact),
];

export const BULK = [
  q('What kinds of bulk orders do you take?', 'Corporate gifting, private label or custom batch, and wholesale boutique orders of our alcohol-free perfume oils.'),
  q('How do I start a wholesale or gifting enquiry?', 'Fill in the form on this page with your requirements and quantity. Our team will review it and reach out within 24 hours.'),
  q('Do you offer private label or custom batches?', 'Yes. Select private label or custom batch in the form and tell us what you have in mind.'),
  q('Can I speak to someone first?', 'Yes. You can call or WhatsApp us, Monday to Saturday, 10 AM to 7 PM IST.', L.contact),
];

export const CONTACT = [
  q('When can I reach you?', 'We are available Monday to Saturday, 10 AM to 7 PM IST.'),
  q('How quickly do you reply?', 'We respond within 24 hours.'),
  q('Can I contact you on WhatsApp?', 'Yes. Our telephone number is also on WhatsApp.'),
  q('I need help choosing a scent.', 'Tell us the mood or occasion, or try the scent finder.', L.finder),
  q('Where do I find shipping and return details?', `${FREE_SHIP} The rest is on our shipping and returns page.`, L.shipping),
];

export const JOURNAL = [
  q('What is the SIMPBLISS journal?', 'Stories on perfume oils, Indian distillation and the care of fragrance.'),
  q('How do I make a perfume oil last longer?', 'Apply to clean, moisturised pulse points after a shower and press rather than rub. Store the bottle away from heat and sunlight.'),
  q('Which scent should I read about first?', 'Start with the scent family that matches your mood, or take the scent finder.', L.finder),
];

export const SHIPPING = [
  q('Is shipping free?', FREE_SHIP),
  q('Where can I read the full shipping and return terms?', 'They are on this page, taken directly from our store policies.'),
  q('How do I ask about an order?', 'Write to us or call during working hours, Monday to Saturday, 10 AM to 7 PM IST.', L.contact),
];
