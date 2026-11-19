"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { shopifyFetch } from '../../lib/shopify';

const luxuryEase = [0.16, 1, 0.3, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: luxuryEase } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      email
      phone
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
      defaultAddress {
        address1
        city
        province
        country
        zip
      }
    }
  }
`;

export default function AccountDashboard() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCustomerData() {
      const token = localStorage.getItem('simpbliss_customer_token');
      if (!token) {
        window.location.href = '/account/login';
        return;
      }

      try {
        const { body } = await shopifyFetch({
          query: CUSTOMER_QUERY,
          variables: { customerAccessToken: token }
        });

        const cust = body?.data?.customer;
        if (!cust) {
          // Token expired or invalid
          localStorage.removeItem('simpbliss_customer_token');
          window.location.href = '/account/login';
          return;
        }

        setCustomer(cust);
      } catch (err) {
        setError("Failed to retrieve your sanctuary details.");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('simpbliss_customer_token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="bg-[#FAF9FA] min-h-screen text-[#15091C] flex items-center justify-center relative overflow-hidden">
        {/* Animated Loading Spinner aligned with brand style */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border border-[#C8A97E]/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute inset-2 border border-[#C8A97E]/60 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
            <span className="text-[#C8A97E] text-xs font-serif italic">S</span>
          </div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#15091C]/60 font-medium">Accessing Sanctuary</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-[#FAF9FA] min-h-screen text-[#15091C] pt-[200px] text-center px-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-serif italic mb-6 tracking-tight">Access Restricted</h1>
        <p className="text-xs font-light tracking-[0.2em] uppercase text-[#15091C]/60 mb-10">{error || "Please sign in to view your account."}</p>
        <Link href="/account/login" className="bg-[#15091C] text-white text-[10px] uppercase tracking-[0.4em] font-medium px-12 py-5 hover:bg-[#C8A97E] transition-all duration-500 shadow-xl group flex items-center gap-4">
          Return to Sign In
          <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
        </Link>
      </div>
    );
  }

  const orders = customer.orders?.edges || [];

  return (
    <div className="bg-[#FAF9FA] min-h-screen text-[#15091C] pt-[140px] md:pt-[180px] pb-32 selection:bg-[#C8A97E] selection:text-white relative overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#ffffff] to-transparent pointer-events-none"></div>
      
      <div className="max-w-[1500px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Header */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#15091C]/10 pb-10">
          <motion.div variants={fadeUp}>
            <span className="text-[#C8A97E] text-[9px] md:text-[10px] uppercase tracking-[0.5em] mb-4 block font-medium">Client Sanctuary</span>
            <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight text-[#15091C] leading-[1.1]">
              Welcome, {customer.firstName}
            </h1>
          </motion.div>
          <motion.button 
            variants={fadeUp}
            onClick={handleLogout}
            className="mt-8 md:mt-0 text-[9px] uppercase tracking-[0.3em] font-medium text-[#15091C]/50 hover:text-[#15091C] flex items-center gap-3 transition-colors group"
          >
            Sign Out
            <span className="w-6 h-[1px] bg-[#15091C]/20 group-hover:bg-[#15091C] transition-colors"></span>
          </motion.button>
        </motion.div>

        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          
          {/* Left: Client Profile Summary */}
          <motion.div variants={fadeUp} className="lg:col-span-4 bg-white p-10 md:p-14 rounded-sm shadow-[0_20px_60px_rgba(21,9,28,0.03)] border border-[#15091C]/5">
            <h2 className="text-2xl font-serif italic mb-10 text-[#15091C] border-b border-[#15091C]/10 pb-4">Client Dossier</h2>
            
            <div className="space-y-8 text-[13px] font-light text-[#15091C]/80">
              <div className="group">
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#C8A97E] block mb-2 font-medium">Email Address</span>
                <p className="font-serif italic text-base group-hover:text-[#C8A97E] transition-colors cursor-default">{customer.email}</p>
              </div>

              <div className="group">
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#C8A97E] block mb-2 font-medium">Phone Number</span>
                <p className="font-serif italic text-base group-hover:text-[#C8A97E] transition-colors cursor-default">{customer.phone || '—'}</p>
              </div>

              <div>
                <span className="text-[8px] uppercase tracking-[0.3em] text-[#C8A97E] block mb-3 font-medium">Primary Atelier Address</span>
                {customer.defaultAddress ? (
                  <p className="leading-[1.8] bg-[#FAF9FA] p-5 border border-[#15091C]/5 rounded-sm">
                    {customer.defaultAddress.address1}<br/>
                    {customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}<br/>
                    {customer.defaultAddress.country}
                  </p>
                ) : (
                  <p className=" text-[#15091C]/40 text-sm">No destination secured on file.</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Order History */}
          <motion.div variants={fadeUp} className="lg:col-span-8 bg-white p-10 md:p-14 rounded-sm shadow-[0_20px_60px_rgba(21,9,28,0.03)] border border-[#15091C]/5">
            <div className="flex justify-between items-end border-b border-[#15091C]/10 pb-4 mb-10">
              <h2 className="text-2xl font-serif italic text-[#15091C]">Ritual History</h2>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#15091C]/40 font-medium">{orders.length} Acquisitions</span>
            </div>

            {orders.length === 0 ? (
              <div className="py-24 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 border border-[#C8A97E]/30 rounded-full flex items-center justify-center mb-6 text-[#C8A97E]/50">
                  ✧
                </div>
                <p className="text-[10px] font-medium text-[#15091C]/60 uppercase tracking-[0.4em] mb-8">Your archive is currently empty.</p>
                <Link href="/collections/all" className="inline-block bg-[#15091C] text-white text-[10px] uppercase tracking-[0.4em] font-medium px-10 py-5 hover:bg-[#C8A97E] transition-all duration-500 shadow-xl group flex items-center gap-4 w-fit">
                  Explore The Archive
                  <span className="group-hover:translate-x-2 transition-transform duration-500">→</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(({ node }) => {
                  const date = new Date(node.processedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  });
                  
                  const isFulfilled = node.fulfillmentStatus === 'FULFILLED';

                  return (
                    <div key={node.id} className="border border-[#15091C]/5 p-6 md:p-8 rounded-sm bg-[#FAF9FA] hover:bg-white hover:shadow-[0_15px_40px_rgba(21,9,28,0.04)] transition-all duration-500">
                      
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 mb-5 border-b border-[#15091C]/5 gap-4">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-serif italic font-medium text-[#15091C]">{node.name}</span>
                          <span className="w-4 h-[1px] bg-[#15091C]/20"></span>
                          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#15091C]/50">{date}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <span className={`text-[8px] uppercase tracking-[0.4em] px-3 py-1.5 font-medium ${isFulfilled ? 'bg-[#C8A97E] text-white' : 'bg-[#15091C]/10 text-[#15091C]'}`}>
                            {node.fulfillmentStatus || 'Processing'}
                          </span>
                          <span className="text-sm font-medium font-sans text-[#15091C]">
                            ₹{parseFloat(node.totalPrice.amount).toFixed(0)} <span className="text-[10px] text-[#15091C]/50">{node.totalPrice.currencyCode}</span>
                          </span>
                        </div>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-3">
                        {node.lineItems.edges.map(({ node: item }, i) => (
                          <div key={i} className="flex justify-between items-center text-xs font-light text-[#15091C]/80">
                            <div className="flex items-center gap-3">
                              <span className="text-[#C8A97E] text-[10px] font-medium">{item.quantity}x</span>
                              <span className="font-serif italic text-sm">{item.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}
