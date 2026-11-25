import { Link } from 'react-router-dom';

function getStatusMeta(status) {
  const normalized = String(status || '').toLowerCase();

  if (normalized === 'paid') {
    return {
      label: 'Ödendi • paid',
      bg: 'rgba(16, 185, 129, 0.14)',
      border: 'rgba(16, 185, 129, 0.35)',
      color: '#34d399',
    };
  }

  if (normalized === 'cancelled' || normalized === 'canceled') {
    return {
      label: 'İptal Edildi • cancelled',
      bg: 'rgba(239, 68, 68, 0.14)',
      border: 'rgba(239, 68, 68, 0.35)',
      color: '#f87171',
    };
  }

  if (normalized === 'shipped') {
    return {
      label: 'Kargolandı • shipped',
      bg: 'rgba(59, 130, 246, 0.14)',
      border: 'rgba(59, 130, 246, 0.35)',
      color: '#60a5fa',
    };
  }

  return {
    label: 'Beklemede • pending',
    bg: 'rgba(245, 158, 11, 0.14)',
    border: 'rgba(245, 158, 11, 0.35)',
    color: '#fbbf24',
  };
}

function formatDate(rawDate) {
  if (!rawDate) return '';
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return String(rawDate);
  return parsed.toLocaleString('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function canPayOrder(status) {
  const normalized = String(status || '').toLowerCase();
  return normalized === 'pending' || normalized === 'unpaid';
}

export default function OrdersPage({
  user,
  orders,
  ordersLoading,
  payingOrderId,
  onPayOrder,
  onCancelOrder,
}) {
  if (!user) {
    return (
      <div className="page-shell">
        <div className="page-header">
          <div>
            <h1 className="page-title">Siparişlerim</h1>
            <p className="page-subtitle">
              Siparişlerini görüntülemek ve ödemelerini tamamlamak için giriş yapmalısın.
            </p>
          </div>
          <Link to="/login" className="nav-link active">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Siparişlerim</h1>
          <p className="page-subtitle">
            Oluşturduğun siparişleri, durumlarını ve ödeme/iptal aksiyonlarını buradan takip et.
          </p>
        </div>
        <Link to="/" className="secondary-btn address-action-btn">
          Alışverişe Dön
        </Link>
      </div>

      <section className="card-panel">
        <h2 className="section-title" style={{ marginBottom: '18px' }}>
          Sipariş Geçmişi ({orders.length})
        </h2>

        {ordersLoading ? (
          <p className="empty-state">Siparişler yükleniyor...</p>
        ) : orders.length === 0 ? (
          <p className="empty-state">Henüz bir siparişin bulunmuyor.</p>
        ) : (
          <div
            className="address-list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {orders.map((order) => {
              const orderId = order.id;
              const status = order.status ?? order.order_status ?? 'pending';
              const statusMeta = getStatusMeta(status);
              const totalAmount =
                order.total_price ?? order.total_amount ?? order.total ?? null;
              const items = Array.isArray(order.items)
                ? order.items
                : Array.isArray(order.order_items)
                  ? order.order_items
                  : [];

              return (
                <div
                  key={orderId}
                  className="address-item-card"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    flexWrap: 'wrap',
                    padding: '18px 20px',
                    borderRadius: '14px',
                    border: '1px solid rgba(148, 163, 184, 0.16)',
                    background: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <div
                    className="address-item-body"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      flex: '1 1 320px',
                    }}
                  >
                    <div
                      className="address-item-header"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        className="address-badge"
                        style={{
                          fontWeight: 700,
                          fontSize: '0.98rem',
                          letterSpacing: '0.01em',
                        }}
                      >
                        Sipariş #{orderId}
                      </span>

                      <span
                        className="address-location"
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: statusMeta.bg,
                          border: `1px solid ${statusMeta.border}`,
                          color: statusMeta.color,
                        }}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        flexWrap: 'wrap',
                        fontSize: '0.92rem',
                      }}
                    >
                      {totalAmount !== null && totalAmount !== undefined && (
                        <span style={{ fontWeight: 600 }}>
                          Toplam: {totalAmount} TL
                        </span>
                      )}

                      {order.created_at && (
                        <span
                          className="address-postal"
                          style={{ color: '#94a3b8', fontSize: '0.85rem' }}
                        >
                          {formatDate(order.created_at)}
                        </span>
                      )}
                    </div>

                    {items.length > 0 && (
                      <div
                        className="row-meta"
                        style={{
                          marginTop: '2px',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          background: 'rgba(15, 23, 42, 0.45)',
                          border: '1px solid rgba(148, 163, 184, 0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          fontSize: '0.88rem',
                          color: '#cbd5e1',
                        }}
                      >
                        {items.map((item, idx) => {
                          const name =
                            item.product_name ??
                            item.urun_adi ??
                            item.name ??
                            `Ürün #${item.product_id ?? idx + 1}`;
                          const qty = item.quantity ?? item.adet ?? 1;
                          const unitPrice = item.unit_price ?? item.birim_fiyat;
                          return (
                            <div
                              key={item.id ?? idx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '12px',
                              }}
                            >
                              <span>• {name} × {qty}</span>
                              {unitPrice !== undefined && (
                                <span style={{ color: '#94a3b8' }}>
                                  {unitPrice} TL
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {canPayOrder(status) && (
                    <div
                      className="address-item-actions"
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        type="button"
                        className="address-action-btn"
                        disabled={payingOrderId === orderId}
                        onClick={() => onPayOrder(orderId)}
                      >
                        {payingOrderId === orderId
                          ? 'İşleniyor...'
                          : 'Fake Ödeme Yap'}
                      </button>
                      <button
                        type="button"
                        className="danger-btn address-action-btn"
                        disabled={payingOrderId === orderId}
                        onClick={() => onCancelOrder?.(orderId)}
                      >
                        Siparişi İptal Et
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}