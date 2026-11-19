// import { shopifyFetch } from '../lib/shopify';
// import NavbarClient from './NavbarClient';

// // GraphQL Query to fetch your live Shopify navigation menu
// const getMenuQuery = `
//   query getMenu {
//     menu(handle: "main-menu") {
//       items {
//         id
//         title
//         url
//       }
//     }
//   }
// `;

// export default async function Navbar() {
//   const { body } = await shopifyFetch({ query: getMenuQuery });

//   // Extract items, with a graceful fallback if you haven't created a menu named "main-menu" in Shopify yet
//   const menuItems = body?.data?.menu?.items || [
//     { id: 'fallback-1', title: 'Perfumes', url: '/collections/perfumes' },
//     { id: 'fallback-2', title: 'Attars', url: '/collections/attars' },
//     { id: 'fallback-3', title: 'Our Story', url: '/pages/about' }
//   ];

//   return <NavbarClient menuItems={menuItems} />;
// }



import { shopifyFetch } from '../lib/shopify';
import NavbarClient from './NavbarClient';

// GraphQL Query to fetch your live Shopify navigation menu
const getMenuQuery = `
  query getMenu {
    menu(handle: "main-menu") {
      items {
        id
        title
        url
      }
    }
  }
`;

export default async function Navbar() {
  let menuItems = [];

  try {
    const { status, body, error } = await shopifyFetch({ query: getMenuQuery });
    
    // Safely extract the menu items if the request was successful
    if (status === 200 && body?.data?.menu?.items) {
      menuItems = body.data.menu.items;
    } else {
      console.error("Shopify Menu Fetch Error:", error || "Invalid menu response");
    }
  } catch (err) {
    console.error("Failed to fetch Shopify menu:", err);
  }

  // Graceful luxury fallback if the Shopify menu isn't configured yet or the API fails
  if (!menuItems || menuItems.length === 0) {
    menuItems = [
      { id: 'fallback-1', title: 'Home', url: '/' },
      { id: 'fallback-2', title: 'Archive', url: '/collections/all' },
      { id: 'fallback-3', title: 'Our Story', url: '/pages/about' }
    ];
  }

  return <NavbarClient menuItems={menuItems} />;
}
