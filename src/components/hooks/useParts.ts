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

export interface RectanglePart extends Part {}

const textPartsState = atom<TextPart[]>({
  key: "textPartsState",
  default: [],
});

const rectanglePartsState = atom<RectanglePart[]>({
  key: "rectanglePartsState",
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
    { id: `flower_ayame`, url: `/assets/images/parts/flower_ayame.png` },
    { id: `flower_christmasrose`, url: `/assets/images/parts/flower_christmasrose.png` },
    { id: `flower_gabera`, url: `/assets/images/parts/flower_gabera.png` },
    { id: `flower_katorea`, url: `/assets/images/parts/flower_katorea.png` },
    { id: `flower_rose_blue`, url: `/assets/images/parts/flower_rose_blue.png` },
    { id: `flower_rose_red`, url: `/assets/images/parts/flower_rose_red.png` },
    { id: `flower_rose_white`, url: `/assets/images/parts/flower_rose_white.png` },
    { id: `flower_sunflower`, url: `/assets/images/parts/flower_sunflower.png` },
  ]);

  const [leaves] = useState<ImagePart[]>([
    { id: `leaf_gama`, url: `/assets/images/parts/leaf_gama.png` },
    { id: `leaf_happa_1`, url: `/assets/images/parts/leaf_happa_1.png` },
    { id: `leaf_kakurigo`, url: `/assets/images/parts/leaf_kakurigo.png` },
    { id: `leaf_kasumisou`, url: `/assets/images/parts/leaf_kasumisou.png` },
  ]);

  const [stands] = useState<ImagePart[]>([
    { id: `stand_1`, url: `/assets/images/parts/stand_1.png` },
  ]);

  const [texts, setTexts] = useRecoilState(textPartsState);

  const [rectangles, setRectangles] = useRecoilState(rectanglePartsState);

  const addTextPart = (text: string): string => {
    const partId = createPartId("text");
    setTexts((prev) => [...prev, { id: partId, text }]);

    return partId;
  };

  const addRectanglePart = (): string => {
    const partId = createPartId("rectangle");
    setRectangles((prev) => [...prev, { id: partId }]);

    return partId;
  };

  const changeTextPart = (params: { partId: string; text: string }): void => {
    setTexts((prev) =>
      prev.map((part) => {
        if (part.id === params.partId) {
          return {
            ...part,
            text: params.text,
          };
        }

        return part;
      })
    );
  };

  return {
    flowers,
    leaves,
    stands,
    rectangles,
    texts,
    addTextPart,
    addRectanglePart,
    changeTextPart,
  };
};

export default useParts;
