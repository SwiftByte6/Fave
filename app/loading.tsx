export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-linear-to-br from-[#F9F5F0] to-[#F0E7DE] flex items-center justify-center px-6 py-16" aria-busy="true" aria-label="Loading page">
      <div className="max-w-xl w-full bg-white/90 border border-[#F0E7DE] rounded-2xl shadow-sm p-8 text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-[#F4B7C7] border-t-transparent animate-spin" />
        <h2 className="text-2xl md:text-3xl font-bold text-[#6f5a4d] mb-2">Loading Favee…</h2>
        <p className="text-[#8A6F5C]">Bringing premium styles to your screen.</p>
      </div>
    </main>
  )
}
