import { useState } from "react";
import { getProductVariants } from "../utils/variants";
import ProductOptions from "./ProductOptions";

function VariantModal({ product, onClose, onAddToCart, onBuyNow }) {
  const variantGroups = getProductVariants(product);

  const [selected, setSelected] = useState(() => {
    const initial = {};
    variantGroups.forEach((group) => {
      initial[group.name] = group.options[0];
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [warning, setWarning] = useState("");

  function handleSelect(groupName, value) {
    setSelected((prev) => ({ ...prev, [groupName]: value }));
    setWarning("");
  }

  function isComplete() {
    return variantGroups.every((group) => selected[group.name]);
  }

  function handleAddToCart() {
    if (!isComplete()) {
      setWarning("Pilih varian terlebih dahulu");
      return;
    }
    onAddToCart(product, selected, quantity);
  }

  function handleBuyNow() {
    if (!isComplete()) {
      setWarning("Pilih varian terlebih dahulu");
      return;
    }
    onBuyNow(product, selected, quantity);
  }

  return (
    <div className="variant-modal__backdrop" onClick={onClose}>
      <div className="variant-modal" onClick={(e) => e.stopPropagation()}>
        <button className="variant-modal__close" onClick={onClose}>
          ✕
        </button>

        <div className="variant-modal__header">
          <img src={product.thumbnail} alt={product.title} />

          <div>
            <p className="variant-modal__price">${product.price}</p>
            <p className="variant-modal__stock">Stok: {product.stock}</p>
          </div>
        </div>

        <ProductOptions
          variantGroups={variantGroups}
          selected={selected}
          onSelect={handleSelect}
          quantity={quantity}
          onQuantityChange={setQuantity}
          maxQuantity={product.stock}
        />

        {warning && <p className="variant-modal__warning">{warning}</p>}

        <div className="variant-modal__actions">
          <button className="btn btn--outline" onClick={handleAddToCart}>
            + Keranjang
          </button>

          <button className="btn" onClick={handleBuyNow}>
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

export default VariantModal;
