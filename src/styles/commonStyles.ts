// Common button styles for consistent UI across the application
export const commonButtonStyles = {
  primary: "bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg",
  secondary: "bg-white border border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300",
  filter: "flex items-center justify-center py-3 px-6 bg-white border border-gray-200 rounded-lg shadow-sm mx-auto hover:shadow transition-all duration-200",
  category: (isSelected: boolean) => 
    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isSelected 
        ? 'bg-[#4DA9FF] text-white shadow-sm' 
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
    }`,
  pagination: (isActive: boolean, isDisabled = false) => 
    isDisabled 
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
      : `${isActive ? 'bg-[#4DA9FF] text-white font-bold' : 'bg-white text-gray-700 hover:bg-[#4DA9FF] hover:text-white'} transition-colors border border-gray-200`
};

// Common card styles for consistent product display
export const commonCardStyles = {
  container: "bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden hover:shadow transition-all duration-300",
  imageContainer: "relative h-56 w-full overflow-hidden group",
  imageOverlay: "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
  imagePlaceholder: "absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
  content: "p-5",
  categoryBadge: "inline-block px-3 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-2"
};

// Common form styles
export const commonFormStyles = {
  input: "w-full py-3 px-5 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent",
  select: "border border-gray-300 rounded-md py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent shadow-sm",
  searchContainer: "relative max-w-xl mx-auto mb-6"
};

// Common layout styles
export const commonLayoutStyles = {
  section: "container mx-auto px-4",
  heroSection: "bg-gradient-to-r from-blue-50 via-white to-indigo-50 py-16",
  mainContent: "flex-grow bg-gray-50 py-12"
};
