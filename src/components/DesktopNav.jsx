import { NavLink } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaSyncAlt, FaGift, FaCog } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function DesktopNav() {
  const { t } = useTranslation();
  const navItems = [
    { path: '/', icon: FaHome, label: t('nav.home') },
    { path: '/presale', icon: FaExchangeAlt, label: t('nav.presale') },
    { path: '/swap', icon: FaSyncAlt, label: t('nav.swap') },
    { path: '/rewards', icon: FaGift, label: t('nav.rewards') },
    { path: '/admin', icon: FaCog, label: t('nav.admin') },
  ];

  return (
    <nav className="hidden md:block relative z-20 mb-5 md:mb-6 lg:mb-8">
      <div className="glass-card p-2 md:p-2.5 lg:p-3">
        <ul className="flex justify-center gap-2 md:gap-2.5 lg:gap-3 flex-wrap">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 md:gap-2.5 px-5 md:px-6 lg:px-7 py-2.5 md:py-3 lg:py-3.5 rounded-lg md:rounded-xl text-sm md:text-base font-semibold transition-all duration-200 touch-manipulation min-h-[44px] ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                      : 'text-gray-300 hover:bg-slate-700/60 hover:text-white hover:scale-102 active:scale-95'
                  }`
                }
              >
                <item.icon className="text-base md:text-lg flex-shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
