import React, { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";

export function Home() {
  const [isSidebarShown, setIsSidebarShown] = useState(false);

  // TODO: move to shared layout component
  // Set sidebar visibility based on screen width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1440) {
        setIsSidebarShown(false);
      }
    }

    // Initialize on load
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function onCloseSidebar() {
    setIsSidebarShown(false);
  }

  return (
    <React.Fragment>
      <title>Home - Task Pro</title>
      <h1>Home</h1>
      <button onClick={() => setIsSidebarShown(true)}>Open sidebar</button>

      <Sidebar isActive={isSidebarShown} onCloseSidebar={onCloseSidebar} />
    </React.Fragment>
  );
}
