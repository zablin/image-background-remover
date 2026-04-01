import './globals.css'

export const metadata = {
  title: 'Image Background Remover',
  description: '一键移除图片背景',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  )
}
