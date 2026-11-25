export default function CartSection({
  cartItems,
  cartCount,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
}) {
  const totalAmount = cartItems.reduce((sum, item) => {
    const qty = Number(item.quantity ?? item.qty ?? 1);
    const unitPrice = Number(
      item.product?.price ?? item.price ?? item.unit_price ?? 0
    );
    return sum + unitPrice * qty;
  }, 0);

  return (
    <section
      style={{
        marginTop: '40px',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #374151',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <h2 style={{ margin: 0 }}>Sepetim ({cartCount})</h2>

        {cartItems.length > 0 && (
          <button
            type="button"
            style={{ width: 'auto', padding: '6px 12px' }}
            onClick={onClearCart}
          >
            Sepeti Temizle
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p>Sepetin şu an boş.</p>
      ) : (
        <>
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
                      {unitPrice > 0
                        ? `${unitPrice} TL x ${qty} = ${(unitPrice * qty).toFixed(2)} TL`
                        : `Adet: ${qty}`}
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

          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #374151',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            <span>Genel Toplam Tutar</span>
            <span>{totalAmount.toFixed(2)} TL</span>
          </div>
        </>
      )}
    </section>
  );
}