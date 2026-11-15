import { Outlet } from "react-router-dom";
import TheHeader from "@/widgets/header/ui/TheHeader";
import TheFooter from "@/widgets/footer/ui/TheFooter";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        К содержимому
      </a>
      <TheHeader />
      <main id="main-content" className="page-container" tabIndex={-1}>
        <Outlet />
      </main>
      <TheFooter />
    </div>
  );
}
