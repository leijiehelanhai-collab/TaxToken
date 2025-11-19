import { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { FaCog, FaPercentage, FaUsers, FaPlay, FaInfoCircle, FaLock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function AdminPage() {
  const { t } = useTranslation();
  const {
    userAddress,
    isOwner,
    buyTax,
    sellTax,
    tradingEnabled,
    presaleActive,
    enableTrading,
    updateBuyTax,
    updateSellTax,
    addPresaleWhitelist,
    loading
  } = useWeb3();

  const [buyTaxForm, setBuyTaxForm] = useState({
    reward: buyTax.rewardTax,
    burn: buyTax.burnTax,
    marketing: buyTax.marketingTax
  });

  const [sellTaxForm, setSellTaxForm] = useState({
    reward: sellTax.rewardTax,
    burn: sellTax.burnTax,
    marketing: sellTax.marketingTax
  });

  const [whitelistForm, setWhitelistForm] = useState({
    address: '',
    allocation: ''
  });

  const handleUpdateBuyTax = async () => {
    const total = Number(buyTaxForm.reward) + Number(buyTaxForm.burn) + Number(buyTaxForm.marketing);
    if (total > 25) {
      alert(t('admin.errors.total_tax_exceed'));
      return;
    }
    await updateBuyTax(buyTaxForm.reward, buyTaxForm.burn, buyTaxForm.marketing);
  };

  const handleUpdateSellTax = async () => {
    const total = Number(sellTaxForm.reward) + Number(sellTaxForm.burn) + Number(sellTaxForm.marketing);
    if (total > 25) {
      alert(t('admin.errors.total_tax_exceed'));
      return;
    }
    await updateSellTax(sellTaxForm.reward, sellTaxForm.burn, sellTaxForm.marketing);
  };

  const handleAddWhitelist = async () => {
    if (!whitelistForm.address || !whitelistForm.allocation) {
      alert(t('admin.errors.fill_all'));
      return;
    }

    if (!whitelistForm.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert(t('admin.errors.invalid_address'));
      return;
    }

    await addPresaleWhitelist(whitelistForm.address, whitelistForm.allocation);
    setWhitelistForm({ address: '', allocation: '' });
  };

  if (!userAddress) {
    return (
      <div className="glass-card p-12 text-center max-w-2xl mx-auto">
        <FaInfoCircle className="text-6xl text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">{t('admin.connect_first_title')}</h2>
        <p className="text-gray-400">{t('admin.connect_first_desc')}</p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="glass-card p-12 text-center max-w-2xl mx-auto">
        <FaLock className="text-6xl text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">{t('admin.no_permission_title')}</h2>
        <p className="text-gray-400">{t('admin.no_permission_desc')}</p>
        <p className="text-gray-500 text-sm mt-2">{t('admin.current_address')}: {userAddress}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <FaCog className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t('admin.title')}</h2>
            <p className="text-gray-400 text-sm">{t('admin.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* 合约状态 */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">{t('admin.contract_status')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">{t('admin.trading_status')}</p>
            <p className={`text-lg font-bold ${tradingEnabled ? 'text-green-400' : 'text-gray-400'}`}>
              {tradingEnabled ? t('admin.trading_on') : t('admin.trading_off')}
            </p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-gray-400 text-sm mb-2">{t('admin.presale_status')}</p>
            <p className={`text-lg font-bold ${presaleActive ? 'text-cyan-400' : 'text-gray-400'}`}>
              {presaleActive ? t('admin.presale_on') : t('admin.presale_off')}
            </p>
          </div>
        </div>

        {!tradingEnabled && (
          <button
            onClick={enableTrading}
            disabled={loading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            <FaPlay />
            <span>{loading ? t('common.processing') : t('admin.enable_trading')}</span>
          </button>
        )}
      </div>

      {/* 税率管理 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 买入税 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FaPercentage className="text-cyan-400" />
            {t('admin.buy_tax_title')}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">{t('admin.reward_tax')}</label>
              <input
                type="number"
                min="0"
                max="25"
                value={buyTaxForm.reward}
                onChange={(e) => setBuyTaxForm({ ...buyTaxForm, reward: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">{t('admin.burn_tax')}</label>
              <input
                type="number"
                min="0"
                max="25"
                value={buyTaxForm.burn}
                onChange={(e) => setBuyTaxForm({ ...buyTaxForm, burn: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">{t('admin.marketing_tax')}</label>
              <input
                type="number"
                min="0"
                max="25"
                value={buyTaxForm.marketing}
                onChange={(e) => setBuyTaxForm({ ...buyTaxForm, marketing: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-sm text-gray-300">
                {t('admin.total_tax')}: <span className="text-cyan-400 font-bold">
                  {Number(buyTaxForm.reward) + Number(buyTaxForm.burn) + Number(buyTaxForm.marketing)}%
                </span>
              </p>
            </div>

            <button
              onClick={handleUpdateBuyTax}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? t('common.processing') : t('admin.update_buy_tax')}
            </button>
          </div>
        </div>

        {/* 卖出税 */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <FaPercentage className="text-orange-400" />
            {t('admin.sell_tax_title')}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                奖励税 (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={sellTaxForm.reward}
                onChange={(e) => setSellTaxForm({ ...sellTaxForm, reward: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                燃烧税 (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={sellTaxForm.burn}
                onChange={(e) => setSellTaxForm({ ...sellTaxForm, burn: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                营销税 (%)
              </label>
              <input
                type="number"
                min="0"
                max="25"
                value={sellTaxForm.marketing}
                onChange={(e) => setSellTaxForm({ ...sellTaxForm, marketing: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <p className="text-sm text-gray-300">
                {t('admin.total_tax')}: <span className="text-orange-400 font-bold">
                  {Number(sellTaxForm.reward) + Number(sellTaxForm.burn) + Number(sellTaxForm.marketing)}%
                </span>
              </p>
            </div>

            <button
              onClick={handleUpdateSellTax}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? t('common.processing') : t('admin.update_sell_tax')}
            </button>
          </div>
        </div>
      </div>

      {/* 预售白名单管理 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FaUsers className="text-green-400" />
          {t('admin.whitelist_title')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">{t('admin.wallet_address')}</label>
            <input
              type="text"
              value={whitelistForm.address}
              onChange={(e) => setWhitelistForm({ ...whitelistForm, address: e.target.value })}
              placeholder="0x..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">{t('admin.allocation_label')}</label>
            <input
              type="number"
              value={whitelistForm.allocation}
              onChange={(e) => setWhitelistForm({ ...whitelistForm, allocation: e.target.value })}
              placeholder="10000"
              className="input-field"
            />
          </div>

          <button
            onClick={handleAddWhitelist}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <FaUsers />
            <span>{loading ? t('common.processing') : t('admin.add_to_whitelist')}</span>
          </button>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <p className="text-xs text-gray-400">
              <FaInfoCircle className="inline mr-1 text-yellow-400" />
              {t('admin.whitelist_title')}
            </p>
          </div>
        </div>
      </div>

      {/* 安全提示 */}
      <div className="glass-card p-6 bg-red-500/5 border-red-500/30">
        <h3 className="text-lg font-bold text-red-400 mb-3">{t('admin.security_title')}</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>{t('admin.security_1')}</li>
          <li>{t('admin.security_2')}</li>
          <li>{t('admin.security_3')}</li>
          <li>{t('admin.security_4')}</li>
        </ul>
      </div>
    </div>
  );
}
