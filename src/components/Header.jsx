import { useWeb3 } from '../contexts/Web3Context';
import { FaWallet, FaCopy, FaCheckCircle, FaGlobe, FaChevronDown } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { userAddress, bnbBalance, tokenBalance, connectWallet, disconnectWallet, chainId } = useWeb3();
  const [copied, setCopied] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!langOpen) return;
    const el = btnRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const menuWidth = 128; // w-32
      setMenuPos({ top: rect.bottom + 6, left: rect.right - menuWidth });
    }

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
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [langOpen]);

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <header className="relative z-20 mb-8">
      <div className="glass-card p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-lg md:text-xl">
              TAX
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gradient">{t('header.title')}</h1>
              <p className="text-xs md:text-sm text-gray-400">{t('header.subtitle')}</p>
            </div>
          </div>
          
          {/* 右侧：紧凑型网络与钱包徽章（在框内，不重叠） */}
          <div className="flex items-center gap-2">
            {/* 语言切换 */}
            <div className="relative z-30">
              <button
                type="button"
                ref={btnRef}
                onClick={() => setLangOpen((v) => !v)}
                className="glass-card h-10 px-2 flex items-center gap-1 text-xs text-white hover:bg-white/5 transition"
              >
                <span>{languages.find((l) => l.code === i18n.language)?.label || i18n.language}</span>
                <FaChevronDown className={`text-[10px] transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen &&
                createPortal(
                  <div
                    ref={menuRef}
                    className="fixed w-32 glass-card py-1 backdrop-blur-md z-[9999] shadow-xl"
                    style={{ top: menuPos.top, left: menuPos.left }}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          changeLang(l.code);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-sm ${
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
            {/* 网络徽章（小号） */}
            <div className="glass-card px-1 h-10 flex items-center gap-1">
              <FaGlobe className="text-cyan-400 text-xs" />
              <span className="text-[10px] font-semibold text-white whitespace-nowrap">{chainLabel}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${chainDot}`}></span>
            </div>

            {/* 钱包状态（小号） */}
            {userAddress ? (
              <div className="glass-card px-1 h-10 flex items-center gap-1">
                <FaWallet className="text-cyan-400 text-xs" />
                <button onClick={copyAddress} className="text-[10px] font-mono text-white hover:text-cyan-300">
                  {shortenAddress(userAddress)}
                </button>
                {copied ? (
                  <FaCheckCircle className="text-green-400 text-xs" />
                ) : (
                  <FaCopy className="text-gray-400 text-xs" />
                )}
                <button
                  onClick={disconnectWallet}
                  className="ml-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-all text-[10px]"
                >
                  {t('header.disconnect')}
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="btn-primary h-10 flex items-center gap-1 text-[10px] px-3">
                <FaWallet className="text-xs" />
                <span>{t('header.connect')}</span>
              </button>
            )}

            
          </div>
        </div>
      </div>
    </header>
  );
}
