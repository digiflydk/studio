import PublicLayout from "./(public)/layout";
import Home from "./(public)/page";
import Template from "./(public)/template";

export default function Page() {
  return (
    <PublicLayout>
      <Template>
        <Home />
      </Template>
    </PublicLayout>
  );
}
