import { useWeb3 } from '../contexts/Web3Context';
import { FaWallet, FaCopy, FaCheckCircle, FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { userAddress, bnbBalance, tokenBalance, connectWallet, disconnectWallet, chainId } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 128 });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!langOpen) return;
    const recompute = () => {
      const el = btnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const margin = 8;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const maxWidth = Math.min(200, vw - margin * 2);
      const minWidth = Math.min(110, maxWidth);
      const menuWidth = Math.max(minWidth, Math.min(160, maxWidth));

      const minLeft = margin;
      const maxLeft = vw - menuWidth - margin;
      const leftAlign = Math.min(Math.max(rect.left, minLeft), Math.max(minLeft, maxLeft)); // align menu's left to button's left
      const rightAlign = Math.min(Math.max(rect.right - menuWidth, minLeft), Math.max(minLeft, maxLeft)); // align menu's right to button's right

      // Heuristic: if button is on the left half, use left align; otherwise right align
      const buttonCenter = rect.left + rect.width / 2;
      let chosenLeft = buttonCenter < vw / 2 ? leftAlign : rightAlign;
      // Extra guards: if button is very close to edges, snap to margins
      if (rect.left <= margin + 16) chosenLeft = minLeft;
      if (rect.right >= vw - (margin + 16)) chosenLeft = maxLeft;

      let top = rect.bottom + 6;
      // Temporarily set, then flip up if overflow bottom
      setMenuPos({ top, left: chosenLeft, width: menuWidth });

      requestAnimationFrame(() => {
        const menuEl = menuRef.current;
        if (!menuEl) return;
        const mrect = menuEl.getBoundingClientRect();
        if (mrect.bottom > vh - margin) {
          const flipTop = Math.max(margin, rect.top - mrect.height - 6);
          setMenuPos((pos) => ({ ...pos, top: flipTop }));
        }
      });
    };

    recompute();

    const handleClick = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setLangOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setLangOpen(false);
    };
    const handleResize = () => recompute();
    const handleScroll = () => recompute();
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [langOpen]);

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const chainLabel =
    chainId === 97
      ? t('header.network_bsc_testnet')
      : chainId === 56
      ? t('header.network_bsc_mainnet')
      : chainId
      ? t('header.chain_generic', { id: chainId })
      : t('header.network');
  const chainDot = chainId === 97 ? 'bg-green-400' : chainId === 56 ? 'bg-emerald-400' : 'bg-yellow-400';

  const languages = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'EN' },
    { code: 'ko', label: '한국어' },
    { code: 'ja', label: '日本語' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
  ];

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem('lang', lng); } catch {}
  };

  return (
    <motion.header 
      className="relative z-20 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="glass-card p-4 md:p-6">
        <div className="flex justify-between items-center">
          {/* Logo - top-left */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-10 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-xl"
              whileHover={{ 
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
                rotate: [0, -10, 10, 0]
              }}
              transition={{ duration: 0.3 }}
            >
              TAX
            </motion.div>
          </motion.div>

          {/* Right side: network + language + wallet */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            {/* Network badge - icon only */}
            <div className="glass-card px-1 h-8 flex items-center gap-1">
              <FaGlobe className="text-cyan-400 text-xs" />
              <span className={`w-1.5 h-1.5 rounded-full ${chainDot}`}></span>
            </div>
            {/* Language switcher */}
            <div className="relative z-30">
              <button
                type="button"
                ref={btnRef}
                onClick={() => setLangOpen((v) => !v)}
                className="glass-card h-8 px-2 flex items-center gap-1 text-xs text-white hover:bg-white/5 transition whitespace-nowrap"
              >
                <span>{languages.find((l) => l.code === i18n.language)?.label || i18n.language}</span>
                <FaChevronDown className={`text-[10px] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen &&
                createPortal(
                  <div
                    ref={menuRef}
                    className="fixed glass-card py-1 backdrop-blur-md z-[9999] shadow-xl rounded-lg max-h-60 overflow-auto"
                    style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          changeLang(l.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-sm whitespace-nowrap ${
                          i18n.language === l.code
                            ? 'bg-cyan-500/20 text-cyan-200'
                            : 'text-white hover:bg-white/5'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>,
                  document.body
                )}
            </div>
            {/* Wallet - icon only when connected, connect button when not */}
            {userAddress ? (
              <button
                onClick={disconnectWallet}
                className="glass-card h-8 px-2 flex items-center gap-1 text-xs text-white hover:bg-white/5 transition"
                title={t('header.disconnect')}
              >
                <FaWallet className="text-cyan-400 text-xs" />
              </button>
            ) : (
              <button onClick={connectWallet} className="btn-primary h-8 flex items-center gap-1 text-xs px-4 whitespace-nowrap min-w-fit">
                <FaWallet className="text-xs" />
                <span>{t('header.connect')}</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
