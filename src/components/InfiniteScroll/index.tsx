import { ReactNode, useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";

type InfiniteScrollProps = {
  more: boolean | undefined;
  load: () => Promise<void>;
  loader?: ReactNode;
  loading?: boolean;
};

export default function InfiniteScroll({
  more,
  load,
  loader,
  loading,
}: InfiniteScrollProps) {
  const [visible, setVisible] = useState(false);

  const ref = useRef<any>();

  useEffect(() => {
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!more || loading) {
        return false;
      }

      setVisible(entry.isIntersecting);
      if (entry.isIntersecting) {
        load();
      }
    });
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [more, loading, load]);
  return (
    <div ref={ref}>
      {(visible || loading) &&
        more &&
        (loader ?? <Spinner className="mt-4 mb-4" />)}
    </div>
  );
}
