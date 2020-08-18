import { useMemo, useState } from "react";

export type PartId = string;

export interface Part {
  partId: PartId;
  url: string;
}

const useParts = () => {
  const [flowers] = useState<{ id: string; url: string }[]>([
    { id: `flower_sunflower`, url: `/assets/images/flower_sunflower.png` },
    { id: `flower_rose_blue`, url: `/assets/images/flower_rose_blue.png` },
    { id: `flower_rose_red`, url: `/assets/images/flower_rose_red.png` },
    { id: `flower_rose_white`, url: `/assets/images/flower_rose_white.png` },
  ]);

  const [leaves] = useState<{ id: string; url: string }[]>([
    { id: `leaf_happa_1`, url: `/assets/images/leaf_happa_1.png` },
    { id: `leaf_kasumisou`, url: `/assets/images/leaf_kasumisou.png` },
  ]);

  const [stands] = useState<{ id: string; url: string }[]>([
    { id: `stand_1`, url: `/assets/images/stand_1.png` },
  ]);

  const all = useMemo(() => [...flowers, ...leaves, ...stands], [
    flowers,
    leaves,
    stands,
  ]);

  return {
    all,
    flowers,
    leaves,
    stands,
  };
};

export default useParts;
