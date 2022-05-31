import { fileModel } from "../../model/model";
import styles from "./Folder.module.css";

import { useLazyQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";

type FolderProps = {
  folders: fileModel[] | null;
  setFolders: React.Dispatch<React.SetStateAction<fileModel[] | null>>;
  setFiles: React.Dispatch<React.SetStateAction<fileModel[] | null>>;
  loadingFolder: boolean;
  errorFolder: any;
};

const GET_LIST = gql`
  query GET_ID($id: String!) {
    getList(id: $id) {
      id
      name
      type
    }
  }
`;

const Folder = ({
  folders,
  setFolders,
  setFiles,
  loadingFolder,
  errorFolder,
}: FolderProps) => {
  const [storedID, setStoredID] = useState<string>("");

  const [loadList, { loading, data }] = useLazyQuery(GET_LIST, {
    variables: { id: storedID },
  });

  const queryFolderHandler = (id: string) => {
    setStoredID(id);
    loadList();
  };

  useEffect(() => {
    setFolders(data?.getList.filter(item => item.type === "FOLDER" && item));
    setFiles(data?.getList.filter(item => item.type === "FILE" && item));
  }, [data]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Choose some folder :)</h1>
      {loading && (
        <p style={{ fontSize: "3rem", marginTop: "14rem" }}>Loading</p>
      )}
      <div className={styles.folders}>
        {errorFolder && (
          <p style={{ color: "orangered" }}>Something went wrong...</p>
        )}
        {!loading &&
          folders?.map(item => (
            <p
              className={styles.folders_button}
              key={item.id}
              onClick={() => {
                queryFolderHandler(item.id);
              }}
            >
              {item.name}
            </p>
          ))}
        {folders?.length === 0 && !loadingFolder && (
          <p style={{ margin: "auto", paddingBottom: "14rem" }}>No folders</p>
        )}
      </div>
    </div>
  );
};

export default Folder;
