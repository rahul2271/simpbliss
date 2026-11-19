// lib/shopify.js — Shopify Storefront API helpers (server + client safe)

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const storefrontVersion = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_VERSION || '2024-04';

export async function shopifyFetch({ query, variables, revalidate = 0 }) {
  const endpoint = `https://${domain}/api/${storefrontVersion}/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate }, // 0 = always fresh (default). Pass seconds to cache.
    });

    const body = await result.json();

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error('Shopify Fetch Error:', error);
    return { status: 500, error: 'Error receiving data from Shopify' };
  }
}

/* ------------------------------------------------------------------ */
/*  CART (Shopify Cart API) — the cart lives in Shopify, the browser   */
/*  only remembers its id. Survives refresh, gives abandoned-checkout  */
/*  data, and prices always come from Shopify.                         */
/* ------------------------------------------------------------------ */

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            price { amount }
            image { url altText }
            product {
              title
              handle
              featuredImage { url altText }
            }
          }
        }
      }
    }
  }
`;

// Shopify cart -> the flat item shape the UI already uses.
// item.id is the VARIANT id (what Shopify calls merchandiseId).
export function normalizeCart(cart) {
  if (!cart) return null;
  const items = (cart.lines?.edges || []).map(({ node }) => {
    const m = node.merchandise || {};
    return {
      id: m.id,
      lineId: node.id,
      title: m.product?.title || 'Perfume Oil',
      handle: m.product?.handle,
      variantTitle: m.title && m.title !== 'Default Title' ? m.title : '',
      image: m.image?.url || m.product?.featuredImage?.url || null,
      price: parseFloat(m.price?.amount || 0),
      quantity: node.quantity,
      availableForSale: m.availableForSale !== false,
    };
  });
  return { id: cart.id, checkoutUrl: cart.checkoutUrl, items };
}

async function cartRequest(query, variables, key) {
  const { status, body, error } = await shopifyFetch({ query, variables });
  if (error || status !== 200) throw new Error(error || `Shopify returned ${status}`);
  if (body?.errors?.length) throw new Error(body.errors[0].message);
  const payload = body?.data?.[key];
  const userErrors = payload?.userErrors;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return payload?.cart ?? payload;
}

export async function getCart(cartId) {
  const query = `query getCart($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`;
  const { status, body, error } = await shopifyFetch({ query, variables: { id: cartId } });
  if (error || status !== 200) throw new Error(error || `Shopify returned ${status}`);
  return normalizeCart(body?.data?.cart); // null when expired / already checked out
}

export async function cartCreate(lines) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`;
  return normalizeCart(await cartRequest(query, { input: { lines } }, 'cartCreate'));
}

export async function cartLinesAdd(cartId, lines) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`;
  return normalizeCart(await cartRequest(query, { cartId, lines }, 'cartLinesAdd'));
}

export async function cartLinesUpdate(cartId, lines) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`;
  return normalizeCart(await cartRequest(query, { cartId, lines }, 'cartLinesUpdate'));
}

export async function cartLinesRemove(cartId, lineIds) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } userErrors { field message } }
    }`;
  return normalizeCart(await cartRequest(query, { cartId, lineIds }, 'cartLinesRemove'));
}

// Kept for backwards compatibility (old checkout flow). The cart drawer now
// uses the checkoutUrl of the persistent cart instead.
export async function createCheckoutUrl(cartItems) {
  try {
    const cart = await cartCreate(cartItems.map((i) => ({ merchandiseId: i.id, quantity: i.quantity })));
    return cart?.checkoutUrl || null;
  } catch (e) {
    console.error('Shopify Cart User Errors:', e);
    return null;
  }
}

// Helper to fetch Shopify menus including nested dropdown items
export async function getMenu(handle = 'main-menu') {
  const query = `
    query getMenu($handle: String!) {
      menu(handle: $handle) {
        id
        title
        items {
          id
          title
          url
          items {
            id
            title
            url
            items {
              id
              title
              url
            }
          }
        }
      }
    }
  `;

  const { body, error, status } = await shopifyFetch({
    query,
    variables: { handle },
    revalidate: 300, // menu rarely changes: cache 5 min so pages can be fast
  });

  if (error || status !== 200) {
    console.error("Error fetching menu:", error);
    return [];
  }

  return body?.data?.menu?.items || [];
}

/* ------------------------------------------------------------------ */
/*  SHOP POLICIES (edited in Shopify Admin > Settings > Policies)      */
/* ------------------------------------------------------------------ */

const POLICY_KEYS = {
  'privacy-policy': 'privacyPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
  'shipping-policy': 'shippingPolicy',
};

export const POLICY_HANDLES = Object.keys(POLICY_KEYS);

export async function getShopPolicies() {
  const query = `
    query getPolicies {
      shop {
        privacyPolicy { title body handle }
        termsOfService { title body handle }
        refundPolicy { title body handle }
        shippingPolicy { title body handle }
      }
    }
  `;
  const { body, error, status } = await shopifyFetch({ query });
  if (error || status !== 200) return {};
  return body?.data?.shop || {};
}

export async function getShopPolicy(handle) {
  const key = POLICY_KEYS[handle];
  if (!key) return null;
  const shop = await getShopPolicies();
  const policy = shop[key];
  return policy?.body ? policy : null;
}
