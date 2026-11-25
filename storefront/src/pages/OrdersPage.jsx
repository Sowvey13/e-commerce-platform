import { Link } from 'react-router-dom';

function formatStatus(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'paid') return 'Ödendi (paid)';
  if (normalized === 'cancelled' || normalized === 'canceled') {
    return 'İptal Edildi (cancelled)';
  }
  if (normalized === 'shipped') return 'Kargolandı (shipped)';
  return 'Beklemede (pending)';
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
            Oluşturduğun siparişleri, durumlarını ve fake ödeme aksiyonlarını buradan takip et.
          </p>
        </div>
        <Link to="/" className="secondary-btn address-action-btn">
          Alışverişe Dön
        </Link>
      </div>

      <section className="card-panel">
        <h2 className="section-title">Sipariş Geçmişi ({orders.length})</h2>

        {ordersLoading ? (
          <p className="empty-state">Siparişler yükleniyor...</p>
        ) : orders.length === 0 ? (
          <p className="empty-state">Henüz bir siparişin bulunmuyor.</p>
        ) : (
          <div className="address-list">
            {orders.map((order) => {
              const orderId = order.id;
              const status = order.status ?? order.order_status ?? 'pending';
              const totalAmount =
                order.total_price ?? order.total_amount ?? order.total ?? null;
              const items = Array.isArray(order.items)
                ? order.items
                : Array.isArray(order.order_items)
                  ? order.order_items
                  : [];

              return (
                <div key={orderId} className="address-item-card">
                  <div className="address-item-body">
                    <div className="address-item-header">
                      <span className="address-badge">Sipariş #{orderId}</span>
                      <span className="address-location">
                        {formatStatus(status)}
                      </span>
                    </div>

                    {totalAmount !== null && totalAmount !== undefined && (
                      <p className="address-line-text">
                        <strong>Toplam:</strong> {totalAmount} TL
                      </p>
                    )}

                    {order.created_at && (
                      <span className="address-postal">
                        Tarih: {formatDate(order.created_at)}
                      </span>
                    )}

                    {items.length > 0 && (
                      <div className="row-meta" style={{ marginTop: '4px' }}>
                        {items.map((item, idx) => {
                          const name =
                            item.product_name ??
                            item.urun_adi ??
                            item.name ??
                            `Ürün #${item.product_id ?? idx + 1}`;
                          const qty = item.quantity ?? item.adet ?? 1;
                          const unitPrice = item.unit_price ?? item.birim_fiyat;
                          return (
                            <div key={item.id ?? idx}>
                              • {name} × {qty}
                              {unitPrice !== undefined ? ` (${unitPrice} TL)` : ''}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="address-item-actions">
                    {canPayOrder(status) && (
                      <button
                        type="button"
                        className="address-action-btn"
                        disabled={payingOrderId === orderId}
                        onClick={() => onPayOrder(orderId)}
                      >
                        {payingOrderId === orderId
                          ? 'Ödeniyor...'
                          : 'Fake Ödeme Yap'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}