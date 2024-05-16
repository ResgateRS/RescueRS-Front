import { Button, Container, Modal } from "react-bootstrap";
import Header from "../Header";
import { useEffect, useState } from "react";
import { mdiDownload, mdiExportVariant, mdiPlusBoxOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Footer } from "../Footer";

export default function Layout({ children }: any) {
  const [install, setInstall] = useState(false);
  const [installIOS, setInstallIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>();
  const [installIOSModal, setInstallIOSModal] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstall(true);
    });

    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    const isWebView = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return userAgent.includes("webview");
    };

    const isInStandaloneMode = () =>
      "standalone" in window.navigator && window.navigator.standalone;
    if (isIos() && !isInStandaloneMode() && !isWebView()) {
      setInstallIOS(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInstall() {
    if (installIOS) {
      setInstallIOSModal(true);
    } else {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          setInstall(false);
        }
      });
    }
  }

  return (
    <Container
      className="d-flex flex-column p-0"
      style={{ minHeight: "100dvh" }}
    >
      {(install || installIOS) && (
        <div
          className={`d-flex align-items-center justify-content-center px-3 py-1 gap-3 border border-top-0 bg-white`}
        >
          Adicione à sua tela inicial
          <Button
            className={`fw-medium rounded-pill`}
            variant={"dark"}
            onClick={handleInstall}
          >
            <Icon path={mdiDownload} size={0.8} />
            Adicionar
          </Button>
        </div>
      )}
      <Header />
      <div className="bg-white flex-fill shadow-sm rounded-4 p-3">
        {children}
      </div>
      <Footer />
      <Modal
        centered={true}
        show={installIOSModal}
        onHide={() => {
          setInstallIOSModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Instalar Aplicativo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-4">
            <p className="fs-6">
              Clique em{" "}
              <span className="text-primary fw-bold">
                <Icon
                  path={mdiExportVariant}
                  size={1}
                  style={{ marginTop: -8 }}
                />{" "}
                Compartilhar
              </span>
              <br />
            </p>
            <p className="fs-6">
              e depois em{" "}
              <span className="text-primary fw-bold">
                <Icon
                  path={mdiPlusBoxOutline}
                  size={1}
                  style={{ marginTop: -4 }}
                />{" "}
                Adicionar à Tela de Início
              </span>
            </p>
          </div>
          <Button
            variant={"dark"}
            className="w-100"
            onClick={() => {
              setInstallIOSModal(false);
            }}
          >
            Fechar
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
