'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                Gia Phả Việt
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              <Link href="/login">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Gìn giữ cội nguồn,<br />kết nối thế hệ
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Nền tảng tạo lập gia phả trực tuyến hiện đại, hỗ trợ lịch Âm - Dương,
              giúp bạn lưu giữ và sẻ chia truyền thống gia đình.
            </p>
            <div className="space-x-4">
              <Link href="/login">
                <Button size="lg">Bắt đầu ngay</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
