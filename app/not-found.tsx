import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-linear-to-br from-[#F9F5F0] to-[#F0E7DE] flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full bg-white/90 border border-[#F0E7DE] rounded-2xl shadow-sm p-8 text-center">
        <div className="mb-4 text-4xl">🧭</div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#6f5a4d] mb-3">Page Not Found</h1>
        <p className="text-[#8A6F5C] mb-8">
          Sorry, we couldn’t find the page you’re looking for. It may have been moved or no longer exists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <span className="inline-block px-6 py-3 rounded-xl bg-[#F4B7C7] text-[#3a2a24] font-semibold hover:bg-[#f1aabf] transition">Go to Home</span>
          </Link>
          <Link href="/collection">
            <span className="inline-block px-6 py-3 rounded-xl bg-[#F4DCDC] text-[#6f5a4d] font-semibold hover:bg-[#F0E7DE] transition">Browse Collection</span>
          </Link>
        </div>
        <div className="mt-6 text-sm text-[#8A6F5C]">
          Need help? <Link href="/contact"><span className="underline hover:text-[#6f5a4d]">Contact us</span></Link>
        </div>
      </div>
    </main>
  )
}
