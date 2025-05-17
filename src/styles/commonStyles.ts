// Common button styles for consistent UI across the application
export const commonButtonStyles = {
  primary:
    "bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg",
  secondary:
    "bg-white border border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300",
  filter:
    "flex items-center justify-center py-3 px-6 bg-white border border-gray-200 rounded-lg shadow-sm mx-auto hover:shadow transition-all duration-200",
  category: (isSelected: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      isSelected
        ? "bg-[#4DA9FF] text-white shadow-sm"
        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
    }`,
  pagination: (isActive: boolean, isDisabled = false) =>
    isDisabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : `${isActive ? "bg-[#4DA9FF] text-white font-bold" : "bg-white text-gray-700 hover:bg-[#4DA9FF] hover:text-white"} transition-colors border border-gray-200`,
};

// Common card styles for consistent product display
export const commonCardStyles = {
  container:
    "bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden h-full flex flex-col hover:shadow-md transition-all duration-300",
  imageContainer:
    "relative h-48 md:h-52 w-full overflow-hidden bg-gray-50 group",
  imageOverlay:
    "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300",
  imagePlaceholder:
    "absolute inset-0 bg-white flex items-center justify-center",
  content: "p-4 flex flex-col flex-grow",
  categoryBadge: "inline-block px-2 py-0.5 text-xs font-medium rounded-full",
};

// Common form styles
export const commonFormStyles = {
  input:
    "w-full py-3 px-5 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent",
  select:
    "border border-gray-300 rounded-md py-2 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent shadow-sm",
  searchContainer: "relative max-w-xl mx-auto mb-6",
};

// Common layout styles
export const commonLayoutStyles = {
  section: "container mx-auto px-4 max-w-[2400px]",
  heroSection: "bg-gradient-to-r from-blue-50 via-white to-indigo-50 py-16",
  mainContent: "flex-grow bg-gray-50",
};

// Common cursor styles
export const commonCursorStyles = {
  clickable: "cursor-pointer",
  notAllowed: "cursor-not-allowed",
  loading: "cursor-wait",
  text: "cursor-text",
  move: "cursor-move",
  grab: "cursor-grab",
  grabbing: "cursor-grabbing",
};
