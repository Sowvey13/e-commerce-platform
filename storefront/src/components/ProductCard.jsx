export default function ProductCard({ product, onAddToCart }) {
  const title = product.name ?? product.isim ?? `Ürün #${product.id}`;
  const price = product.price ?? product.fiyat ?? 0;
  const stock = product.stock ?? product.stok ?? 0;

  return (
    <article className="product-card">
      <div>
        <h3 className="product-title">{title}</h3>
        <div className="product-price">{price} TL</div>
        <div className="product-stock">Stok: {stock} adet</div>
      </div>

      <button
        type="button"
        disabled={stock <= 0}
        onClick={() => onAddToCart(product)}
      >
        {stock > 0 ? 'Sepete Ekle' : 'Tükendi'}
      </button>
    </article>
  );
}