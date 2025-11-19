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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-cyan-500/30">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <li key={item.path} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full gap-1 transition-all ${
                  isActive ? 'text-cyan-400' : 'text-gray-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`text-xl ${isActive ? 'scale-110' : ''}`} />
                  <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
