export default (file: File): string => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  // Only save path of images
  switch (extension) {
    case "pdf":
      return "/pdf.png"; // Example: You can use an actual PDF icon here
    case "doc":
    case "docx":
      return "/docx.png"; // Example: You can replace with an actual DOCX icon
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return URL.createObjectURL(file); // Use preview for images
    default:
      return URL.createObjectURL(file); // Ensure it always returns a string
  }
};
