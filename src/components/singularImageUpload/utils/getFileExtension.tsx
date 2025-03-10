export default (url: string) => {
  const extension = url.split(".").pop();
  return extension ? extension.toUpperCase() : "UNKNOWN";
};
