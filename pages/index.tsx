import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/index.module.css";

import { gql } from "@apollo/client";
import { client } from "./_app";

import { useEffect, useState } from "react";

import Folder from "../components/Folder/Folder";
import File from "../components/File/File";
import { fileModel } from "../model/model";

import CachedIcon from "@mui/icons-material/Cached";

const Home: NextPage = ({ error, loading, data }: any) => {
  const [folders, setFolders] = useState<fileModel[] | null>(null);
  const [files, setFiles] = useState<fileModel[] | null>(null);
  const [reload, setReload] = useState<boolean>(false);

  useEffect(() => {
    setFolders(data?.getList.filter(item => item.type === "FOLDER" && item));
    setFiles(data?.getList.filter(item => item.type === "FILE" && item));
  }, [data, reload]);

  return (
    <div>
      <Head>
        <title>React-test</title>
      </Head>

      <main className={styles.container}>
        <button
          className={styles.reload}
          onClick={() => {
            setReload(!reload);
          }}
        >
          <CachedIcon className={styles.reload_icon} />
        </button>
        <Folder
          errorFolder={error}
          loadingFolder={loading}
          folders={folders}
          setFolders={setFolders}
          setFiles={setFiles}
        />
        <File errorFile={error} loadingFile={loading} files={files} />
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const { error, loading, data } = await client.query({
    query: gql`
      query {
        getList {
          id
          name
          type
        }
      }
    `,
  });

  return {
    props: JSON.parse(JSON.stringify({ error, loading, data })),
  };
}

export default Home;
