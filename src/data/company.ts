/** Public identity and locations confirmed by the owner on 2026-11-05. */
export const companyProfile = {
  brand: { name: 'HAN XING', alternateName: 'Hanxing Capacitor', logo: '/images/hanxing-logo.svg' },
  name: 'Hangzhou Zebang Refrigeration Equipment Co., Ltd.',
  socialProfiles: [
    { id: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/p/Hanxing-capacitor-factory-61586759634724/' },
    { id: 'instagram', name: 'Instagram', url: 'https://www.instagram.com/hanxing_capacitor/reels/' },
  ],
  headquarters: {
    label: 'Headquarters — Hangzhou',
    address: 'Qiaolehui Commercial Center, Shangcheng District, Hangzhou, Zhejiang, China',
    postalAddress: { streetAddress: 'Qiaolehui Commercial Center, Shangcheng District', addressLocality: 'Hangzhou', addressRegion: 'Zhejiang', addressCountry: 'CN' },
  },
  manufacturing: {
    label: 'Manufacturing facility — Hebei',
    address: 'Jiegu Village, Jiegu Township, Pingxiang County, Xingtai, Hebei, China',
    postalAddress: { streetAddress: 'Jiegu Village, Jiegu Township, Pingxiang County', addressLocality: 'Xingtai', addressRegion: 'Hebei', addressCountry: 'CN' },
  },
  contact: {
    email: 'ManuelaMusio570@gmail.com', whatsapp: '+86 153 3339 4111',
    officeMobile: '+86 193 0339 1011', officePhone: '+86 571 8521 3638',
    // Lossless QR crops from the owner's 2026-11-10 contact cards.
    wechat: { name: 'HANXINGcapacitor Ming', qr: '/images/contact/wechat-qr.webp', qrSize: 771 },
    whatsappBusiness: {
      url: 'https://wa.me/message/TMUTV7RE2EYAM1?src=qr', qr: '/images/contact/whatsapp-qr.webp', qrSize: 661,
    },
  },
} as const;

export const companyRelationship = 'HAN XING is the capacitor brand of Hangzhou Zebang Refrigeration Equipment Co., Ltd., headquartered in Hangzhou, Zhejiang. Its manufacturing facility is located in Pingxiang County, Xingtai, Hebei, China.';
