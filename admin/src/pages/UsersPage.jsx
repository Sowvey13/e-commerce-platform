function formatOrderStatus(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'paid') return 'Ödendi (paid)';
  if (normalized === 'shipped') return 'Kargolandı (shipped)';
  if (normalized === 'delivered') return 'Teslim Edildi (delivered)';
  if (normalized === 'cancelled' || normalized === 'canceled') {
    return 'İptal Edildi (cancelled)';
  }
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

function isActiveOrder(status) {
  const normalized = String(status || '').toLowerCase();
  return !['delivered', 'cancelled', 'canceled'].includes(normalized);
}

function OrderCard({ order }) {
  const status = order.status ?? order.order_status ?? 'pending';
  const totalAmount =
    order.total_amount ?? order.total_price ?? order.total ?? 0;
  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.order_items)
      ? order.order_items
      : [];

  return (
    <div className="list-item" style={{ alignItems: 'flex-start', gap: '12px' }}>
      <div>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <strong>Sipariş #{order.id}</strong>
          <span className="badge-role">{formatOrderStatus(status)}</span>
        </div>

        <div className="item-meta" style={{ marginTop: '4px' }}>
          Toplam: {totalAmount} TL
          {order.created_at ? ` • ${formatDate(order.created_at)}` : ''}
        </div>

        {items.length > 0 && (
          <div className="item-meta" style={{ marginTop: '6px' }}>
            {items.map((item, idx) => {
              const name =
                item.product_name ??
                item.product?.name ??
                `Ürün #${item.product_id ?? idx + 1}`;
              const qty = item.quantity ?? 1;
              const unitPrice = item.unit_price;
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
    </div>
  );
}

export default function UsersPage({
  users,
  usersLoading,
  selectedUser,
  userOrders = [],
  userOrdersLoading = false,
  onSelectUser,
}) {
  const activeOrders = userOrders.filter((o) =>
    isActiveOrder(o.status ?? o.order_status)
  );

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Kullanıcı Listesi</h1>
          <p className="page-subtitle">
            Kullanıcıya tıklayarak aktif siparişini ve sipariş geçmişini görüntüle.
          </p>
        </div>
      </div>

      <section className="card-panel" style={{ marginBottom: '20px' }}>
        <h2 className="section-title">Kayıtlı Kullanıcılar ({users.length})</h2>

        {usersLoading ? (
          <p style={{ margin: 0 }}>Kullanıcılar yükleniyor...</p>
        ) : users.length === 0 ? (
          <p className="item-meta">Listelenecek kullanıcı bulunamadı.</p>
        ) : (
          <div className="list-stack">
            {users.map((u) => {
              const isSelected = selectedUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  className="list-item"
                  onClick={() => onSelectUser?.(u)}
                  style={{
                    cursor: 'pointer',
                    outline: isSelected ? '2px solid #3b82f6' : 'none',
                  }}
                >
                  <div>
                    <strong>{u.name ?? `Kullanıcı #${u.id}`}</strong>
                    <div className="item-meta">{u.email}</div>
                  </div>

                  <span className="badge-role">{u.role ?? 'customer'}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedUser && (
        <section className="card-panel">
          <h2 className="section-title">
            {selectedUser.name ?? `Kullanıcı #${selectedUser.id}`} — Siparişleri
          </h2>
          <p
            className="item-meta"
            style={{ marginTop: '-8px', marginBottom: '16px' }}
          >
            {selectedUser.email}
          </p>

          {userOrdersLoading ? (
            <p style={{ margin: 0 }}>Siparişler yükleniyor...</p>
          ) : (
            <>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>
                  Aktif Siparişler ({activeOrders.length})
                </h3>
                {activeOrders.length === 0 ? (
                  <p className="item-meta">Aktif siparişi bulunmuyor.</p>
                ) : (
                  <div className="list-stack">
                    {activeOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>
                  Sipariş Geçmişi ({userOrders.length})
                </h3>
                {userOrders.length === 0 ? (
                  <p className="item-meta">Kayıtlı siparişi bulunmuyor.</p>
                ) : (
                  <div className="list-stack">
                    {userOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}