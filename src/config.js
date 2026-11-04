export const config = {
 apiUrl: import.meta.env.VITE_API_URL || '/api/products',
 csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS95wEXiTqhFt2Hi1-xoNWDqZ2jmKqSass5ADEGQVtIN2Cy4C6M2r27xFOBdxjGq0bdRuFZFnw2UD4M/pub?gid=0&single=true&output=csv',
 whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '59170113116',
 qrExpiration: import.meta.env.VITE_QR_EXPIRATION || '2028-10-22',
};
export const whatsappLink = (message) => 'https://wa.me/' + config.whatsapp + '?text=' + encodeURIComponent(message);
