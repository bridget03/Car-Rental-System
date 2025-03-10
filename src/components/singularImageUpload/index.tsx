import { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { ImSpinner2 } from "react-icons/im"; // Spinner icon
import styles from "./index.module.css";
import { FieldProps } from "formik";
import { FILE_SIZE } from "@/utils/consts";
import getFileUrl from "./utils/getFileUrl";
import docFileTypes from "./utils/docFileTypes";
import getExtensionFromLink from "./utils/getExtensionFromLink";

type ImageUploadProps = {
  className?: string;
  cloudinaryFolder?: string;
} & FieldProps;

const CustomImageInput = ({
  field,
  form,
  cloudinaryFolder = "rentcar/all",
  className,
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState(() => getExtensionFromLink(field.value) || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File | null) => {
    if (!file) return;

    if (file.size > FILE_SIZE * 1024 * 1024) {
      alert(`File size exceeds ${FILE_SIZE}MB. Please upload a smaller file.`);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl: string = getFileUrl(file);
    setPreviewUrl(objectUrl);
    form.setFieldValue(field.name, file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    processFile(event.target.files?.[0] || null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    processFile(event.dataTransfer.files?.[0] || null);
  };

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPreviewUrl("");
    form.setFieldValue(field.name, null);
  };

  useEffect(() => {
    const uploadImage = async () => {
      if (!(field.value instanceof File)) return;

      try {
        setLoading(true); // Show loader

        const response = await fetch(
          `/api/sign-cloudinary-params?folder=${cloudinaryFolder}`
        );
        const data = await response.json();
        const { timestamp, signature, apiKey, folder, cloudName } = data;
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

        const formData = new FormData();
        formData.append("file", field.value);
        formData.append("timestamp", timestamp);
        formData.append("api_key", apiKey);
        formData.append("signature", signature);
        formData.append("folder", folder);
        formData.append("use_filename", "true");

        form.setFieldValue(field.name, "");
        const uploadResponse = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image.");
        }

        const uploadData = await uploadResponse.json();
        // URL will be sent to backend
        form.setFieldValue(field.name, uploadData.secure_url);
      } catch (error) {
        if (
          error instanceof TypeError &&
          error.message.includes("Failed to fetch")
        ) {
          console.warn(
            "Network error: Could not reach Cloudinary. Check your internet connection or Cloudinary status."
          );
          alert("Error while proceeding to upload");
        } else {
          console.error("Upload error:", error);
        }
        setPreviewUrl("");
        form.setFieldValue(field.name, "");
      } finally {
        setLoading(false);
      }
    };

    uploadImage();
  }, [field.value]);

  return (
    <div className={`${styles.uploadContainer} ${className}`}>
      <div
        className={`${styles.uploadBox}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {loading ? (
          <ImSpinner2 className={styles.spinner} />
        ) : previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className={styles.previewImage}
            />
          </>
        ) : (
          <>
            <FaCloudUploadAlt className={styles.uploadIcon} />
            <div className={styles.content}>
              <p className={styles.uploadText}>Drag and drop</p>
              <p className={styles.orText}>OR</p>
              <label className={styles.selectFile} htmlFor="fileInput">
                Select file
              </label>
            </div>
          </>
        )}
        {previewUrl && !loading && (
          <span className={styles.close}>
            <MdOutlineClose
              className={styles.closeIcon}
              onClick={handleRemove}
            />
          </span>
        )}
      </div>

      {docFileTypes.includes(previewUrl.split(".")[0]) && !loading && (
        <>
          <a
            href={field.value}
            target="_blank"
            rel="noopener noreferrer"
            download
            className={styles.previewLink}
          >
            See document
          </a>
        </>
      )}

      <input
        ref={fileInputRef}
        id={field.name}
        name={field.name}
        type="file"
        className={styles.hiddenInput}
        onChange={handleFileChange}
        accept=".doc, .docx, .pdf, .jpg, .jpeg, .png, .gif"
      />
    </div>
  );
};

export default CustomImageInput;
