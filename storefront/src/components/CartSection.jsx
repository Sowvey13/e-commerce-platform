export default function CartSection({
  cartItems,
  cartCount,
  onQuantityChange,
  onRemoveItem,
}) {
  return (
    <section
      style={{
        marginTop: '40px',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #374151',
      }}
    >
      <h2 style={{ marginTop: 0 }}>Sepetim ({cartCount})</h2>

      {cartItems.length === 0 ? (
        <p>Sepetin şu an boş.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cartItems.map((item) => {
            const productId = item.product_id ?? item.product?.id ?? item.id;
            const productName =
              item.product?.name ?? item.name ?? `Ürün #${productId}`;
            const qty = Number(item.quantity ?? item.qty ?? 1);
            const unitPrice = Number(
              item.product?.price ?? item.price ?? item.unit_price ?? 0
            );

            return (
              <div
                key={item.id ?? productId}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
              >
                <div>
                  <strong>{productName}</strong>
                  <div style={{ fontSize: '14px', opacity: 0.85 }}>
                    {unitPrice > 0 ? `${unitPrice} TL x ${qty}` : `Adet: ${qty}`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    style={{ width: 'auto', padding: '6px 12px' }}
                    onClick={() => onQuantityChange(productId, qty - 1)}
                  >
                    -
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    style={{ width: 'auto', padding: '6px 12px' }}
                    onClick={() => onQuantityChange(productId, qty + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    style={{ width: 'auto', padding: '6px 12px' }}
                    onClick={() => onRemoveItem(productId)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}