import { DocumentTableProps } from "@/utils/types/Car";
import styles from "./styles.module.css";
import getFileExtension from "@/components/singularImageUpload/utils/getFileExtension";
export default function DocumentTable({
  documents,
  editMode = false,
}: DocumentTableProps) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Status</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <tr key={doc.id}>
            <td>{doc.id}</td>
            <td>{doc.name}</td>
            <td>{doc.status}</td>
            <td>
              {doc.link ? (
                <a
                  href={doc.link}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${doc.name}.${getFileExtension(doc.link)}`}
                </a>
              ) : (
                "Not available"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
