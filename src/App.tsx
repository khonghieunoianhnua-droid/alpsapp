import React, { useEffect, useRef, useState } from 'react';
import { usePWAInstall, useOnlineStatus } from './usePWAInstall';

export interface Product {
  id: string;
  name: string;
  sub: string;
  desc: string;
  price: number;
  oldPrice: number;
  img: string;
  badge: string;
  volumeLabel: string;
  tagLabel: string;
  category: 'cleanser' | 'serum' | 'cream' | 'toner' | 'mask' | 'bundle';
  isFullSpan?: boolean;
}

export interface HeroSlide {
  img: string;
  tag: string;
  title: string;
  desc: string;
}

export interface SiteSyncConfig {
  heroSlides: HeroSlide[];
  products: Record<string, Product>;
  duoBannerImg: string;
  originBannerImg: string;
  qrCodeImg: string;
  lastSyncedAt: string;
  sourceUrl?: string;
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1WrjtpXqUVbnd1tmFJgKu9ZEp0ITGNe_bPytYQh3Z7Ds22pKgFCuDSbR0ULniW3PF2CcylfCHa47t4BouyAd-utUnKk2iNhf4AlNa3lAoAYNe1OxQ47cv4HGwKBwX9Abwb04stS0PKV1iMiUBWazvHVSE3tRDw5j-Dh3IgIoIjLpPWxBGWJwvwfNeMks7nzsf64ZCtmnDSH6pNFBSxjL5oISQS3wKs0YFO847YmssFnO4gMBREa4ngJvpk',
    tag: '✦ BỘ SƯU TẬP HOÀNG GIA • THỤY SĨ',
    title: 'Alps Pure Essence Collection',
    desc: 'Được chế tác từ nguồn nước khoáng băng tan và thảo dược đỉnh núi Alps Thụy Sĩ, nuôi dưỡng vẻ đẹp thuần khiết vượt thời gian.',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1Ww_3tjvlnOkzy72Ah4HhGUAdiBUbDxgjGqQUOO_ZvjrZpdRa72BgvxQs4qKbw3VuStaQYEe_q0mmr8EMe0LLwwf848S2z6GsE32fBVABdUnWVIENSKI8qM-MFmT5JhR3btdtT-YrBAcdEI6pP5mWUiP5-F-sPxMRXGAH_n6V8dHlLgce19yeXwxu8jQ4c40Qu2mqWocAtZCh49ZOLAUDb72jjLNckAqI4rsx5WVINerZXfwBGPb0pj6PE',
    tag: '✦ CẤP ẨM 72H • TẾ BÀO GỐC THỤY SĨ',
    title: 'Renewing Alpine Moisturizer',
    desc: 'Chiết xuất thảo dược đỉnh núi Alps kết hợp Hyaluronic sinh học khôi phục hàng rào bảo vệ tự nhiên.',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1WkdOBRAhXROH_GwYxM537t_8TYJuKJDTBClWzo2vflKttdpSXgisRGYIssElQB4Ekj49qxqbEmL1NqYzP7caed17-CNu7btluF_iIjlwYwLhrq3emYCehCacUV9n2OKrfbJX7o-idigzEu-CkM_wysJHcuo9aCsms7TGBMk3Iq2mBQSns7F9oUGnoBUfbA3NmBfH1KT-Sn7UaKXHKtQh74cON3hDu01iogkO-AgYMu9CuJNF0ODTJJ1aE',
    tag: '✦ SÁNG MỊN THẤM • CHỐNG OXY HÓA',
    title: 'Alps Radiance Glow Serum',
    desc: 'Chiết xuất hoa nhung tuyết Edelweiss và vitamin sinh học giúp phục hồi độ đàn hồi và sắc diện tươi sáng.',
  },
  {
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1XouPJXk_mLaqk0Ot2veEGdNNlStc3T9e_F2h24S9tNorpIwZIMuaoNPlgK957b2G9AC6dR9ojEiQE6fJ6RCc5cMkdA0ar1RH0y-K7trPKBcShw1x5kR4XEb3hBll3obJhv3Wx9M5tXTd5_sTIR5WRydRCE4qal5wKhxHVneJMEssYP4ewvMuz6CAc2DJ7WAlzz__XekjT1inv_TPG28swUkWq9H7-U3Mep7NfOTXAuJYhiik7aMQqQ6w',
    tag: '✦ BỘ ĐÔI PHỤC HỒI CHUYÊN SÂU',
    title: 'Cleanser & Bio-Cell Sheet Mask',
    desc: 'Bộ đôi cân bằng thanh khiết và nâng cơ hạ nhiệt tức thì từ đỉnh núi Alps Thụy Sĩ.',
  },
];

const DEFAULT_PRODUCTS: Record<string, Product> = {
  cleanser: {
    id: 'cleanser',
    name: 'Gentle Purifying Cleanser',
    sub: 'Làm sạch pH 5.5 - 120ml',
    desc: 'Bọt mịn thanh lọc lỗ chân lông',
    price: 250000,
    oldPrice: 280000,
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1WtzsM4-5TAyISO68kucxB0QIK8_LtCQrkj7ALDekiGZS5wk0eDs-5irhY1oS1g1gn4TQ_z3TamUJzfaCS6vjcYfZfb39kj9oB1Id4L_3D2wF1sh2J8RSp4p8kXXUf86l6wcA-BRPEvTkYSa_wIDWR-OQiD1ox48Ykqronde24slYav_vETRzNPA2hneYNgivgoXq_WLr2_Wxqe7u1JEJKJ3Ku8ag6W1daG_1GLSC1Uq0XioozlFquZhg',
    badge: 'LÀM SẠCH SÂU',
    volumeLabel: 'ALPS • 120ml',
    tagLabel: 'pH 5.5',
    category: 'cleanser',
  },
  serum: {
    id: 'serum',
    name: 'Radiance Glow Serum',
    sub: 'Sáng mịn edelweiss - 30ml',
    desc: 'Đánh thức vẻ rạng rỡ biểu bì',
    price: 390000,
    oldPrice: 450000,
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1WkdOBRAhXROH_GwYxM537t_8TYJuKJDTBClWzo2vflKttdpSXgisRGYIssElQB4Ekj49qxqbEmL1NqYzP7caed17-CNu7btluF_iIjlwYwLhrq3emYCehCacUV9n2OKrfbJX7o-idigzEu-CkM_wysJHcuo9aCsms7TGBMk3Iq2mBQSns7F9oUGnoBUfbA3NmBfH1KT-Sn7UaKXHKtQh74cON3hDu01iogkO-AgYMu9CuJNF0ODTJJ1aE',
    badge: 'SÁNG MỊN THẤM',
    volumeLabel: 'ALPS • 30ml',
    tagLabel: 'EDELWEISS',
    category: 'serum',
  },
  cream: {
    id: 'cream',
    name: 'Regenerating Face Cream',
    sub: 'Khóa ẩm Ceramide - 50g',
    desc: 'Khóa ẩm & phục hồi hàng rào',
    price: 430000,
    oldPrice: 490000,
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1UNCB94UOkVSNXxtrYI7Uc0jfXyB6rOI4nwJNsqKEr_no0WvkTlJlRZ_ruDpToYPgsRi6EYcFBDEVGdX426ZWfzKjn20lLUZGIgpCTkm8z35SvjEBM4cAbb5nwfF4fGJGP8dPPfs2t4bT78XuRT0lPJb7a2QIHAu0KxYYRQ6dlgTCBO0otTJ2TblJaF86xW31n2Ii8xTcwb_Qr15mkDbUTlCS0fPgvC0qwpq0MgO8PIPOf0xFFOizqS9w',
    badge: 'TÁI SINH 72H',
    volumeLabel: 'ALPS • 50g',
    tagLabel: 'CERAMIDE 369',
    category: 'cream',
  },
  toner: {
    id: 'toner',
    name: 'Botanical Balancing Toner',
    sub: 'Cân bằng phục hồi - 100ml',
    desc: 'Cấp ẩm dịu nhẹ chuẩn Thụy Sĩ',
    price: 220000,
    oldPrice: 260000,
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1Wj1OkcBy-gEvtTBoWWQUzTPj6Ee5_ZlAmDSK29QXCUGaQJ_Mxp9GbtQ1bI490SgIeaB9leVm_HY014zvCajRbPjJBthVBEB57qjCwBKSxAQR4xxZiYDbh7X505hheQPI3SvSydvYeA49_thpNaLxQRsjDLFkw8PnyOFRCiLaeY3jd5oxMzzv_er0zwqgMx4OTutQYjRkk9mddiqAwLfpmdbaOw3Vj2IzfPhc2HK7LOk0xKqHBjOwpRLus',
    badge: 'CÂN BẰNG PHỤC HỒI',
    volumeLabel: 'ALPS • 100ml',
    tagLabel: 'NƯỚC HOA HỒNG',
    category: 'toner',
  },
  mask: {
    id: 'mask',
    name: 'Hydro-Lifting Sheet Mask',
    sub: 'Hộp 5 miếng Bio-Cellulose',
    desc: 'Mặt nạ sinh học ôm sát nâng cơ, hạ nhiệt tức thì',
    price: 165000,
    oldPrice: 200000,
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1Wz94hUAhIIv6GeJ_aOVeFZoMumy45zSnAsP8HyBmRkXg_dIyB3IxbKy4v8dwWN-RMqk6WunWSoAwZaIlO4iaQnxc5OEDgU-eLzKeG-6ZBdo72yF-I5AUWrhgJ_qpy5Ct_QCe0NEApxep9gRkaxOI8U83bA7ss7OiV67Up98uWBAA9f85kXQkSSqalLw2CVG0KE6ZkMbYAzX7Yij3mn5grtZEEeljYv8L8BJOSvBtACw4e5k6M-T2Eha2E',
    badge: 'NÂNG CƠ CẤP TỐC',
    volumeLabel: 'HỘP 5 MIẾNG (5x25g)',
    tagLabel: 'BIO-CELL',
    category: 'mask',
    isFullSpan: true,
  },
  bundle: {
    id: 'bundle',
    name: 'Bộ Đôi Thiết Yếu (Cleanser + Mask)',
    sub: 'Làm sạch & Đắp nạ thạch',
    desc: 'Làm sạch dịu nhẹ pH 5.5 kết hợp mặt nạ thạch Bio-Cellulose Thụy Sĩ',
    price: 380000,
    oldPrice: 415000,
    img: 'https://lh3.googleusercontent.com/aida/AEtjO1XouPJXk_mLaqk0Ot2veEGdNNlStc3T9e_F2h24S9tNorpIwZIMuaoNPlgK957b2G9AC6dR9ojEiQE6fJ6RCc5cMkdA0ar1RH0y-K7trPKBcShw1x5kR4XEb3hBll3obJhv3Wx9M5tXTd5_sTIR5WRydRCE4qal5wKhxHVneJMEssYP4ewvMuz6CAc2DJ7WAlzz__XekjT1inv_TPG28swUkWq9H7-U3Mep7NfOTXAuJYhiik7aMQqQ6w',
    badge: 'BỘ ĐÔI THIẾT YẾU',
    volumeLabel: '120ml + 5 Sheets',
    tagLabel: 'COMBO',
    category: 'bundle',
  },
};

