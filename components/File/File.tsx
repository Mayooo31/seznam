import { useState } from "react";
import { fileModel } from "../../model/model";
import styles from "./File.module.css";

import { useLazyQuery, gql } from "@apollo/client";

type FileProps = {
  files: fileModel[] | null;
  loadingFile: boolean;
  errorFile: any;
};

const GET_TEXT = gql`
  query GET($id: String!) {
    getFile(id: $id) {
      id
      name
      text
    }
  }
`;

const File = ({ files, loadingFile, errorFile }: FileProps) => {
  const [storedID, setStoredID] = useState<string>("");

  const [loadList, { loading, data }] = useLazyQuery(GET_TEXT, {
    variables: { id: storedID },
  });

  let warning = "Click on file and start reading... :)";

  const queryFileHandler = id => {
    setStoredID(id);
    loadList();
  };

  console.log(files);

  return (
    <div className={styles.container}>
      <div className={styles.files}>
        {errorFile && (
          <p style={{ margin: "auto", color: "orangered" }}>
            Something went wrong...
          </p>
        )}
        {files?.map(item => (
          <p
            className={styles.files_button}
            key={item.id}
            onClick={() => {
              queryFileHandler(item.id);
            }}
          >
            {item.name}
          </p>
        ))}
        {!loadingFile && files?.length === 0 && (
          <p style={{ margin: "auto" }}>No files</p>
        )}
      </div>
      <div className={styles.reading}>
        <h1 className={styles.heading}>{data && data.getFile.name}</h1>
        <text className={styles.text}>{data && data.getFile.text}</text>
        <text className={styles.text} style={{ paddingTop: "20rem" }}>
          {loading && "Loading"}
          {!data && !loading && !storedID && warning}
          {!data && !loading && storedID && "ERROR ( File is missing )"}
        </text>
      </div>
    </div>
  );
};

export default File;
