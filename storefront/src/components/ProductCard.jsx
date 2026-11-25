export default function ProductCard({ product, onAddToCart }) {
  const name = product.name ?? product.isim;
  const price = product.price ?? product.fiyat;
  const stock = product.stock ?? product.stok ?? 0;

  return (
    <article className="product-card">
      <h3>{name}</h3>
      <p className="price">{price} TL</p>
      <p className="stock">Stok: {stock} adet</p>
      <button type="button" onClick={() => onAddToCart(product)}>
        Sepete Ekle
      </button>
    </article>
  );
}