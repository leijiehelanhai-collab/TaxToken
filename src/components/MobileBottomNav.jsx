import { NavLink } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaSyncAlt, FaGift, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function MobileBottomNav() {
  const { t } = useTranslation();
  const navItems = [
    { path: '/', icon: FaHome, label: t('nav.home') },
    { path: '/presale', icon: FaExchangeAlt, label: t('nav.presale') },
    { path: '/swap', icon: FaSyncAlt, label: t('nav.swap') },
    { path: '/rewards', icon: FaGift, label: t('nav.rewards') },
    { path: '/admin', icon: FaCog, label: t('nav.admin') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-xl border-t-2 border-cyan-500/30 safe-area-inset-bottom shadow-2xl shadow-black/50">
      <ul className="flex justify-around items-center h-16 xs:h-[68px] sm:h-[72px] px-1">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full gap-1 transition-all touch-manipulation min-h-[56px] px-1 rounded-lg ${
                  isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-gray-300 active:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`text-xl xs:text-[22px] sm:text-2xl ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                  <span className={`text-[10px] xs:text-[11px] sm:text-xs leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
