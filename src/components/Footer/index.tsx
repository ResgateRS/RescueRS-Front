import {
  mdiEmail,
  mdiGithub,
  mdiInstagram,
  mdiLogout,
  mdiOpenInNew,
} from "@mdi/js";
import Icon from "@mdi/react";

export const Footer = () => {
  return (
    <footer className="d-flex flex-column gap-2 p-2">
      <a
        className="d-flex align-items-center icon-link text-decoration-none text-dark"
        href="mailto:contato@resgaters.app.br"
      >
        <Icon path={mdiEmail} size={1} />
        contato@resgaters.app.br
        <Icon path={mdiOpenInNew} size={0.8} />
      </a>

      <a
        className="d-flex align-items-center icon-link text-decoration-none text-dark"
        href="https://www.instagram.com/resgaters.app.br/"
        target="_blank"
      >
        <Icon path={mdiInstagram} size={1} /> instagram.com/resgaters.app.br
        <Icon path={mdiOpenInNew} size={0.8} />
      </a>

      <a
        className="d-flex align-items-center icon-link text-decoration-none text-dark"
        href="https://github.com/ResgateRS"
        target="_blank"
      >
        <Icon path={mdiGithub} size={1} /> github.com/ResgateRS
        <Icon path={mdiOpenInNew} size={0.8} />
      </a>
    </footer>
  );
};
