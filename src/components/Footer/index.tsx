import { mdiEmail, mdiGithub } from "@mdi/js";
import Icon from "@mdi/react";

export const Footer = () => {
  return (
    <footer className="text-secondary row text-center gap-1 pt-2 pb-1">
      <div className="col text-start">
        <a className="icon-link" href="mailto:contato@resgaters.app.br">
          <Icon path={mdiEmail} size={1} />
          contato@resgaters.app.br
        </a>
      </div>
      <div className="col text-end">
        <a className="icon-link" href="https://github.com/ResgateRS">
          GitHub <Icon path={mdiGithub} size={1} />
        </a>
      </div>
    </footer>
  );
};
