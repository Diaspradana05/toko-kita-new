import { useState } from "react";
import { resizeImageFile } from "../utils/image";

const MAX_IMAGES = 3;

function ReviewForm({ onSubmit, onCancel }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file later

    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setUploadError(`Maksimal ${MAX_IMAGES} foto per ulasan.`);
      return;
    }

    const toProcess = files.slice(0, remainingSlots);
    setUploadError("");
    setUploading(true);

    try {
      const resized = await Promise.all(
        toProcess.map((file) => resizeImageFile(file))
      );
      setImages((prev) => [...prev, ...resized]);
    } catch {
      setUploadError("Gagal memproses salah satu gambar. Coba file lain.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmit({ rating, comment: comment.trim(), images });
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="review-form__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            className="review-form__star"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            aria-label={`Beri ${star} bintang`}
          >
            {(hoverRating || rating) >= star ? "★" : "☆"}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Bagaimana kualitas produknya? Ceritakan pengalamanmu..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />

      <div className="review-form__upload">
        {images.map((src, index) => (
          <div className="review-form__preview" key={index}>
            <img src={src} alt={`Foto ulasan ${index + 1}`} />
            <button
              type="button"
              className="review-form__preview-remove"
              onClick={() => removeImage(index)}
              aria-label="Hapus foto"
            >
              ×
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <label className="review-form__upload-btn">
            {uploading ? "..." : "+ Foto"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              hidden
            />
          </label>
        )}
      </div>

      {uploadError && (
        <p className="review-form__upload-error">{uploadError}</p>
      )}

      <p className="review-form__upload-hint">
        Tambahkan hingga {MAX_IMAGES} foto produk (opsional)
      </p>

      <div className="review-form__actions">
        <button type="submit" className="btn btn--small" disabled={uploading}>
          Kirim Ulasan
        </button>
        <button
          type="button"
          className="btn btn--outline btn--small"
          onClick={onCancel}
        >
          Batal
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
