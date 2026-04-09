const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const mocks = [
  'WHATSAPP_ENQUIRIES', 'GROUP_ORDERS', 'STOCK_HISTORY', 'COUPONS', 
  'FESTIVALS', 'STAFF', 'RECENT_ORDERS', 'TOP_PRODUCTS', 'REVIEWS', 
  'CUSTOMERS', 'PRODUCTS_LIST'
];

for (const m of mocks) {
  content = content.replace(new RegExp('const ' + m + ' = \\\\[[\\\\s\\\\S]*?\\\\];', 'g'), '');
}

if (!content.includes('subscribeToWhatsAppEnquiries')) {
  // add to imports
  const imp = "import { subscribeToAllProducts } from '@/lib/firebase/productService';\nimport { subscribeToWhatsAppEnquiries, subscribeToGroupOrders, subscribeToStockHistory, subscribeToCoupons, subscribeToFestivals, subscribeToStaff, subscribeToTopProducts, subscribeToReviews, subscribeToCustomers } from '@/lib/firebase/adminService';\n";
  content = content.replace("import { subscribeToAllProducts } from '@/lib/firebase/productService';", imp);
}

function injectState(tabFunc, statesInit) {
  content = content.replace(new RegExp('function ' + tabFunc + '\\\\(\\\\) \\\\{'), 'function ' + tabFunc + '() {\\n' + statesInit);
}

injectState('DashboardTab', \
  const [RECENT_ORDERS, setRecentOrders] = useState<any[]>([]);
  const [TOP_PRODUCTS, setTopProducts] = useState<any[]>([]);
  const [STOCK_HISTORY, setStockHistory] = useState<any[]>([]);
  
  useEffect(() => {
    const unsubR = subscribeToAllOrders(setRecentOrders);
    const unsubT = subscribeToTopProducts(setTopProducts);
    const unsubS = subscribeToStockHistory(setStockHistory);
    return () => { unsubR(); unsubT(); unsubS(); };
  }, []);
\);

injectState('CustomersTab', \
  const [CUSTOMERS, setCustomers] = useState<any[]>([]);
  useEffect(() => {
    return subscribeToCustomers(setCustomers);
  }, []);
\);

injectState('ReviewsTab', \
  const [REVIEWS, setReviews] = useState<any[]>([]);
  useEffect(() => {
    return subscribeToReviews(setReviews);
  }, []);
\);

injectState('CouponsTab', \
  const [COUPONS, setCoupons] = useState<any[]>([]);
  const [FESTIVALS, setFestivals] = useState<any[]>([]);
  useEffect(() => {
    const uC = subscribeToCoupons(setCoupons);
    const uF = subscribeToFestivals(setFestivals);
    return () => { uC(); uF(); };
  }, []);
\);

injectState('StaffTab', \
  const [STAFF, setStaff] = useState<any[]>([]);
  useEffect(() => {
    return subscribeToStaff(setStaff);
  }, []);
\);

injectState('WhatsAppMgmtTab', \
  const [WHATSAPP_ENQUIRIES, setWhatsapp] = useState<any[]>([]);
  useEffect(() => {
    return subscribeToWhatsAppEnquiries(setWhatsapp);
  }, []);
\);

injectState('GroupOrdersTab', \
  const [GROUP_ORDERS, setGroupOrders] = useState<any[]>([]);
  useEffect(() => {
    return subscribeToGroupOrders(setGroupOrders);
  }, []);
\);

injectState('InventoryTab', \
  const [PRODUCTS_LIST, setProductsList] = useState<any[]>([]);
  useEffect(() => {
    return subscribeToAllProducts(setProductsList);
  }, []);
\);

fs.writeFileSync('src/app/admin/page.tmp.tsx', content);
console.log('Script done');