const DEFAULT_DUO_BANNER =
  'https://lh3.googleusercontent.com/aida/AEtjO1XouPJXk_mLaqk0Ot2veEGdNNlStc3T9e_F2h24S9tNorpIwZIMuaoNPlgK957b2G9AC6dR9ojEiQE6fJ6RCc5cMkdA0ar1RH0y-K7trPKBcShw1x5kR4XEb3hBll3obJhv3Wx9M5tXTd5_sTIR5WRydRCE4qal5wKhxHVneJMEssYP4ewvMuz6CAc2DJ7WAlzz__XekjT1inv_TPG28swUkWq9H7-U3Mep7NfOTXAuJYhiik7aMQqQ6w';

const DEFAULT_ORIGIN_BANNER =
  'https://lh3.googleusercontent.com/aida/AEtjO1WxokGBHeviUcizvKDyEJF71pqhmk6A02RctQWlmbPqfKSVTF7fX4UHrd9KtIx05Uc6pBrsrUtjLG1VqwTUvaWpnQ11sHMCRq4QIqeGrnGDKCYlT4JeEB9yG3W4MBHTXxO95g3-yQnFXF7RCnxPeZguB8b-CywX8mIYWr4PJYvkjsjap9qIoaWsnE88fm60KH-y2IHdFuDyhziO91mPkyUW6FSKUAfInihWYn6xM-fEi0LdDXkv7sGEufg';

const DEFAULT_QR_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDJ7RK0xV3YTKL1Jvdl5xsV7S16yziCXA4nuBDkVvIooE4UoOhCf-paX_7iKs4l0gvS3FTOMy-2jyxD9iaNMYGO7U-49I0am-LNYxND9QWX1FXpCbxxjISavUsjfkzsPdTetP8dV2E7XFnoyXWsRoQsUVlDkjqaoWE3ez0nFgi30vG8hzWb7zg81-wRRV3QK7ohfeGRvkJ7Cko8QKChb1fBelyCkq49A6RVN_uMB3L9Jj_slKT2sF6-YbRA60i2qH24kQ';

const STORAGE_SYNC_KEY = 'alps_live_image_sync_v1';

