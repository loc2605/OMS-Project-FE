import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      name: 'Noise-Cancelling Wireless Headphones Pro',
      price: '$299.00',
      rating: 5,
      sold: '1.5k',
      discount: '25% OFF',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 2,
      name: 'Minimalist Skeleton Automatic Watch',
      price: '$145.00',
      rating: 4,
      sold: '420',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkxQITxAvrrPnfs6fROOK009P6Cgr5EkleS4HVL-61bhE0bNV6v7giDfa_ppfzASM2n88Lq6H-Ix8EX1Lk2Gs_RmiW0T2FbaGGkeIDoRcXnN7Xf4uaz-KzFq3E94-PfBzxBcKMZyu7COkFA_pMTFpUjnCm-cp-BvMpXwmn57l9RR05Pw9hRGLxqnGapRergRTRci77XRaaiaYuyvViU560oDe7_FCxhHCeRWEK8_HCbC33a-Bomp6nmWrq10qvTQueVeIPek3Yh5N-'
    },
    {
      id: 3,
      name: 'SmartHub Gen 4 - Voice Controlled',
      price: '$89.99',
      rating: 4,
      sold: '2.2k',
      discount: 'SALE',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN-0eN5Des1qIwstH0eWZkMTJreA5EH8-9KD39k3uVmjJKXEAjWZRm9izXnpFRQ_KcetHlVYS84EeagNwa9iNoDm_TttWFo7wpPHahd0eDyI56EUonO1-lsQgTXG8Db1Wwi4MQHZTOSWKyHb09NTl7bSa3QT0StGIMzhhPsOBJl-xizBcPAmXrPgyzMEKG8QfE5jcwkkeSWweVKXcBxNmmNgMTFglGpezG_vOGg9-leQu_iljTYJUQSoSj8FThiqfz02BmWF23qeEA'
    },
    {
      id: 4,
      name: 'Ultra-Prime 35mm f/1.4 Lens',
      price: '$1,250.00',
      rating: 5,
      sold: '89',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANuGsYDVevPCrG06p4kbe4XRPlTQLNVHId4gbxObUEtEYVWUh49m31OvplZIWDwMjwq-zKSLi_aEkA4ePsCpu1aVkvi8PnEGabqpEaCnuq-3B8mDghPonQAsPHrCO1AbVlefH0fas2m_-PUGHoT4uFooGyGzu4qPjNolVj_f9wkBnYWNysZh_PMO-F-SCMEjmdHezU6A97Db2dBarzUx2S9mi1iAwtdM4Ncon2XztJd5MGpwfHt3RtXKW-OFwMSmwqCBTCKmT6luJ4'
    },
    {
      id: 5,
      name: 'Compact 4K Action Camera',
      price: '$179.99',
      rating: 4,
      sold: '3.8k',
      discount: '10% OFF',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 6,
      name: 'Ergonomic Office Chair',
      price: '$219.00',
      rating: 5,
      sold: '980',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 7,
      name: 'Smartwatch Series 8',
      price: '$249.99',
      rating: 4,
      sold: '5.1k',
      discount: '15% OFF',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 8,
      name: 'Portable Bluetooth Speaker',
      price: '$59.99',
      rating: 4,
      sold: '2.7k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 9,
      name: 'Home Coffee Espresso Machine',
      price: '$329.00',
      rating: 5,
      sold: '1.2k',
      discount: '20% OFF',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 10,
      name: 'Wireless Gaming Mouse',
      price: '$69.99',
      rating: 4,
      sold: '4.5k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 11,
      name: 'Premium Laptop Stand',
      price: '$39.99',
      rating: 4,
      sold: '2.1k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    },
    {
      id: 12,
      name: 'Noise-Isolation Earbuds',
      price: '$39.49',
      rating: 4,
      sold: '6.8k',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTj31CnuMLQ6cQBBl3k2kAbLd775dsCNCWaauOnaOpLxrdh5mz3mrQqlmkQIDKjsZ5gnlxiOW6fFQYfW58WpmF-_PWeMA477DfONTXdb-Zq7T39gho-ByVMRfv40r6vyR3S-tBtbwtqOM_jUQWkDBoNdUfqdlzTMia9wvCVcDzSgVL-HWkXKN7iwbt0xrnCs5eFneo3o6B2emfOelJSOmbtcs_DQ5iKMIsp23wh-KmtOf2zRHWSeFCnVtPJ03EnzBYSV1hn-c3ME21'
    }
  ];

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2 bg-white/50 p-2 rounded">
        <h2 className="text-base font-medium text-heading">Recommended for You</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-body-text">Sort by:</span>
          <select className="bg-white border border-black/10 text-sm px-4 py-1.5 rounded focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
            <option>Most Popular</option>
            <option>Lowest Price</option>
            <option>Newest Arrival</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Skeleton cards */}
        <ProductCard isSkeleton />
        <ProductCard isSkeleton />
      </div>
      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-1 text-sm">
          <button className="px-4 py-2 text-body-text hover:text-primary transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-medium">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/10 transition-colors">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/10 transition-colors">3</button>
          <span className="px-2 text-gray-400">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-primary/10 transition-colors">12</button>
          <button className="px-4 py-2 text-body-text hover:text-primary transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;