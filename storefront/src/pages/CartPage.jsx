import { Link } from 'react-router-dom';

export default function CartPage({
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
    <div className="page-shell">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sepetim ({cartCount})</h1>
          <p className="page-subtitle">
            Ürün adetlerini düzenleyebilir veya sepeti temizleyebilirsin.
          </p>
        </div>

        <div className="form-row-inline">
          <Link to="/">
            <button type="button" className="btn-secondary">
              Alışverişe Dön
            </button>
          </Link>

          {cartItems.length > 0 && (
            <button
              type="button"
              className="btn-danger"
              onClick={onClearCart}
            >
              Sepeti Temizle
            </button>
          )}
        </div>
      </div>

      <section className="card-panel">
        {cartItems.length === 0 ? (
          <p style={{ margin: 0 }}>Sepetin şu an boş.</p>
        ) : (
          <>
            <div className="form-stack">
              {cartItems.map((item) => {
                const productId =
                  item.product_id ?? item.product?.id ?? item.id;
                const productName =
                  item.product?.name ?? item.name ?? `Ürün #${productId}`;
                const qty = Number(item.quantity ?? item.qty ?? 1);
                const unitPrice = Number(
                  item.product?.price ?? item.price ?? item.unit_price ?? 0
                );

                return (
                  <div key={item.id ?? productId} className="cart-item">
                    <div>
                      <strong>{productName}</strong>
                      <div className="product-stock">
                        {unitPrice > 0
                          ? `${unitPrice} TL x ${qty} = ${(unitPrice * qty).toFixed(2)} TL`
                          : `Adet: ${qty}`}
                      </div>
                    </div>

                    <div className="qty-controls">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onQuantityChange(productId, qty - 1)}
                      >
                        -
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onQuantityChange(productId, qty + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => onRemoveItem(productId)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-total-row">
              <span>Genel Toplam</span>
              <span>{totalAmount.toFixed(2)} TL</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}