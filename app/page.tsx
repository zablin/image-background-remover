'use client'

import { useState } from 'react'

export default function Home() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('文件大小不能超过 10MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file)
    setError(null)
    setResult(null)
  }

  const removeBackground = async () => {
    if (!image) return
    
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image })
      })

      if (!res.ok) throw new Error('处理失败')
      
      const data = await res.json()
      setResult(data.result)
    } catch (err) {
      setError('背景移除失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (!result) return
    const link = document.createElement('a')
    link.href = result
    link.download = `removed-bg-${Date.now()}.png`
    link.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          图片背景移除工具
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="text-gray-600">
                <p className="text-lg mb-2">点击或拖拽上传图片</p>
                <p className="text-sm">支持 JPG、PNG、WEBP，最大 10MB</p>
              </div>
            </label>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}

          {image && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">原图</h3>
                  <img src={image} alt="原图" className="w-full rounded" />
                </div>
                {result && (
                  <div>
                    <h3 className="font-semibold mb-2">处理后</h3>
                    <img src={result} alt="处理后" className="w-full rounded" />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-4 justify-center">
                <button
                  onClick={removeBackground}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {loading ? '处理中...' : '移除背景'}
                </button>
                {result && (
                  <button
                    onClick={downloadImage}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    下载图片
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
