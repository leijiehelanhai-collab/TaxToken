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
    <nav className="hidden md:block relative z-20 mb-6">
      <div className="glass-card p-2">
        <ul className="flex justify-center gap-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                  }`
                }
              >
                <item.icon />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
