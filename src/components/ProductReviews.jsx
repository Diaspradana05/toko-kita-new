function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Stars({ value }) {
  const rounded = Math.round(value);

  return (
    <span className="stars">
      {"★".repeat(rounded)}
      {"☆".repeat(5 - rounded)}
    </span>
  );
}

function ProductReviews({ reviews = [], rating }) {
  const total = reviews.length;

  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return { star, count, percent };
  });

  return (
    <section className="product-reviews">
      <h2>Ulasan Produk</h2>

      <div className="product-reviews__summary">
        <div className="product-reviews__score">
          <span className="product-reviews__average">
            {rating?.toFixed(1)}
          </span>
          <Stars value={rating} />
          <span className="product-reviews__count">{total} ulasan</span>
        </div>

        <div className="product-reviews__breakdown">
          {breakdown.map((row) => (
            <div className="product-reviews__bar-row" key={row.star}>
              <span>{row.star} ★</span>
              <div className="product-reviews__bar">
                <div
                  className="product-reviews__bar-fill"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="product-reviews__bar-count">{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <p className="product-reviews__empty">Belum ada ulasan untuk produk ini.</p>
      ) : (
        <div className="product-reviews__list">
          {reviews.map((review, index) => (
            <div className="product-reviews__item" key={index}>
              <div className="product-reviews__item-header">
                <span className="product-reviews__avatar">
                  {review.reviewerName?.charAt(0).toUpperCase()}
                </span>

                <div>
                  <p className="product-reviews__name">
                    {review.reviewerName}
                  </p>
                  <Stars value={review.rating} />
                </div>

                <span className="product-reviews__date">
                  {formatDate(review.date)}
                </span>
              </div>

              <p className="product-reviews__comment">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="product-reviews__images">
                  {review.images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`Foto ulasan ${index + 1} - ${i + 1}`}
                      className="product-reviews__image"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
