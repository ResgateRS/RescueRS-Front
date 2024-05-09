import { HereMapsContext } from "./context";

import { Map } from "@here/maps-api-for-javascript";

const platform = new H.service.Platform({
  apikey: import.meta.env.VITE_HERE_API_KEY,
});

export const HereMapsProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <HereMapsContext.Provider value={{ fill: "red" }}>
      {children}
    </HereMapsContext.Provider>
  );
};
