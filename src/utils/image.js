// Resizes and compresses an image file client-side before it's stored as
// a base64 string in localStorage. Keeps review photos small (localStorage
// has a hard size limit) while still looking fine as review thumbnails.
export function resizeImageFile(file, maxWidth = 480, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Gagal membaca gambar"));

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => reject(new Error("File bukan gambar yang valid"));

      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}
