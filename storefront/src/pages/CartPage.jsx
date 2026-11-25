import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function extractItemName(item) {
  return (
    item.product?.name ??
    item.product?.isim ??
    item.name ??
    item.isim ??
    `Ürün #${item.product_id ?? item.id ?? ''}`
  );
}

function extractUnitPrice(item) {
  const raw =
    item.product?.price ??
    item.product?.fiyat ??
    item.unit_price ??
    item.price ??
    item.fiyat ??
    0;
  const num = Number(raw);
  return Number.isNaN(num) ? 0 : num;
}

function extractQuantity(item) {
  const raw = item.quantity ?? item.qty ?? item.adet ?? 1;
  const num = Number(raw);
  return Number.isNaN(num) || num < 1 ? 1 : num;
}

function extractProductId(item) {
  return item.product_id ?? item.product?.id ?? item.id;
}

function formatAddressOption(address) {
  const title = address.title || address.label || `Adres #${address.id}`;
  const parts = [
    address.city || address.il,
    address.district || address.ilce,
    address.address_line || address.address || address.adres,
  ].filter(Boolean);

  return parts.length > 0 ? `${title} — ${parts.join(' / ')}` : title;
}

export default function CartPage({
  cartItems = [],
  cartCount = 0,
  user,
  addresses = [],
  checkoutLoading = false,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) {
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    if (!Array.isArray(addresses) || addresses.length === 0) {
      setSelectedAddressId('');
      return;
    }

    const exists = addresses.some(
      (addr) => String(addr.id) === String(selectedAddressId)
    );
    if (!exists) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      setSelectedAddressId(String(defaultAddr.id));
    }
  }, [addresses, selectedAddressId]);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + extractUnitPrice(item) * extractQuantity(item);
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedAddressId) return;

    const ok = await onCheckout?.({
      address_id: Number(selectedAddressId),
    });

    if (ok) {
      navigate('/orders');
    }
  };

  return (
    <div className="page-shell">
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 className="page-title">Sepetim ({cartCount})</h1>
          <p className="page-subtitle">
            Ürün adetlerini yönet, teslimat adresi seç ve siparişini oluştur.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/addresses" className="secondary-btn address-action-btn">
            Adreslerim
          </Link>
          <Link to="/" className="secondary-btn address-action-btn">
            Ürünlere Dön
          </Link>
        </div>
      </div>

      <section className="card-panel" style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          <h2 className="section-title" style={{ margin: 0 }}>
            Sepetteki Ürünler ({cartItems.length})
          </h2>

          {cartItems.length > 0 && (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => onClearCart?.()}
            >
              Sepeti Temizle
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-state">Sepetiniz şu anda boş.</p>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {cartItems.map((item, idx) => {
                const productId = extractProductId(item);
                const name = extractItemName(item);
                const unitPrice = extractUnitPrice(item);
                const quantity = extractQuantity(item);
                const lineTotal = (unitPrice * quantity).toFixed(2);

                return (
                  <div
                    key={item.id ?? productId ?? idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      padding: '16px 18px',
                      borderRadius: '14px',
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      background: 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        flex: '1 1 240px',
                      }}
                    >
                      <strong style={{ fontSize: '1rem' }}>{name}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
                        {unitPrice} TL / adet
                      </span>
                      <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500 }}>
                        Satır Toplamı: {lineTotal} TL
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        type="button"
                        className="address-action-btn"
                        style={{ minWidth: '36px', padding: '6px 10px' }}
                        onClick={() => onQuantityChange?.(productId, quantity - 1)}
                      >
                        -
                      </button>

                      <span
                        style={{
                          minWidth: '28px',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          padding: '0 4px',
                        }}
                      >
                        {quantity}
                      </span>

                      <button
                        type="button"
                        className="address-action-btn"
                        style={{ minWidth: '36px', padding: '6px 10px' }}
                        onClick={() => onQuantityChange?.(productId, quantity + 1)}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="danger-btn address-action-btn"
                        style={{ marginLeft: '4px' }}
                        onClick={() => onRemoveItem?.(productId)}
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
                marginTop: '18px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(148, 163, 184, 0.16)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '1.02rem', fontWeight: 700 }}>
                Ara Toplam: {subtotal.toFixed(2)} TL
              </span>
            </div>
          </>
        )}
      </section>

      {cartItems.length > 0 && (
        <section className="card-panel">
          <h2 className="section-title" style={{ marginBottom: '6px' }}>
            Checkout — Adres Seçimi & Sipariş
          </h2>
          <p className="item-meta" style={{ marginTop: 0, marginBottom: '16px' }}>
            Sipariş oluşturulduktan sonra Siparişlerim ekranından ödeme veya iptal işlemi yapabilirsin.
          </p>

          {!user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="item-meta">
                Sipariş oluşturmak için önce giriş yapmalısın.
              </span>
              <Link to="/login" className="nav-link active">
                Giriş Yap
              </Link>
            </div>
          ) : addresses.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span className="item-meta">
                Kayıtlı teslimat adresin bulunmuyor.
              </span>
              <Link to="/addresses" className="address-action-btn">
                Adres Ekle
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handlePlaceOrder}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="checkout-address"
                  style={{ fontSize: '0.9rem', fontWeight: 600, color: '#cbd5e1' }}
                >
                  Teslimat Adresi Seç
                </label>
                <select
                  id="checkout-address"
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    background: 'rgba(15, 23, 42, 0.7)',
                    color: '#f8fafc',
                    fontSize: '0.92rem',
                  }}
                >
                  {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {formatAddressOption(addr)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="address-action-btn"
                disabled={checkoutLoading || !selectedAddressId}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  marginTop: '4px',
                }}
              >
                {checkoutLoading ? 'Sipariş Oluşturuluyor...' : 'Siparişi Oluştur'}
              </button>
            </form>
          )}
        </section>
      )}
    </div>
  );
}