import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CartPage({
  cartItems,
  cartCount,
  user,
  addresses = [],
  checkoutLoading = false,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) {
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(String(addresses[0].id));
    }
  }, [addresses, selectedAddressId]);

  const totalAmount = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity ?? item.qty ?? 1);
    const price = Number(
      item.unit_price ??
        item.price ??
        item.product?.discounted_price ??
        item.product?.price ??
        item.product?.fiyat ??
        0
    );
    return sum + qty * price;
  }, 0);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!user) {
      setLocalError('Sipariş oluşturmak için önce giriş yapmalısın.');
      return;
    }

    if (!selectedAddressId) {
      setLocalError('Lütfen bir teslimat adresi seç.');
      return;
    }

    await onCheckout({
      address_id: Number(selectedAddressId),
    });
  };

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sepetim ({cartCount})</h1>
          <p className="page-subtitle">
            Ürün adetlerini yönet, teslimat adresi seç ve siparişini oluştur.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link to="/addresses" className="secondary-btn address-action-btn">
            Adreslerim
          </Link>
          <Link to="/" className="secondary-btn address-action-btn">
            Ürünlere Dön
          </Link>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <section className="card-panel">
          <p className="empty-state">Sepetin şu an boş.</p>
        </section>
      ) : (
        <>
          <section className="card-panel" style={{ marginBottom: '20px' }}>
            <div className="address-list">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                const productId = item.product_id ?? product.id ?? item.id;
                const name =
                  product.name ?? product.isim ?? item.name ?? `Ürün #${productId}`;
                const qty = Number(item.quantity ?? item.qty ?? 1);
                const price = Number(
                  item.unit_price ??
                    item.price ??
                    product.discounted_price ??
                    product.price ??
                    product.fiyat ??
                    0
                );

                return (
                  <div key={item.id ?? `${productId}-${index}`} className="address-item-card">
                    <div className="address-item-body">
                      <div className="address-item-header">
                        <span className="address-badge">{name}</span>
                        <span className="address-location">{price} TL / adet</span>
                      </div>
                      <span className="address-postal">
                        Satır Toplamı: {(qty * price).toFixed(2)} TL
                      </span>
                    </div>

                    <div className="address-item-actions" style={{ gap: '10px' }}>
                      <button
                        type="button"
                        className="secondary-btn address-action-btn"
                        onClick={() => onQuantityChange(productId, qty - 1)}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>
                        {qty}
                      </span>
                      <button
                        type="button"
                        className="secondary-btn address-action-btn"
                        onClick={() => onQuantityChange(productId, qty + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="danger-btn address-action-btn"
                        onClick={() => onRemoveItem(productId)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '18px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(148, 163, 184, 0.25)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <strong>Ara Toplam: {totalAmount.toFixed(2)} TL</strong>
              <button
                type="button"
                className="secondary-btn address-action-btn"
                onClick={onClearCart}
              >
                Sepeti Temizle
              </button>
            </div>
          </section>

          <section className="card-panel">
            <h2 className="section-title">Checkout — Adres Seçimi & Sipariş</h2>

            {!user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <p className="empty-state" style={{ margin: 0 }}>
                  Sipariş oluşturmak için giriş yapmalısın.
                </p>
                <Link to="/login" className="secondary-btn address-action-btn">
                  Giriş Yap
                </Link>
              </div>
            ) : addresses.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <p className="empty-state" style={{ margin: 0 }}>
                  Sipariş verebilmek için önce en az bir adres eklemelisin.
                </p>
                <Link to="/addresses" className="secondary-btn address-action-btn">
                  Adres Ekle
                </Link>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="form-stack">
                <label className="row-meta">Teslimat Adresi Seç</label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={String(addr.id)}>
                      {addr.title || 'Adres'} — {addr.city}
                      {addr.district ? ` / ${addr.district}` : ''} (
                      {addr.address_line || addr.address})
                    </option>
                  ))}
                </select>

                {localError && <p className="error-text">{localError}</p>}

                <button type="submit" disabled={checkoutLoading}>
                  {checkoutLoading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Oluştur'}
                </button>
              </form>
            )}
          </section>
        </>
      )}
    </div>
  );
}