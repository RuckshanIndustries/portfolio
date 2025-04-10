export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[200px]">
      <div className="relative h-16 w-16">
        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-t-sky-500 border-r-indigo-500 border-b-sky-500 border-l-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 right-2 bottom-2 border-4 border-t-sky-500 border-r-indigo-500 border-b-sky-500 border-l-indigo-500 border-b-transparent rounded-full animate-spin animation-delay-200"></div>
      </div>
    </div>
  )
}
