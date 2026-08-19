function ProductOptions({
  variantGroups,
  selected,
  onSelect,
  quantity,
  onQuantityChange,
  maxQuantity,
}) {
  return (
    <div className="product-options">
      {variantGroups.map((group) => (
        <div className="product-options__group" key={group.name}>
          <span className="product-options__label">{group.name}</span>

          <div className="product-options__values">
            {group.options.map((option) => (
              <button
                type="button"
                key={option}
                className={
                  "variant-chip" +
                  (selected[group.name] === option
                    ? " variant-chip--active"
                    : "")
                }
                onClick={() => onSelect(group.name, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="product-options__group">
        <span className="product-options__label">Jumlah</span>

        <div className="quantity">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={() =>
              onQuantityChange(Math.min(maxQuantity || 99, quantity + 1))
            }
          >
            +
          </button>
        </div>

        {maxQuantity != null && (
          <span className="product-options__stock">
            Stok: {maxQuantity}
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductOptions;
