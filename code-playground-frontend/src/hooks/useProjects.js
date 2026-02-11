// import { useState } from "react";
// export const useProjects = () => {

//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showProjects, setShowProjects] = useState(false);

//   const saveProject = async (title, roomID, code, owner) => {
//     if (!title || !title.trim()) {
//       alert("please enter project name");
//       return;
//     }
//     const project = {
//       title,
//       roomID,
//       code,
//       owner: username,
//       ispublic: true,
//     };
//     try {
//       const res = await fetch("http://localhost:3001/projects", {
//         method: "POST",
//         headers: { "content-type": "application/json" },
//         body: JSON.stringify(project),
//       });
//       if (!res.ok) throw new Error("saved failed");
//       const saved = await res.json();
//       console.log("✅ SAVED project:", saved.project._id);

//       setProjects([...projects, saved.project]);
//       setTimeout(() => loadProjects(), 300);
//       setShowProjects(false);
//     } catch (err) {
//       console.log("save error:", err);
//       alert("save failed - check backend");
//     }
//   };
//   const loadProjects = async () => {
//     if (!username) {
//       console.log("no username- skip load");
//       setProjects([]);
//       return;
//     }
//     console.log("loacding for username:", username);

//     setShowProjects(true);
//     try {
//       const res = await fetch(
//         `http://localhost:3001/projects?owner=${encodeURIComponent(username)}`,
//       );
//       const userProjects = await res.json();
//       setProjects(Array.isArray(userProjects) ? userProjects : []);
//     } catch (err) {
//       console.error("error loading projects:", err);
//       setProjects([]);
//     }
//   };
//   const loadProject = async (projectId) => {
//     setLoading(true);

//     try {
//       const res = await fetch(`http://localhost:3001/projects/${projectId}`);
//       const project = await res.json();
//       updateCode(project.code);
//       setActiveTab("html");
//     } finally {
//       setLoading(false);
//       setShowProjects(false);
//     }
//   };
//   return { projects, saveProject, loadProjects, loadProject, loading };
// };
