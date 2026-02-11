import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
const useUrlLoader = (loadProject, updateCode) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const projectId = searchParams.get("project");
    const roomId = window.location.hash.slice(1);
    if (projectId) {
      loadProject(projectId);
    }
    if (roomId) {
      fetch(`http://localhost:3001/projects/${roomId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.code) {
            updateCode(data.code);
          }
        })
        .catch((err) => console.log("room not found "));
    }
  }, [searchParams, loadProject, updateCode]);
};
export default useUrlLoader;
