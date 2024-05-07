import { Container } from "react-bootstrap";
import Header from "../Header";

export default function Layout({ children }: any) {
  return (
    <Container className="d-flex flex-column" style={{ minHeight: "100dvh" }}>
      <Header />
      <div className="bg-white flex-fill shadow-sm rounded-top-4 p-4">
        {children}
      </div>
    </Container>
  );
}
