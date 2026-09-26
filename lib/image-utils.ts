/**
 * Resizes and compresses a user-uploaded image file into a lightweight square WebP Data URL string.
 * @param file Uploaded image file (File object)
 * @param maxDim Maximum square dimension (default 250px for fast loading & minimal DB footprint)
 * @param quality Quality factor between 0.1 and 1.0 (default 0.8)
 */
export function compressImageToWebP(
  file: File,
  maxDim = 250,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = (err) => reject(err)
    reader.onload = (event) => {
      const img = new Image()
      img.onerror = (err) => reject(err)
      img.onload = () => {
        const canvas = document.createElement('canvas')

        // Crop center square coordinates
        let sourceX = 0
        let sourceY = 0
        let sourceWidth = img.width
        let sourceHeight = img.height

        if (img.width > img.height) {
          sourceWidth = img.height
          sourceX = (img.width - img.height) / 2
        } else if (img.height > img.width) {
          sourceHeight = img.width
          sourceY = (img.height - img.width) / 2
        }

        canvas.width = maxDim
        canvas.height = maxDim

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(event.target?.result as string)
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          maxDim,
          maxDim
        )

        try {
          // Convert canvas to WebP format data URL
          const webpDataUrl = canvas.toDataURL('image/webp', quality)
          resolve(webpDataUrl)
        } catch (e) {
          // Fallback if browser doesn't support webp export
          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(jpegDataUrl)
        }
      }

      if (typeof event.target?.result === 'string') {
        img.src = event.target.result
      }
    }

    reader.readAsDataURL(file)
  })
}
