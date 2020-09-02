import { useMemo, useState } from "react";
import { atom, useRecoilState } from "recoil";

export type PartId = string;

interface Part {
  id: PartId;
}

export interface ImagePart extends Part {
  url: string;
}

export interface TextPart extends Part {
  text: string;
}

export interface BoardPart extends Part {}

const textPartsState = atom<TextPart[]>({
  key: "textPartsState",
  default: [],
});

const useParts = () => {
  /**
   * @private
   */
  const createPartId = (type: string) => {
    return `${type}_${Date.now()}`;
  };

  const [flowers] = useState<ImagePart[]>([
    { id: `flower_sunflower`, url: `/assets/images/flower_sunflower.png` },
    { id: `flower_rose_blue`, url: `/assets/images/flower_rose_blue.png` },
    { id: `flower_rose_red`, url: `/assets/images/flower_rose_red.png` },
    { id: `flower_rose_white`, url: `/assets/images/flower_rose_white.png` },
  ]);

  const [leaves] = useState<ImagePart[]>([
    { id: `leaf_happa_1`, url: `/assets/images/leaf_happa_1.png` },
    { id: `leaf_kasumisou`, url: `/assets/images/leaf_kasumisou.png` },
  ]);

  const [stands] = useState<ImagePart[]>([
    { id: `stand_1`, url: `/assets/images/stand_1.png` },
  ]);

  const [boards] = useState<BoardPart[]>([]);

  const [texts, setTexts] = useRecoilState(textPartsState);

  const addTextPart = (text: string): string => {
    const partId = createPartId("text");
    setTexts((prev) => [...prev, { id: partId, text }]);

    return partId;
  };

  return {
    flowers,
    leaves,
    stands,
    boards,
    texts,
    addTextPart,
  };
};

export default useParts;
