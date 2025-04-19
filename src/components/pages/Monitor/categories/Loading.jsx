export default function Loading() {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
  
        <div className="mb-6">
          <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
  
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="h-12 bg-gray-100 w-full animate-pulse"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 w-full bg-gray-50 border-b border-gray-100 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }
  