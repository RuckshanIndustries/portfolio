// components/loading-spinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-sky-500"></div>
    </div>
  )
}