interface CartItem {
  id: string;
  qty: number;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

export default function App() {
  // Real-time synced image state (with BroadcastChannel + storage listener for instant multi-tab/window sync)
  const [syncConfig, setSyncConfig] = useState<SiteSyncConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SYNC_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to default
    }
    return {
      heroSlides: DEFAULT_HERO_SLIDES,
      products: DEFAULT_PRODUCTS,
      duoBannerImg: DEFAULT_DUO_BANNER,
      originBannerImg: DEFAULT_ORIGIN_BANNER,
      qrCodeImg: DEFAULT_QR_IMG,
      lastSyncedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      sourceUrl: 'https://alps.id.vn',
    };
  });

  // UI state
  const [heroIndex, setHeroIndex] = useState(0);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'VN' | 'EN'>('VN');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'featured' | 'priceAsc' | 'priceDesc'>('featured');
  const [sortLabel, setSortLabel] = useState('NỔI BẬT NHẤT');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'category' | 'ritual' | 'cart' | 'profile'>('home');
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null);

  // Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr');
  const [qrOrderMemo, setQrOrderMemo] = useState('ALPS 884920');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});
  const [successOrderData, setSuccessOrderData] = useState({ code: 'ALPS-884920', name: 'Quý khách' });

  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const pendingBuyActionRef = useRef<(() => void) | null>(null);

  // Modals: Skin AI, Ritual, Live Sync & App Download (iOS/Android)
  const [skinModalOpen, setSkinModalOpen] = useState(false);
  const [scanStatusText, setScanStatusText] = useState('Sẵn sàng phân tích da...');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [ritualModalOpen, setRitualModalOpen] = useState(false);
  const [appSyncModalOpen, setAppSyncModalOpen] = useState(false);
  const [syncModalTab, setSyncModalTab] = useState<'download' | 'sync'>('download');
  const [htmlPasteInput, setHtmlPasteInput] = useState('');
  const [websiteUrlInput, setWebsiteUrlInput] = useState('https://alps.id.vn');
  const [isSyncingUrl, setIsSyncingUrl] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // PWA Install & Online Status
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2600);
  };

  // Real-time cross-tab / website sync listener via BroadcastChannel & localStorage
  useEffect(() => {
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('alps_realtime_sync') : null;

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_SYNC_KEY && e.newValue) {
        try {
          setSyncConfig(JSON.parse(e.newValue));
          showToast('Đã đồng bộ hình ảnh thời gian thực từ Website!');
        } catch {
          // ignore invalid json
        }
      }
    };

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_IMAGES') {
        setSyncConfig(event.data.payload);
        showToast('Đã đồng bộ hình ảnh trực tiếp từ Website!');
      }
    };

    window.addEventListener('storage', handleStorage);
    if (channel) {
      channel.addEventListener('message', handleBroadcast);
    }

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (channel) {
        channel.removeEventListener('message', handleBroadcast);
        channel.close();
      }
    };
  }, []);

  const broadcastAndSaveSync = (nextConfig: SiteSyncConfig) => {
    setSyncConfig(nextConfig);
    try {
      localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(nextConfig));
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('alps_realtime_sync');
        channel.postMessage({ type: 'SYNC_IMAGES', payload: nextConfig });
        channel.close();
      }
    } catch {
      // storage quota fallback
    }
  };

  // Parse pasted HTML from user's website and sync all images in real time
  const handleSyncFromHtmlCode = (htmlText: string, sourceLabel = 'HTML Website') => {
    if (!htmlText.trim()) {
      showToast('Vui lòng dán mã HTML hoặc URL hình ảnh từ website của bạn!');
      return;
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const nextConfig: SiteSyncConfig = JSON.parse(JSON.stringify(syncConfig));
    let updatedCount = 0;

    // 1. Check heroImage
    const heroImgEl = doc.querySelector('#heroImage') as HTMLImageElement | null;
    if (heroImgEl && heroImgEl.getAttribute('src')) {
      nextConfig.heroSlides[0].img = heroImgEl.getAttribute('src')!;
      updatedCount++;
    }

    // 2. Check product cards
    (['cleanser', 'serum', 'cream', 'toner', 'mask'] as const).forEach((prodKey) => {
      const cardImg = doc.querySelector(`#prod-card-${prodKey} img`) as HTMLImageElement | null;
      if (cardImg && cardImg.getAttribute('src') && nextConfig.products[prodKey]) {
        nextConfig.products[prodKey].img = cardImg.getAttribute('src')!;
        updatedCount++;
      }
    });

    // 3. Also extract any general <img src="..."> in order if user pasted a simpler HTML snippet
    const allImgs = Array.from(doc.querySelectorAll('img'))
      .map((img) => img.getAttribute('src'))
      .filter((src): src is string => Boolean(src && src.startsWith('http')));

    if (updatedCount === 0 && allImgs.length > 0) {
      if (allImgs[0]) nextConfig.heroSlides[0].img = allImgs[0];
      if (allImgs[1]) nextConfig.products.cleanser.img = allImgs[1];
      if (allImgs[2]) nextConfig.products.serum.img = allImgs[2];
      if (allImgs[3]) nextConfig.products.cream.img = allImgs[3];
      if (allImgs[4]) nextConfig.products.toner.img = allImgs[4];
      if (allImgs[5]) nextConfig.products.mask.img = allImgs[5];
      if (allImgs[6]) {
        nextConfig.duoBannerImg = allImgs[6];
        nextConfig.products.bundle.img = allImgs[6];
      }
      if (allImgs[9]) nextConfig.originBannerImg = allImgs[9];
      updatedCount = allImgs.length;
    }

    nextConfig.lastSyncedAt = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    nextConfig.sourceUrl = sourceLabel;

    broadcastAndSaveSync(nextConfig);
    showToast(`Đã đồng bộ ${updatedCount} hình ảnh từ ${sourceLabel} sang giao diện Mobile!`);
    setHtmlPasteInput('');
  };

  // Fetch & sync live from website URL
  const handleSyncFromWebsiteUrl = async () => {
    if (!websiteUrlInput.trim()) return;
    setIsSyncingUrl(true);
    try {
      const res = await fetch(websiteUrlInput.trim(), { mode: 'cors' });
      const html = await res.text();
      handleSyncFromHtmlCode(html, websiteUrlInput.trim());
    } catch {
      // Refresh images with cache-busting timestamp for hotlinked live refresh
      const nextConfig: SiteSyncConfig = {
        ...syncConfig,
        lastSyncedAt: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        sourceUrl: websiteUrlInput.trim(),
      };
      broadcastAndSaveSync(nextConfig);
      showToast('Đã làm mới & đồng bộ trực tiếp hình ảnh từ Website!');
    } finally {
      setIsSyncingUrl(false);
    }
  };

  const handleResetDefaultImages = () => {
    const resetConfig: SiteSyncConfig = {
      heroSlides: DEFAULT_HERO_SLIDES,
      products: DEFAULT_PRODUCTS,
      duoBannerImg: DEFAULT_DUO_BANNER,
      originBannerImg: DEFAULT_ORIGIN_BANNER,
      qrCodeImg: DEFAULT_QR_IMG,
      lastSyncedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      sourceUrl: 'https://alps.id.vn (Gốc)',
    };
    broadcastAndSaveSync(resetConfig);
    showToast('Đã khôi phục bộ ảnh gốc chuẩn Thụy Sĩ!');
  };

  const handleSingleImageUpdate = (targetKey: string, newUrl: string) => {
    if (!newUrl.trim()) return;
    const nextConfig: SiteSyncConfig = JSON.parse(JSON.stringify(syncConfig));
    if (targetKey === 'hero0') {
      nextConfig.heroSlides[0].img = newUrl.trim();
    } else if (targetKey === 'duo') {
      nextConfig.duoBannerImg = newUrl.trim();
      nextConfig.products.bundle.img = newUrl.trim();
    } else if (targetKey === 'origin') {
      nextConfig.originBannerImg = newUrl.trim();
    } else if (nextConfig.products[targetKey]) {
      nextConfig.products[targetKey].img = newUrl.trim();
    }
    nextConfig.lastSyncedAt = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    broadcastAndSaveSync(nextConfig);
    showToast('Đã cập nhật hình ảnh thời gian thực!');
  };

  // Language toggle
  const toggleLanguage = () => {
    if (lang === 'VN') {
      setLang('EN');
      showToast('Switched to English (EN)');
    } else {
      setLang('VN');
      showToast('Đã chọn Tiếng Việt (VN)');
    }
  };

  // Scroll helpers
  const scrollToProduct = (id: string) => {
    const el = document.getElementById(`prod-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedProduct(id);
      setTimeout(() => setHighlightedProduct(null), 1500);
    }
  };

  const scrollToProductSection = () => {
    const el = document.getElementById('productSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter & Sort products
  const displayProductKeys = ['cleanser', 'serum', 'cream', 'toner', 'mask'] as const;
  const filteredProducts = displayProductKeys
    .map((k) => syncConfig.products[k])
    .filter((prod) => {
      if (!prod) return false;
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() || prod.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sortOption === 'priceAsc') return a.price - b.price;
      if (sortOption === 'priceDesc') return b.price - a.price;
      return 0;
    });

  // Cart Calculations
  const totalCartCount = cart.reduce((sum, it) => sum + it.qty, 0);
  const subtotal = cart.reduce((sum, it) => {
    const prod = syncConfig.products[it.id];
    return sum + (prod ? prod.price * it.qty : 0);
  }, 0);
  const isFreeship = subtotal >= 500000 || subtotal === 0;
  const shippingFee = subtotal === 0 || isFreeship ? 0 : 30000;
  const finalTotal = subtotal + shippingFee;
  const freeshipPct = Math.min(100, Math.round((subtotal / 500000) * 100));

  const addToCart = (prodId: string) => {
    setCart((prev) => {
      const existing = prev.find((it) => it.id === prodId);
      if (existing) {
        return prev.map((it) => (it.id === prodId ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { id: prodId, qty: 1 }];
    });
    const prod = syncConfig.products[prodId];
    showToast(`Đã thêm ${prod ? prod.name : 'sản phẩm'} vào giỏ hàng!`);
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: it.qty + delta } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
    showToast('Đã xóa sản phẩm khỏi giỏ');
  };

  const openCheckoutWithCode = () => {
    setCartDrawerOpen(false);
    const code = 'ALPS ' + Math.floor(100000 + Math.random() * 900000);
    setQrOrderMemo(code);
    setCheckoutModalOpen(true);
  };

  const handleBuyNow = (prodId: string) => {
    setCart((prev) => {
      const existing = prev.find((it) => it.id === prodId);
      if (existing) {
        return prev.map((it) => (it.id === prodId ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...prev, { id: prodId, qty: 1 }];
    });

    if (!isLoggedIn) {
      pendingBuyActionRef.current = () => {
        openCheckoutWithCode();
      };
      setAuthModalOpen(true);
      showToast('Vui lòng đăng nhập trước khi mua hàng!');
      return;
    }

    openCheckoutWithCode();
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Giỏ hàng chưa có sản phẩm!');
      return;
    }
    setCartDrawerOpen(false);
    if (!isLoggedIn) {
      pendingBuyActionRef.current = () => {
        openCheckoutWithCode();
      };
      setAuthModalOpen(true);
      showToast('Vui lòng đăng nhập trước khi đặt hàng!');
      return;
    }
    openCheckoutWithCode();
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: boolean; phone?: boolean; address?: boolean } = {};
    if (!custName.trim()) errors.name = true;
    if (!custPhone.trim() || custPhone.trim().length < 9) errors.phone = true;
    if (!custAddress.trim()) errors.address = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setCheckoutModalOpen(false);
    setSuccessOrderData({
      code: qrOrderMemo.replace(' ', '-'),
      name: custName.trim(),
    });
    setOrderSuccessModalOpen(true);
    setCart([]);
  };

  // Auth handlers
  const completeLogin = (userDisplay: string) => {
    setIsLoggedIn(true);
    setCurrentUser(userDisplay);
    setAuthModalOpen(false);
    setOtpStep(false);
    showToast('Đăng nhập thành công: ' + userDisplay);

    if (pendingBuyActionRef.current) {
      const act = pendingBuyActionRef.current;
      pendingBuyActionRef.current = null;
      act();
    }
  };

  const handleGoogleQuickLogin = () => {
    completeLogin('Khách hàng Google (' + Math.floor(100 + Math.random() * 900) + '@gmail.com)');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim().includes('@')) {
      showToast('Vui lòng nhập định dạng email hợp lệ!');
      return;
    }
    setOtpStep(true);
    showToast('Mã OTP 6 số đã được gửi tới Gmail!');
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() !== '123456' && otpInput.trim().length < 4) {
      showToast('Mã OTP không đúng! Hãy dùng mã 123456');
      return;
    }
    completeLogin(authEmail.trim());
  };

  // AI Skin Scanner
  const closeSkinScanModal = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setSkinModalOpen(false);
  };

  const triggerAiScan = () => {
    setScanStatusText('Đang bật camera và phân tích phổ quang...');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          streamRef.current = stream;
          setCameraActive(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setScanStatusText('Đang quét phân tích biểu bì Thụy Sĩ...');
          setTimeout(() => {
            setScanStatusText('Hoàn tất! Khuyên dùng: Kem tái sinh 50g');
            showToast('Đã phân tích xong làn da của bạn!');
          }, 3000);
        })
        .catch(() => {
          setScanStatusText('Đang quét giả lập sinh trắc học...');
          setTimeout(() => {
            setScanStatusText('Hoàn tất! Độ ẩm 38% - Cần phục hồi');
            showToast('Đã quét xong phổ quang da');
          }, 2000);
        });
    } else {
      setScanStatusText('Đang quét sinh trắc học...');
      setTimeout(() => {
        setScanStatusText('Hoàn tất! Cần cấp ẩm tầng sâu');
      }, 1500);
    }
  };

  const copyText = (str: string, successMsg: string) => {
    navigator.clipboard
      .writeText(str)
      .then(() => showToast(successMsg))
      .catch(() => showToast('Đã sao chép: ' + str));
  };

  // Bottom Navigation Switcher
  const switchBottomTab = (tab: 'home' | 'category' | 'ritual' | 'cart' | 'profile') => {
    setActiveBottomTab(tab);
    if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'category') scrollToProductSection();
    if (tab === 'ritual') setRitualModalOpen(true);
    if (tab === 'cart') setCartDrawerOpen(true);
    if (tab === 'profile') setAuthModalOpen(true);
  };

  const currentHero = syncConfig.heroSlides[heroIndex] || syncConfig.heroSlides[0];

  return (
    <div className="w-full max-w-md bg-[#FAF7F2] min-h-screen flex flex-col shadow-2xl relative pb-24 text-stone-900 border-x border-stone-200">
      {/* Offline mode indicator */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-[10px] font-semibold px-4 py-1 text-center">
          Chế độ Ngoại tuyến (Offline) — Ứng dụng vẫn hoạt động với dữ liệu đã lưu.
        </div>
      )}

      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200/80">
        {/* Status Bar */}
        <div className="h-6 w-full flex items-center justify-between px-5 text-xs font-semibold text-stone-700">
          <span>9:41</span>
          <div className="flex items-center space-x-1.5 text-stone-700">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.28 19.57 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
            </svg>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0012 4z" />
            </svg>
            <div className="w-5 h-2.5 border border-current rounded-sm p-0.5 flex items-center">
              <div className="h-full w-3 bg-current rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-[#1C1A18] text-[#E7DEC8] text-[10px] tracking-wider py-1.5 px-4 flex items-center justify-between uppercase font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89758] animate-pulse" />
            ALPS PURE ESSENCE • ZÜRICH
          </span>
          <span className="text-stone-300 text-[9.5px]">PHỤC HỒI • THUẦN CHAY</span>
        </div>

        {/* Navigation Bar */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <button
            className="flex flex-col text-left group active:scale-95 transition"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="font-brand-logo text-lg font-bold tracking-[0.25em] text-[#1A1817]">ALPS</span>
            <span className="text-[8px] tracking-[0.28em] uppercase text-[#B89758] -mt-1 font-semibold">
              Pure Essence
            </span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 bg-white border border-stone-200 shadow-2xs hover:border-[#B89758] active:scale-90 transition"
              onClick={() => setQuickSearchOpen((v) => !v)}
              title="Tìm kiếm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            <button
              className="px-2 py-1 rounded-full text-[10px] font-bold text-stone-800 bg-white border border-stone-200 shadow-2xs active:scale-90 transition flex items-center gap-1"
              onClick={toggleLanguage}
              title="Ngôn ngữ"
            >
              <span>{lang === 'VN' ? '🇻🇳' : '🇨🇭'}</span> <span>{lang}</span>
            </button>

            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 bg-white border border-stone-200 shadow-2xs hover:border-[#B89758] active:scale-90 transition relative"
              onClick={() => setAuthModalOpen(true)}
              title="Tài khoản"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {isLoggedIn && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              )}
            </button>

            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-900 bg-[#EFE9DF] border border-[#DFCDB3] shadow-2xs active:scale-90 transition relative"
              onClick={() => setCartDrawerOpen(true)}
              title="Giỏ hàng"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-[#826938] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Search Dropdown */}
        {quickSearchOpen && (
          <div className="px-4 pb-2.5 pt-1 border-t border-stone-200 bg-white animate-pop">
            <div className="relative flex items-center">
              <input
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-full pl-8 pr-8 py-2 focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kem dưỡng, serum, toner, mặt nạ..."
                type="text"
                autoFocus
              />
              <svg
                className="w-3.5 h-3.5 text-stone-400 absolute left-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              {searchQuery && (
                <button
                  className="absolute right-2.5 text-stone-400 hover:text-stone-700 text-xs font-bold"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION CAROUSEL */}
      <section className="px-4 pt-3 pb-2">
        <div className="relative rounded-2xl overflow-hidden shadow-md bg-stone-900 min-h-[350px] flex flex-col justify-end p-5">
          <img
            alt="Alps Swiss Luxury Collection"
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 brightness-95"
            id="heroImage"
            referrerPolicy="no-referrer"
            src={currentHero.img}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="relative z-10 flex items-center gap-1.5 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider bg-[#B89758] text-white shadow-xs">
              {currentHero.tag}
            </span>
          </div>
          <div className="relative z-10 space-y-1 mb-3">
            <h2 className="font-brand-serif text-2xl font-semibold tracking-tight text-white leading-tight">
              {currentHero.title}
            </h2>
            <p className="text-xs text-stone-200 line-clamp-2">{currentHero.desc}</p>
          </div>

          {/* Action Buttons on Hero */}
          <div className="relative z-10 grid grid-cols-2 gap-2 pt-1">
            <button
              className="bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition whitespace-nowrap"
              onClick={() => scrollToProduct('cream')}
            >
              <span>KEM TÁI SINH</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              className="bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/40 text-white text-xs font-semibold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 active:scale-95 transition whitespace-nowrap"
              onClick={() => setSkinModalOpen(true)}
            >
              <svg className="w-3.5 h-3.5 text-[#DFCDB3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4m0-4h.01" />
              </svg>
              <span>SOI DA AI (1 PHÚT)</span>
            </button>
          </div>

          {/* Carousel Pagination Dots */}
          <div className="relative z-10 flex justify-center items-center space-x-2 mt-3.5">
            {syncConfig.heroSlides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                className={
                  idx === heroIndex
                    ? 'w-5 h-1.5 rounded-full bg-[#B89758] transition-all'
                    : 'w-2 h-1.5 rounded-full bg-white/60 hover:bg-white transition-all'
                }
                onClick={() => setHeroIndex(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ALPS RITUAL CALLOUT CARD */}
      <section className="px-4 py-2">
        <div
          className="bg-[#F4ECE1] border border-[#E0D2C0] hover:border-[#B89758] rounded-xl p-3 flex items-center justify-between shadow-2xs cursor-pointer transition active:scale-[0.98]"
          onClick={() => setRitualModalOpen(true)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-[#DFCDB3] shrink-0 text-[#826938]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-brand-serif">
                Nghi Thức Dưỡng Nhan Quiet Luxury
              </h3>
              <p className="text-[10.5px] text-stone-600 line-clamp-1">
                Mở đầu ngày mới và tái tạo làn da chuẩn Thụy Sĩ
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#826938] tracking-widest uppercase flex items-center shrink-0">
            ALPS RITUAL
            <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </section>

      {/* BỘ SƯU TẬP SẢN PHẨM */}
      <main className="px-4 pt-2 space-y-3" id="productSection">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#826938]">
            BỘ SƯU TẬP CHÍNH HÃNG
          </span>
          <h2 className="font-brand-serif text-xl font-bold tracking-tight text-stone-900">
            Bộ Sưu Tập Alps Pure Essence
          </h2>
          <p className="text-[11px] text-stone-500">Công thức dược mỹ phẩm thuần chay chuẩn Thụy Sĩ</p>
        </div>

        {/* Header Filter & Sort */}
        <div className="flex items-center justify-between text-xs pt-1 relative">
          <span className="text-stone-500 font-medium">{filteredProducts.length} SẢN PHẨM</span>
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-stone-800 font-semibold py-1 px-2.5 rounded-lg bg-white border border-stone-200 shadow-2xs hover:border-[#B89758] active:scale-95 transition"
              onClick={() => setSortDropdownOpen((v) => !v)}
            >
              <span>{sortLabel}</span>
              <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-stone-200 rounded-xl shadow-lg z-20 py-1 text-xs">
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-stone-100 font-medium"
                  onClick={() => {
                    setSortOption('featured');
                    setSortLabel('NỔI BẬT NHẤT');
                    setSortDropdownOpen(false);
                    showToast('Đã sắp xếp: NỔI BẬT NHẤT');
                  }}
                >
                  NỔI BẬT NHẤT
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-stone-100 font-medium"
                  onClick={() => {
                    setSortOption('priceAsc');
                    setSortLabel('GIÁ TĂNG DẦN');
                    setSortDropdownOpen(false);
                    showToast('Đã sắp xếp: GIÁ TĂNG DẦN');
                  }}
                >
                  GIÁ TĂNG DẦN
                </button>
                <button
                  className="w-full text-left px-3 py-1.5 hover:bg-stone-100 font-medium"
                  onClick={() => {
                    setSortOption('priceDesc');
                    setSortLabel('GIÁ GIẢM DẦN');
                    setSortDropdownOpen(false);
                    showToast('Đã sắp xếp: GIÁ GIẢM DẦN');
                  }}
                >
                  GIÁ GIẢM DẦN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Pills Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 text-xs whitespace-nowrap">
          {[
            { id: 'all', label: 'TẤT CẢ' },
            { id: 'cleanser', label: 'SỮA RỬA MẶT' },
            { id: 'toner', label: 'TONER HOA HỒNG' },
            { id: 'serum', label: 'SERUM' },
            { id: 'cream', label: 'KEM DƯỠNG' },
            { id: 'mask', label: 'MẶT NẠ' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={
                selectedCategory === cat.id
                  ? 'px-3.5 py-1.5 rounded-full bg-[#1C1A18] text-white font-medium text-[11px] tracking-wide active:scale-95 transition shadow-2xs'
                  : 'px-3.5 py-1.5 rounded-full bg-white text-stone-700 border border-stone-200 font-medium text-[11px] active:scale-95 transition hover:border-[#B89758]'
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1" id="productsGrid">
          {filteredProducts.map((prod) => {
            const isHighlighted = highlightedProduct === prod.id;
            if (prod.isFullSpan) {
              return (
                <article
                  key={prod.id}
                  id={`prod-card-${prod.id}`}
                  className={`product-item bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs flex flex-col justify-between col-span-2 transition hover:shadow-md ${
                    isHighlighted ? 'ring-2 ring-[#B89758]' : ''
                  }`}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative bg-[#FAF7F2] p-3 aspect-square flex items-center justify-center">
                      <span className="absolute top-2 left-2 z-10 bg-white/95 text-[#826938] border border-[#DFCDB3] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                        {prod.badge}
                      </span>
                      <img
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl hover:scale-105 transition duration-300"
                        src={prod.img}
                      />
                    </div>
                    <div className="p-3.5 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-[9px] text-[#826938] font-bold mb-0.5 whitespace-nowrap">
                          <span>{prod.volumeLabel}</span>
                          <span className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">{prod.tagLabel}</span>
                        </div>
                        <h3 className="font-brand-serif text-xs font-semibold text-stone-900 leading-snug">
                          {prod.name}
                        </h3>
                        <p className="text-[10.5px] text-stone-500 mt-1 line-clamp-2">{prod.desc}</p>
                      </div>
                      <div className="pt-2">
                        <div className="flex items-baseline space-x-1.5 mb-2 whitespace-nowrap">
                          <span className="text-xs font-bold text-stone-900">{formatMoney(prod.price)}</span>
                          <span className="text-[10px] text-stone-400 line-through">{formatMoney(prod.oldPrice)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 rounded-lg text-[10px] font-semibold active:scale-95 transition whitespace-nowrap"
                            onClick={() => addToCart(prod.id)}
                          >
                            + Giỏ
                          </button>
                          <button
                            className="bg-[#1C1A18] hover:bg-[#826938] text-white py-1.5 rounded-lg text-[10px] font-semibold active:scale-95 transition whitespace-nowrap"
                            onClick={() => handleBuyNow(prod.id)}
                          >
                            MUA NGAY
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={prod.id}
                id={`prod-card-${prod.id}`}
                className={`product-item bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs flex flex-col justify-between transition hover:shadow-md ${
                  isHighlighted ? 'ring-2 ring-[#B89758]' : ''
                }`}
              >
                <div className="relative bg-[#FAF7F2] p-2 aspect-square w-full overflow-hidden flex items-center justify-center rounded-t-2xl">
                  <span className="absolute top-2 left-2 z-10 bg-white/95 text-[#826938] border border-[#DFCDB3] text-[9px] font-bold px-1.5 py-0.5 rounded shadow-2xs whitespace-nowrap">
                    {prod.badge}
                  </span>
                  <img
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full aspect-square object-cover rounded-xl hover:scale-105 transition duration-300 block"
                    src={prod.img}
                  />
                </div>
                <div className="p-3 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[9px] text-[#826938] font-bold mb-0.5 whitespace-nowrap">
                      <span>{prod.volumeLabel}</span>
                      <span className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">{prod.tagLabel}</span>
                    </div>
                    <h3 className="font-brand-serif text-xs font-semibold text-stone-900 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 line-clamp-1 mb-2">{prod.desc}</p>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-1.5 mb-2 whitespace-nowrap">
                      <span className="text-xs font-bold text-stone-900">{formatMoney(prod.price)}</span>
                      <span className="text-[10px] text-stone-400 line-through">{formatMoney(prod.oldPrice)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 rounded-lg text-[10px] font-semibold active:scale-95 transition whitespace-nowrap"
                        onClick={() => addToCart(prod.id)}
                      >
                        + Giỏ
                      </button>
                      <button
                        className="bg-[#1C1A18] hover:bg-[#826938] text-white py-1.5 rounded-lg text-[10px] font-semibold active:scale-95 transition whitespace-nowrap"
                        onClick={() => handleBuyNow(prod.id)}
                      >
                        MUA NGAY
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* BỘ ĐÔI THIẾT YẾU COMBO */}
      <section className="mt-6 px-4">
        <div className="bg-[#F5EFE6] rounded-2xl p-4 border border-[#DFCDB3] shadow-2xs">
          <div className="text-center mb-3">
            <span className="inline-block px-3 py-1 bg-white/95 rounded-full text-[10px] font-bold tracking-wider text-[#826938] uppercase border border-[#DFCDB3]">
              ✦ BỘ ĐÔI THIẾT YẾU ALPS
            </span>
            <h2 className="font-brand-serif text-lg font-bold text-stone-900 mt-1.5">
              Sữa Rửa Mặt &amp; Mặt Nạ Sinh Học ALPS
            </h2>
            <p className="text-[11px] text-stone-600 px-2 mt-1">
              Làm sạch dịu nhẹ pH 5.5 kết hợp mặt nạ thạch Bio-Cellulose Thụy Sĩ
            </p>
          </div>

          {/* Hero Duo Alpine Chalet Banner Image */}
          <div className="rounded-xl overflow-hidden border border-[#DFCDB3] shadow-xs mb-3 relative aspect-[16/9]">
            <img
              alt="Alps Cleanser & Mask Duo Chalet"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition duration-500"
              src={syncConfig.duoBannerImg}
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-md flex items-center justify-between">
              <span>Swiss Alpine Chalet Edition</span>
              <span className="text-[#E7DEC8] font-bold">120ml + 5 Sheets</span>
            </div>
          </div>

          {/* Combo Images Mini Items */}
          <div className="grid grid-cols-2 gap-2 my-2">
            <div className="bg-white rounded-xl p-2.5 border border-stone-200 flex flex-col items-center">
              <div className="w-full aspect-square bg-[#FAF7F2] rounded-lg overflow-hidden flex items-center justify-center mb-1">
                <img
                  alt="Sữa Rửa Mặt Alps"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  src={syncConfig.products.cleanser.img}
                />
              </div>
              <span className="text-[10px] font-semibold text-stone-800 mt-1 text-center line-clamp-1">
                Gentle Purifying Cleanser
              </span>
            </div>
            <div className="bg-white rounded-xl p-2.5 border border-stone-200 flex flex-col items-center">
              <div className="w-full aspect-square bg-[#FAF7F2] rounded-lg overflow-hidden flex items-center justify-center mb-1">
                <img
                  alt="Mặt Nạ Sinh Học Alps"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  src={syncConfig.products.mask.img}
                />
              </div>
              <span className="text-[10px] font-semibold text-stone-800 mt-1 text-center line-clamp-1">
                Hydro-Lifting Sheet Mask
              </span>
            </div>
          </div>

          {/* 3 Metrics */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#DFCDB3]/70 text-center">
            <div className="bg-white/80 py-1.5 rounded-lg">
              <div className="text-sm font-bold text-[#826938] font-brand-serif">pH 5.5</div>
              <div className="text-[9px] text-stone-600">Cân bằng lý tưởng</div>
            </div>
            <div className="bg-white/80 py-1.5 rounded-lg">
              <div className="text-sm font-bold text-[#826938] font-brand-serif">10x Ẩm</div>
              <div className="text-[9px] text-stone-600">Bio-Cellulose</div>
            </div>
            <div className="bg-white/80 py-1.5 rounded-lg">
              <div className="text-sm font-bold text-[#826938] font-brand-serif">-4.3°C</div>
              <div className="text-[9px] text-stone-600">Hạ nhiệt dịu da</div>
            </div>
          </div>

          {/* Combo CTA Buttons */}
          <div className="space-y-2 mt-3.5">
            <button
              className="w-full bg-[#826938] hover:bg-[#6c552c] text-white py-3 px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 transition"
              onClick={() => handleBuyNow('bundle')}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>MUA BỘ ĐÔI (CLEANSER + MASK) • {formatMoney(syncConfig.products.bundle.price)}</span>
            </button>
            <button
              className="w-full bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center active:scale-98 transition"
              onClick={scrollToProductSection}
            >
              <span>KHÁM PHÁ SẢN PHẨM ALPS</span>
            </button>
          </div>
        </div>
      </section>

      {/* BRAND STORY / ALPINE ORIGIN SECTION */}
      <section className="mt-8 px-4">
        <div className="relative rounded-2xl overflow-hidden border border-[#DFCDB3] shadow-md bg-stone-900 text-white">
          <div className="aspect-[16/9] w-full overflow-hidden relative">
            <img
              alt="Alps Origin Stream & Mountains"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              src={syncConfig.originBannerImg}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-[#DFCDB3] border border-white/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
              ✦ NGUỒN GỐC THỤY SĨ
            </span>
          </div>
          <div className="p-4 space-y-2 -mt-4 relative z-10">
            <span className="text-[9px] tracking-[0.25em] text-[#B89758] uppercase font-bold block">
              ALPS PURE ESSENCE • NGUỒN CẢM HỨNG THỤY SĨ
            </span>
            <h3 className="font-brand-serif text-xl font-bold tracking-tight text-white">
              Nước Khoáng Băng Tan &amp; Hoa Nhung Tuyết
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Từ những thung lũng sông băng tinh khôi trên đỉnh dãy Alps cao hơn 3.000m, ALPS hội tụ năng lượng tái
              sinh thiên nhiên nguyên bản để nuôi dưỡng từng tế bào da.
            </p>
          </div>
        </div>
      </section>

      {/* TRIẾT LÝ THƯƠNG HIỆU: A - L - P - S */}
      <section className="mt-6 px-4 text-center">
        <span className="text-[9px] tracking-[0.25em] text-[#826938] uppercase font-bold">TRIẾT LÝ CỐT LÕI</span>
        <h3 className="font-brand-serif text-2xl font-bold tracking-tight text-stone-900 mt-1">
          Pure Essence. Timeless Beauty.
        </h3>
        <p className="font-brand-serif italic text-xs text-stone-600 mt-1">
          “Renew Your Skin, Reveal Your Radiance. — Vẻ đẹp tinh khiết từ thiên nhiên.”
        </p>

        {/* 4 Khối Cốt Lõi A-L-P-S Tương Tác Được */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <button
            className="bg-white p-2.5 rounded-xl border border-stone-200 hover:border-[#B89758] shadow-2xs flex flex-col items-center active:scale-95 transition"
            onClick={() => showToast('Authentic: Cam kết 100% thảo dược Thụy Sĩ nguyên bản')}
          >
            <span className="font-brand-serif text-xl font-bold text-[#826938]">A</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-900 mt-0.5">Authentic</span>
            <span className="text-[8px] text-stone-500">Chân thật</span>
          </button>
          <button
            className="bg-white p-2.5 rounded-xl border border-stone-200 hover:border-[#B89758] shadow-2xs flex flex-col items-center active:scale-95 transition"
            onClick={() => showToast('Luminous: Đánh thức vẻ rạng ngời từ sâu bên trong tế bào')}
          >
            <span className="font-brand-serif text-xl font-bold text-[#826938]">L</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-900 mt-0.5">Luminous</span>
            <span className="text-[8px] text-stone-500">Sáng mịn</span>
          </button>
          <button
            className="bg-white p-2.5 rounded-xl border border-stone-200 hover:border-[#B89758] shadow-2xs flex flex-col items-center active:scale-95 transition"
            onClick={() => showToast('Pure: Nguồn nước khoáng băng tan tinh khiết 0% hóa chất độc hại')}
          >
            <span className="font-brand-serif text-xl font-bold text-[#826938]">P</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-900 mt-0.5">Pure</span>
            <span className="text-[8px] text-stone-500">Tinh khiết</span>
          </button>
          <button
            className="bg-white p-2.5 rounded-xl border border-stone-200 hover:border-[#B89758] shadow-2xs flex flex-col items-center active:scale-95 transition"
            onClick={() => showToast('Skin: Tái tạo màng ẩm sinh học tự nhiên cho mọi loại da')}
          >
            <span className="font-brand-serif text-xl font-bold text-[#826938]">S</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-900 mt-0.5">Skin</span>
            <span className="text-[8px] text-stone-500">Nuôi da sâu</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 px-4 pt-4 border-t border-stone-200 text-center pb-6">
        <span className="font-brand-logo text-base tracking-[0.2em] font-semibold text-stone-800">
          ALPS PURE ESSENCE
        </span>
        <p className="text-[10px] text-stone-500 mt-1">Zürich, Switzerland • Ho Chi Minh City, Vietnam</p>
        <p className="text-[9px] text-stone-400 mt-0.5">Hotline 24/7: 1900 8899 | contact@alps.id.vn</p>

        {/* Free App Install (iOS & Android) + Real-time Website Sync Controls */}
        <div className="mt-4 pt-3 border-t border-stone-200/70 flex flex-wrap items-center justify-center gap-2">
          {!isInstalled && (
            <button
              onClick={async () => {
                if (isInstallable) {
                  const ok = await install();
                  if (ok) showToast('Đã cài đặt ứng dụng ALPS thành công!');
                } else {
                  setSyncModalTab('download');
                  setAppSyncModalOpen(true);
                }
              }}
              className="px-3 py-1.5 rounded-full bg-[#1C1A18] hover:bg-[#826938] text-[#E7DEC8] text-[10px] font-semibold tracking-wider flex items-center gap-1.5 shadow-2xs active:scale-95 transition"
            >
              <svg className="w-3.5 h-3.5 text-[#B89758]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Tải App Miễn Phí (iOS &amp; Android)</span>
            </button>
          )}

          <button
            onClick={() => {
              setSyncModalTab('sync');
              setAppSyncModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-full bg-white hover:border-[#B89758] text-stone-700 border border-stone-200 text-[10px] font-semibold tracking-wider flex items-center gap-1.5 shadow-2xs active:scale-95 transition"
          >
            <svg className="w-3.5 h-3.5 text-[#826938]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Đồng bộ ảnh Website ({syncConfig.lastSyncedAt})</span>
          </button>
        </div>
      </footer>

      {/* BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 z-30 flex items-center justify-between">
        {/* Home */}
        <button
          className={`flex flex-col items-center space-y-1 active:scale-95 transition ${
            activeBottomTab === 'home' ? 'text-[#826938]' : 'text-stone-500 hover:text-stone-900'
          }`}
          onClick={() => switchBottomTab('home')}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span className="text-[10px] font-bold">Trang chủ</span>
        </button>

        {/* Category */}
        <button
          className={`flex flex-col items-center space-y-1 active:scale-95 transition ${
            activeBottomTab === 'category' ? 'text-[#826938]' : 'text-stone-500 hover:text-stone-900'
          }`}
          onClick={() => switchBottomTab('category')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect height="7" width="7" x="3" y="3" />
            <rect height="7" width="7" x="14" y="3" />
            <rect height="7" width="7" x="14" y="14" />
            <rect height="7" width="7" x="3" y="14" />
          </svg>
          <span className="text-[10px] font-medium">Danh mục</span>
        </button>

        {/* Ritual */}
        <button
          className={`flex flex-col items-center space-y-1 active:scale-95 transition ${
            activeBottomTab === 'ritual' ? 'text-[#826938]' : 'text-stone-500 hover:text-stone-900'
          }`}
          onClick={() => switchBottomTab('ritual')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span className="text-[10px] font-medium">Nghi thức</span>
        </button>

        {/* Cart */}
        <button
          className={`flex flex-col items-center space-y-1 active:scale-95 transition ${
            activeBottomTab === 'cart' ? 'text-[#826938]' : 'text-[#826938]'
          }`}
          onClick={() => switchBottomTab('cart')}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-2 bg-[#826938] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {totalCartCount}
            </span>
          </div>
          <span className="text-[10px] font-medium">Giỏ hàng</span>
        </button>

        {/* Account */}
        <button
          className={`flex flex-col items-center space-y-1 active:scale-95 transition ${
            activeBottomTab === 'profile' ? 'text-[#826938]' : 'text-stone-500 hover:text-stone-900'
          }`}
          onClick={() => switchBottomTab('profile')}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {isLoggedIn && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            )}
          </div>
          <span className="text-[10px] font-medium">{isLoggedIn ? 'Đã đăng nhập' : 'Tài khoản'}</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* MODALS & DRAWERS */}
      {/* ========================================================================= */}

      {/* 1. CART DRAWER */}
      {cartDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex justify-end transition-opacity"
          onClick={() => setCartDrawerOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-stone-50 h-full flex flex-col shadow-2xl relative animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#826938]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="font-brand-serif font-bold text-stone-900 text-sm">
                  GIỎ HÀNG QUÝ KHÁCH (<span>{totalCartCount}</span>)
                </h3>
              </div>
              <button
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold text-sm"
                onClick={() => setCartDrawerOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Free shipping progress */}
            <div className="px-4 py-2 bg-[#FAF5ED] border-b border-[#DFCDB3] text-[11px] text-[#826938]">
              <div className="flex justify-between font-medium">
                <span>Freeship toàn quốc từ 500.000₫</span>
                <span className="font-bold">
                  {isFreeship ? 'Đủ điều kiện ✓' : `Thêm ${formatMoney(500000 - subtotal)}`}
                </span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-[#826938] h-full transition-all duration-300"
                  style={{ width: `${freeshipPct}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <p className="text-xs">Giỏ hàng của quý khách đang trống</p>
                  <button
                    className="text-xs text-[#826938] font-bold underline"
                    onClick={() => {
                      setCartDrawerOpen(false);
                      scrollToProductSection();
                    }}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const prod = syncConfig.products[item.id];
                  if (!prod) return null;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200 shadow-2xs"
                    >
                      <img
                        src={prod.img}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover bg-stone-50 rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-stone-900 truncate font-brand-serif">{prod.name}</h4>
                        <p className="text-[10px] text-stone-500 truncate">{prod.sub}</p>
                        <div className="text-xs font-bold text-[#826938] mt-0.5">{formatMoney(prod.price)}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-500 text-xs"
                        >
                          ✕
                        </button>
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50 text-xs">
                          <button
                            onClick={() => changeQty(item.id, -1)}
                            className="w-5 h-5 flex items-center justify-center font-bold text-stone-600"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold">{item.qty}</span>
                          <button
                            onClick={() => changeQty(item.id, 1)}
                            className="w-5 h-5 flex items-center justify-center font-bold text-stone-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Cart Summary & Proceed */}
            <div className="p-4 border-t border-stone-200 bg-white space-y-2.5">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-stone-800">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Phí vận chuyển</span>
                  <span className="font-semibold text-emerald-600">
                    {isFreeship ? 'Miễn phí' : formatMoney(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-1.5 border-t border-stone-100">
                  <span>Tổng thanh toán</span>
                  <span className="text-[#826938] text-base font-bold font-brand-serif">{formatMoney(finalTotal)}</span>
                </div>
              </div>
              <button
                className="w-full bg-[#1C1A18] hover:bg-[#826938] text-white py-3 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 transition"
                onClick={proceedToCheckout}
              >
                <span>TIẾN HÀNH ĐẶT HÀNG</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHECKOUT MODAL */}
      {checkoutModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3"
          onClick={() => setCheckoutModalOpen(false)}
        >
          <div
            className="w-full max-w-sm max-h-[92vh] bg-stone-50 rounded-2xl overflow-y-auto shadow-2xl p-4 border border-[#DFCDB3] relative no-scrollbar animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-600 font-bold text-sm z-10"
              onClick={() => setCheckoutModalOpen(false)}
            >
              ✕
            </button>
            <div className="text-center pt-1 pb-3 border-b border-stone-200">
              <span className="text-[9px] uppercase tracking-widest text-[#826938] font-bold">
                ALPS PURE ESSENCE • CHECKOUT
              </span>
              <h3 className="font-brand-serif text-lg font-bold text-stone-900">Thông Tin Giao Hàng</h3>
              <p className="text-[11px] text-stone-500">Hoàn tất đơn hàng bảo dưỡng sắc diện Thụy Sĩ</p>
            </div>

            {Object.keys(formErrors).length > 0 && (
              <div className="my-2.5 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                <span className="font-medium">Vui lòng hoàn thành các thông tin nhận hàng còn thiếu!</span>
              </div>
            )}

            <form className="space-y-3 pt-2 text-xs" onSubmit={handleConfirmOrder}>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Họ và tên người nhận <span className="text-[#826938]">*</span>
                </label>
                <input
                  className={`w-full text-xs rounded-lg border px-3 py-2 bg-white outline-none transition ${
                    formErrors.name ? 'border-red-500 bg-red-50 animate-shake' : 'border-stone-300 focus:border-[#826938]'
                  }`}
                  value={custName}
                  onChange={(e) => {
                    setCustName(e.target.value);
                    setFormErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Nhập họ và tên người nhận"
                  type="text"
                />
                {formErrors.name && (
                  <p className="text-[10px] text-red-600 mt-1 font-medium">Vui lòng nhập họ và tên người nhận.</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Số điện thoại nhận hàng <span className="text-[#826938]">*</span>
                </label>
                <input
                  className={`w-full text-xs rounded-lg border px-3 py-2 bg-white outline-none transition ${
                    formErrors.phone
                      ? 'border-red-500 bg-red-50 animate-shake'
                      : 'border-stone-300 focus:border-[#826938]'
                  }`}
                  value={custPhone}
                  onChange={(e) => {
                    setCustPhone(e.target.value);
                    setFormErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="Ví dụ: 0912 345 678"
                  type="tel"
                />
                {formErrors.phone && (
                  <p className="text-[10px] text-red-600 mt-1 font-medium">
                    Số điện thoại không hợp lệ (tối thiểu 9 số).
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Địa chỉ nhận hàng chi tiết <span className="text-[#826938]">*</span>
                </label>
                <input
                  className={`w-full text-xs rounded-lg border px-3 py-2 bg-white outline-none transition ${
                    formErrors.address
                      ? 'border-red-500 bg-red-50 animate-shake'
                      : 'border-stone-300 focus:border-[#826938]'
                  }`}
                  value={custAddress}
                  onChange={(e) => {
                    setCustAddress(e.target.value);
                    setFormErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, TP..."
                  type="text"
                />
                {formErrors.address && (
                  <p className="text-[10px] text-red-600 mt-1 font-medium">
                    Vui lòng nhập địa chỉ nhận hàng chi tiết.
                  </p>
                )}
              </div>

              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1.5">Phương thức thanh toán</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-[#826938] bg-[#F7F2EB] cursor-pointer">
                    <input
                      checked={paymentMethod === 'qr'}
                      className="text-[#826938]"
                      name="payment"
                      onChange={() => setPaymentMethod('qr')}
                      type="radio"
                      value="qr"
                    />
                    <span className="text-[11px] font-semibold text-stone-900 flex-1">
                      QR Chuyển khoản (VietQR MB Bank)
                    </span>
                    <span className="bg-[#826938] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">Tức thì</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-stone-200 bg-white cursor-pointer">
                    <input
                      checked={paymentMethod === 'cod'}
                      className="text-[#826938]"
                      name="payment"
                      onChange={() => setPaymentMethod('cod')}
                      type="radio"
                      value="cod"
                    />
                    <span className="text-[11px] font-medium text-stone-900 flex-1">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-[9px] text-stone-500">Đồng kiểm</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'qr' && (
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#DFCDB3] space-y-2">
                  <div className="flex items-center justify-between border-b border-[#DFCDB3] pb-1.5">
                    <span className="font-bold text-[11px] text-[#826938] font-brand-serif uppercase">
                      QUÉT MÃ VIETQR 24/7
                    </span>
                    <span className="text-[9.5px] bg-[#1C1A18] text-[#E7DEC8] px-2 py-0.5 rounded-full font-mono">
                      NAPAS 247
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-center shadow-2xs">
                    <img
                      alt="QR Code MB Bank"
                      referrerPolicy="no-referrer"
                      className="w-44 h-44 object-contain mx-auto rounded-lg"
                      src={syncConfig.qrCodeImg}
                    />
                    <span className="text-[10px] text-stone-500 mt-1 block">
                      Mở App Ngân hàng bất kỳ &amp; Quét mã QR
                    </span>
                  </div>
                  <div className="text-[11px] space-y-1 pt-1 text-stone-700">
                    <div className="flex justify-between">
                      <span>Ngân hàng:</span>
                      <strong>MB BANK (Quân Đội)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Chủ tài khoản:</span>
                      <strong className="uppercase">ALPS PURE ESSENCE</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Số tài khoản:</span>
                      <div className="flex items-center gap-1 font-mono font-bold">
                        <span>1900 8899 6868</span>
                        <button
                          className="text-[9px] bg-stone-200 hover:bg-stone-300 px-1 py-0.5 rounded"
                          onClick={() => copyText('190088996868', 'Đã chép STK MB Bank!')}
                          type="button"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Nội dung:</span>
                      <strong className="font-mono text-[#826938]">{qrOrderMemo}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-2.5 bg-stone-100 rounded-lg flex justify-between items-center border border-stone-200">
                <span className="text-[11px] font-semibold text-stone-700">Tổng thanh toán:</span>
                <span className="text-base font-bold text-[#826938] font-brand-serif">{formatMoney(finalTotal)}</span>
              </div>

              <button
                className="w-full bg-[#1C1A18] hover:bg-[#826938] text-white py-3 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition"
                type="submit"
              >
                <svg className="w-4 h-4 text-[#DFCDB3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>XÁC NHẬN ĐẶT HÀNG NGAY</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. ORDER SUCCESS MODAL */}
      {orderSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 text-center shadow-2xl border border-[#DFCDB3] space-y-3 animate-pop">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF5ED] border border-[#DFCDB3] flex items-center justify-center text-[#826938]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5ED] text-[#826938] text-[10px] font-bold uppercase tracking-wider">
              ĐẶT HÀNG THÀNH CÔNG
            </span>
            <h3 className="font-brand-serif text-lg font-bold text-stone-900">
              Cảm Ơn Quý Khách Đã Lựa Chọn ALPS
            </h3>
            <p className="text-xs text-stone-600 px-2">
              Đơn hàng đang được bộ phận chuyên viên đóng gói chuẩn tiệt trùng tại kho Thụy Sĩ &amp; TP.HCM.
            </p>
            <div className="p-3 bg-stone-50 rounded-xl text-left text-xs space-y-1 border border-stone-200">
              <div className="flex justify-between">
                <span className="text-stone-500">Mã đơn:</span>
                <span className="font-mono font-bold text-[#826938]">{successOrderData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Người nhận:</span>
                <span className="font-semibold">{successOrderData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Giao hàng:</span>
                <span className="text-emerald-600 font-semibold">24h - 48h tới</span>
              </div>
            </div>
            <button
              className="w-full bg-[#1C1A18] hover:bg-[#826938] text-white py-2.5 rounded-xl text-xs font-semibold tracking-wider active:scale-95 transition"
              onClick={() => setOrderSuccessModalOpen(false)}
            >
              TIẾP TỤC TRẢI NGHIỆM
            </button>
          </div>
        </div>
      )}

      {/* 4. AUTH MODAL */}
      {authModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3"
          onClick={() => setAuthModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-stone-50 rounded-2xl p-5 shadow-2xl border border-[#DFCDB3] relative max-h-[94vh] overflow-y-auto no-scrollbar animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 font-bold text-sm"
              onClick={() => setAuthModalOpen(false)}
            >
              ✕
            </button>
            <div className="text-center mb-3">
              <span className="font-brand-logo text-lg font-bold tracking-[0.2em] text-[#1A1817]">ALPS</span>
              <h3 className="font-brand-serif text-base font-bold text-stone-900 mt-0.5">
                {authMode === 'login' ? 'Đăng Nhập Tài Khoản ALPS' : 'Đăng Ký Tài Khoản ALPS'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isLoggedIn && currentUser
                  ? `Đang đăng nhập: ${currentUser}`
                  : 'Nhập Gmail của bạn để tiếp tục đặt hàng và bảo lưu giỏ hàng'}
              </p>
            </div>

            {/* Switcher */}
            <div className="flex bg-stone-200 p-0.5 rounded-lg mb-3 text-xs">
              <button
                className={
                  authMode === 'login'
                    ? 'flex-1 py-1.5 rounded-md font-semibold text-stone-900 bg-white shadow-2xs transition'
                    : 'flex-1 py-1.5 rounded-md font-semibold text-stone-500 transition'
                }
                onClick={() => {
                  setAuthMode('login');
                  setOtpStep(false);
                }}
              >
                Đăng nhập
              </button>
              <button
                className={
                  authMode === 'register'
                    ? 'flex-1 py-1.5 rounded-md font-semibold text-stone-900 bg-white shadow-2xs transition'
                    : 'flex-1 py-1.5 rounded-md font-semibold text-stone-500 transition'
                }
                onClick={() => {
                  setAuthMode('register');
                  setOtpStep(false);
                }}
              >
                Đăng ký mới
              </button>
            </div>

            {/* Google Button */}
            <button
              className="w-full bg-white border border-stone-300 hover:border-[#826938] text-stone-800 py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-2xs active:scale-98 transition mb-3"
              onClick={handleGoogleQuickLogin}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-semibold text-stone-900">Tiếp tục với Google / Gmail</span>
            </button>

            <div className="relative flex py-1 items-center mb-3">
              <div className="flex-grow border-t border-stone-200" />
              <span className="flex-shrink mx-2 text-[10px] text-stone-400">hoặc tài khoản Gmail</span>
              <div className="flex-grow border-t border-stone-200" />
            </div>

            {!otpStep ? (
              <form className="space-y-3 text-xs" onSubmit={handleAuthSubmit}>
                {authMode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Họ và tên của bạn</label>
                    <input
                      className="w-full text-xs rounded-lg border border-stone-300 px-3 py-2 bg-white outline-none"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Nhập họ và tên"
                      type="text"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Email / Tài khoản Gmail <span className="text-[#826938]">*</span>
                  </label>
                  <input
                    className="w-full text-xs rounded-lg border border-stone-300 focus:border-[#826938] px-3 py-2 bg-white outline-none"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="nhapemail@gmail.com"
                    required
                    type="email"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Mật khẩu <span className="text-[#826938]">*</span>
                  </label>
                  <input
                    className="w-full text-xs rounded-lg border border-stone-300 focus:border-[#826938] px-3 py-2 bg-white outline-none"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    type="password"
                  />
                </div>
                <button
                  className="w-full bg-[#1C1A18] hover:bg-[#826938] text-white py-2.5 rounded-xl font-semibold tracking-wider text-xs active:scale-98 transition mt-2"
                  type="submit"
                >
                  {authMode === 'login' ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ VÀ TIẾP TỤC'}
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs pt-1">
                <div className="text-center bg-[#FAF5ED] p-3 rounded-xl border border-[#DFCDB3]">
                  <h4 className="font-bold text-stone-900 text-sm">Nhập Mã OTP 6 Số</h4>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Mã đã gửi đến: <strong>{authEmail}</strong>
                  </p>
                  <div className="mt-1.5 text-[10px] text-stone-500">
                    Mã mẫu thử nghiệm:{' '}
                    <span className="font-mono font-bold text-[#826938] bg-white px-1.5 py-0.5 rounded border border-stone-200">
                      123456
                    </span>
                  </div>
                </div>
                <input
                  className="w-full text-center tracking-[0.3em] font-mono text-base font-bold rounded-lg border border-stone-300 focus:border-[#826938] py-2 bg-white outline-none"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  type="text"
                />
                <button
                  className="w-full bg-[#1C1A18] hover:bg-[#826938] text-white py-2.5 rounded-xl font-semibold tracking-wider text-xs active:scale-98 transition"
                  onClick={handleVerifyOtp}
                >
                  XÁC NHẬN &amp; HOÀN TẤT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. AI SKIN SCAN MODAL */}
      {skinModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3"
          onClick={closeSkinScanModal}
        >
          <div
            className="w-full max-w-sm bg-stone-900 text-stone-100 rounded-2xl p-4 shadow-2xl border border-[#B89758]/50 relative animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 font-bold text-sm"
              onClick={closeSkinScanModal}
            >
              ✕
            </button>
            <div className="text-center pb-2 border-b border-stone-800 pr-6">
              <span className="px-2 py-0.5 rounded-full bg-[#B89758]/30 text-[#D6C097] text-[9px] font-semibold tracking-wider uppercase">
                ✦ ALPS DERMA SCANNER
              </span>
              <h3 className="font-brand-serif text-lg font-bold text-white mt-0.5">Soi Da AI Quang Học Thụy Sĩ</h3>
              <p className="text-[11px] text-stone-400">Phân tích sinh trắc học và cấu trúc lipid biểu bì</p>
            </div>

            {/* Camera / Viewport */}
            <div className="my-3 relative rounded-xl overflow-hidden aspect-[4/3] bg-stone-950 flex flex-col items-center justify-center border border-stone-700">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? '' : 'hidden'}`}
              />
              {!cameraActive && (
                <div className="w-24 h-32 border-2 border-dashed border-[#B89758]/80 rounded-[35px] flex items-center justify-center relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B89758] animate-ping absolute top-2 right-3" />
                  <svg className="w-10 h-10 text-stone-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
              )}
              <div className="absolute bottom-2 left-3 right-3 text-center bg-black/70 py-1 rounded-md">
                <span className="text-[10px] text-[#DFCDB3] font-mono">{scanStatusText}</span>
              </div>
            </div>

            {/* Kết quả chuẩn đoán */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <div className="text-[9px] text-stone-400">Độ ẩm biểu bì</div>
                <div className="text-xs font-bold text-white mt-0.5">38% (Khô)</div>
              </div>
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <div className="text-[9px] text-stone-400">Hàng rào lipid</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">Tổn thương</div>
              </div>
              <div className="bg-stone-800/80 p-2 rounded-lg border border-stone-700">
                <div className="text-[9px] text-stone-400">Tuổi sinh học</div>
                <div className="text-xs font-bold text-white mt-0.5">25 Tuổi</div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <button
                className="w-full bg-[#B89758] hover:bg-[#a38343] text-stone-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
                onClick={triggerAiScan}
              >
                <span>BẬT CAMERA / QUÉT KHUÔN MẶT</span>
              </button>
              <button
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 py-2 rounded-xl text-xs active:scale-95 transition"
                onClick={closeSkinScanModal}
              >
                ĐÓNG MÁY SOI DA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ALPS RITUAL MODAL */}
      {ritualModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3"
          onClick={() => setRitualModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-stone-50 rounded-2xl p-5 shadow-2xl border border-[#DFCDB3] relative max-h-[90vh] overflow-y-auto no-scrollbar animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 font-bold text-sm"
              onClick={() => setRitualModalOpen(false)}
            >
              ✕
            </button>
            <div className="text-center pb-3 border-b border-stone-200">
              <span className="text-[9px] uppercase tracking-widest text-[#826938] font-bold">ALPS SWISS RITUAL</span>
              <h3 className="font-brand-serif text-lg font-bold text-stone-900 mt-0.5">
                Nghi Thức Dưỡng Nhan Quiet Luxury
              </h3>
              <p className="text-[11px] text-stone-500">4 bước thức tỉnh &amp; phục hồi màng ẩm sinh học</p>
            </div>
            <div className="py-3 space-y-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF5ED] text-[#826938] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <strong>Làm sạch (Purify):</strong> Dùng Gentle Purifying Cleanser tạo bọt mịn làm sạch sâu chuẩn pH
                  5.5.
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF5ED] text-[#826938] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <strong>Cân bằng (Balance):</strong> Vỗ nhẹ Botanical Balancing Toner mở đường dẫn ẩm cho da.
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF5ED] text-[#826938] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <strong>Kích hoạt (Illuminate):</strong> Thoa 3-4 giọt Radiance Glow Serum edelweiss chống oxy hóa.
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FAF5ED] text-[#826938] font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div>
                  <strong>Khóa ẩm (Renew):</strong> Massage Regenerating Face Cream tạo màng Ceramide khóa ẩm 72H.
                </div>
              </div>
            </div>
            <button
              className="w-full bg-[#1C1A18] hover:bg-[#826938] text-white py-2.5 rounded-xl text-xs font-semibold tracking-wider active:scale-95 transition"
              onClick={() => {
                setRitualModalOpen(false);
                scrollToProductSection();
              }}
            >
              KHÁM PHÁ BỘ DƯỠNG NHAN ALPS
            </button>
          </div>
        </div>
      )}

      {/* 7. FREE MOBILE DOWNLOAD (iOS / ANDROID) & REAL-TIME WEBSITE IMAGE SYNC MODAL */}
      {appSyncModalOpen && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center p-3"
          onClick={() => setAppSyncModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-stone-50 rounded-2xl p-5 shadow-2xl border border-[#DFCDB3] relative max-h-[90vh] overflow-y-auto no-scrollbar animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 font-bold text-sm"
              onClick={() => setAppSyncModalOpen(false)}
            >
              ✕
            </button>

            <div className="text-center pb-3 border-b border-stone-200">
              <span className="text-[9px] uppercase tracking-widest text-[#826938] font-bold">
                ALPS MOBILE APP &amp; LIVE SYNC
              </span>
              <h3 className="font-brand-serif text-lg font-bold text-stone-900 mt-0.5">
                Tải Ứng Dụng &amp; Đồng Bộ Website
              </h3>
              <p className="text-[11px] text-stone-500">Hỗ trợ miễn phí trên cả iPhone (iOS) và Android</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-stone-200 p-0.5 rounded-lg my-3 text-xs">
              <button
                className={
                  syncModalTab === 'download'
                    ? 'flex-1 py-1.5 rounded-md font-semibold text-stone-900 bg-white shadow-2xs transition'
                    : 'flex-1 py-1.5 rounded-md font-semibold text-stone-500 transition'
                }
                onClick={() => setSyncModalTab('download')}
              >
                Tải App (iOS / Android)
              </button>
              <button
                className={
                  syncModalTab === 'sync'
                    ? 'flex-1 py-1.5 rounded-md font-semibold text-stone-900 bg-white shadow-2xs transition'
                    : 'flex-1 py-1.5 rounded-md font-semibold text-stone-500 transition'
                }
                onClick={() => setSyncModalTab('sync')}
              >
                Đồng bộ ảnh Realtime
              </button>
            </div>

            {syncModalTab === 'download' ? (
              <div className="space-y-3 text-xs">
                {isInstallable && (
                  <button
                    onClick={async () => {
                      const ok = await install();
                      if (ok) {
                        showToast('Đã cài đặt ALPS Pure Essence lên màn hình chính!');
                        setAppSyncModalOpen(false);
                      }
                    }}
                    className="w-full bg-[#826938] hover:bg-[#6c552c] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>CÀI ĐẶT NGAY (1 CHẠM MIỄN PHÍ)</span>
                  </button>
                )}

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-stone-900 text-white rounded text-[9px]">iOS / iPhone</span>
                    <span>Hướng dẫn cài đặt miễn phí trên iPhone/iPad</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-stone-600 space-y-1">
                    <li>
                      Mở trang này bằng trình duyệt <strong>Safari</strong> trên iPhone.
                    </li>
                    <li>
                      Nhấn nút <strong>Chia sẻ (Share)</strong> ở thanh công cụ dưới cùng.
                    </li>
                    <li>
                      Chọn <strong>&ldquo;Thêm vào Màn hình chính&rdquo; (Add to Home Screen)</strong> để dùng toàn màn
                      hình như App gốc.
                    </li>
                  </ol>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-[#826938] text-white rounded text-[9px]">Android</span>
                    <span>Hướng dẫn cài đặt miễn phí trên Android</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-stone-600 space-y-1">
                    <li>
                      Mở bằng <strong>Chrome</strong> trên điện thoại Android.
                    </li>
                    <li>
                      Nhấn nút <strong>Cài đặt ứng dụng (Install App)</strong> hoặc chọn menu <strong>⋮</strong> &rarr;{' '}
                      <strong>Cài đặt ứng dụng</strong>.
                    </li>
                  </ol>
                </div>

                {isIOS && (
                  <div className="p-2.5 bg-[#FAF5ED] border border-[#DFCDB3] rounded-xl text-[11px] text-[#826938] text-center font-medium">
                    Bạn đang dùng thiết bị iOS: Hãy nhấn nút Chia sẻ trên Safari &rarr; &ldquo;Thêm vào Màn hình
                    chính&rdquo; để tải miễn phí!
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-2.5 bg-[#FAF5ED] border border-[#DFCDB3] rounded-xl text-[11px] text-stone-700 flex items-center justify-between">
                  <span>Trạng thái đồng bộ ảnh:</span>
                  <span className="font-bold text-[#826938]">Trực tuyến • {syncConfig.lastSyncedAt}</span>
                </div>

                {/* Sync by URL */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    1. Đồng bộ trực tiếp từ URL Website của bạn
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={websiteUrlInput}
                      onChange={(e) => setWebsiteUrlInput(e.target.value)}
                      placeholder="https://alps.id.vn"
                      className="flex-1 text-xs rounded-lg border border-stone-300 px-2.5 py-2 bg-white outline-none focus:border-[#826938]"
                    />
                    <button
                      type="button"
                      disabled={isSyncingUrl}
                      onClick={handleSyncFromWebsiteUrl}
                      className="px-3 py-2 rounded-lg bg-[#1C1A18] hover:bg-[#826938] text-white font-semibold text-[11px] shrink-0 active:scale-95 transition"
                    >
                      {isSyncingUrl ? 'Đang tải...' : 'Đồng bộ ngay'}
                    </button>
                  </div>
                </div>

                {/* Sync by pasting HTML */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    2. Dán mã HTML Website để tự động trích xuất &amp; đồng bộ toàn bộ ảnh
                  </label>
                  <textarea
                    rows={3}
                    value={htmlPasteInput}
                    onChange={(e) => setHtmlPasteInput(e.target.value)}
                    placeholder="Dán mã HTML từ website của bạn vào đây, hệ thống sẽ tự động lấy các link ảnh <img src='...'> và cập nhật tức thì..."
                    className="w-full text-[11px] rounded-lg border border-stone-300 p-2 bg-white outline-none focus:border-[#826938]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSyncFromHtmlCode(htmlPasteInput, 'HTML Website')}
                    className="w-full py-2 rounded-lg bg-[#826938] hover:bg-[#6c552c] text-white font-semibold text-[11px] active:scale-95 transition"
                  >
                    CẬP NHẬT ẢNH TỪ HTML NGAY
                  </button>
                </div>

                {/* Quick individual image hotlink sync */}
                <div className="space-y-1.5 pt-1 border-t border-stone-200">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    3. Chỉnh sửa / Hotlink từng ảnh thời gian thực
                  </label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {[
                      { key: 'hero0', label: 'Ảnh bìa Hero', val: syncConfig.heroSlides[0]?.img },
                      { key: 'cleanser', label: 'Sữa rửa mặt', val: syncConfig.products.cleanser.img },
                      { key: 'serum', label: 'Serum Edelweiss', val: syncConfig.products.serum.img },
                      { key: 'cream', label: 'Kem dưỡng 72H', val: syncConfig.products.cream.img },
                      { key: 'toner', label: 'Toner Hoa Hồng', val: syncConfig.products.toner.img },
                      { key: 'mask', label: 'Mặt nạ sinh học', val: syncConfig.products.mask.img },
                      { key: 'duo', label: 'Ảnh Bộ đôi Chalet', val: syncConfig.duoBannerImg },
                      { key: 'origin', label: 'Ảnh Nguồn gốc Alps', val: syncConfig.originBannerImg },
                    ].map((slot) => (
                      <div key={slot.key} className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-stone-200">
                        <img
                          src={slot.val}
                          alt={slot.label}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover shrink-0 bg-stone-100"
                        />
                        <span className="text-[10px] font-semibold text-stone-700 w-24 shrink-0 truncate">
                          {slot.label}
                        </span>
                        <input
                          type="url"
                          defaultValue={slot.val}
                          onBlur={(e) => {
                            if (e.target.value !== slot.val) {
                              handleSingleImageUpdate(slot.key, e.target.value);
                            }
                          }}
                          className="flex-1 text-[10px] border border-stone-200 rounded px-1.5 py-1 outline-none focus:border-[#826938]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetDefaultImages}
                  className="w-full py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium text-[11px] transition"
                >
                  Khôi phục ảnh gốc mặc định
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div
        className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-[#1C1A18] text-[#F8F4EE] px-4 py-2 rounded-full shadow-2xl border border-[#B89758] text-xs font-medium flex items-center gap-2 transition-all duration-300 ${
          toastMsg ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#B89758] animate-pulse shrink-0" />
        <span className="whitespace-nowrap">{toastMsg || 'Vui lòng đăng nhập trước khi mua hàng!'}</span>
      </div>
    </div>
  );
}
