import React, { useState, useEffect } from 'react';
import tailwindConfig from 'tailwind.config';
import { motion } from 'framer-motion';

import styleGenerator from './index.style';

export interface CrateProps {
  tokens: any;
  size?: number;
}

function Crate(props: CrateProps) {
  const [currFace, setCurrFace] = useState(0);
  const [images, setImages] = useState([]);
  const size = props.size || 500;
  const tokens = props.tokens || [];
  const crateStyle = styleGenerator({
    size,
  });
  const styledClassName = (c?) =>
    c ? `${crateStyle.className} ${c}` : crateStyle.className;

  useEffect(() => {
    setTimeout(() => {
      const exposedFace = (currFace + 1) % animateBetween.length;
      setCurrFace(exposedFace);
    }, (cycleDuration / faces.length) * 1000);
  }, [currFace]);

  useEffect(() => {
    if (tokens) {
      setImages(tokens.slice(0, 6).map((token) => token.image_original_url));
    }
  }, [tokens]);

  return (
    <motion.div className={styledClassName('container')}>
      <motion.div
        className={styledClassName('cube')}
        onUpdate={(latest) => {
          const curr = [
            Number(latest.rotateX.toString()),
            Number(latest.rotateY.toString()),
            Number(latest.rotateZ.toString()),
          ];
          let minDiff = Number.MAX_VALUE;
          let closestFace;
          for (let face in rotations) {
            const rotation = rotations[face];
            const diff = [
              curr[0] - rotation[0],
              curr[1] - rotation[1],
              curr[2] - rotation[2],
            ]
              .map(Math.abs)
              .reduce((a, b) => a + b, 0);
            if (diff < minDiff) {
              minDiff = diff;
              closestFace = face;
            }
          }
        }}
        animate={{
          stdDeviation: [2, 2, 2],
          y: [-5, 10, -5],
          scale: 0.5,
          rotateX,
          rotateY,
          rotateZ,
        }}
        transition={{
          y: floatTransition,
          rotateX: inOutEasing,
          rotateY: inOutEasing,
          rotateZ: inOutEasing,
          boxShadow: floatTransition,
        }}
      >
        {faces.map((face, i) => (
          <motion.div
            key={face}
            style={{
              backgroundColor: tokens[i] ? tokens[i].background_color : 'white',
            }}
            className={`${styledClassName(
              face
            )} flex justify-center items-center`}
            animate={{
              outlineColor,
              boxShadow,
            }}
            transition={{
              duration: cycleDuration,
              ease: 'easeInOut',
              loop: Infinity,
            }}
          >
            <img className={styledClassName()} src={images[i]} />
          </motion.div>
        ))}
      </motion.div>
      {crateStyle.styles}
    </motion.div>
  );
}

const rotations = {
  front: [0, 0, 0],
  bottom: [90, 0, 0],
  back: [180, 0, 0],
  top: [270, 0, 0],
  left: [0, 90, 0],
  right: [0, 270, 0],
};

const faces = Object.keys(rotations);
const animateBetween = [
  'back',
  'right',
  'bottom',
  'left',
  'front',
  'top',
  'back',
];
const getCoordinateFn = (n) => (revealedFace) => rotations[revealedFace][n];
const rotateX = animateBetween.map(getCoordinateFn(0));
const rotateY = animateBetween.map(getCoordinateFn(1));
const rotateZ = animateBetween.map(getCoordinateFn(2));
const cycleDuration = 60;
const inOutEasing = {
  loop: Infinity,
  ease: 'easeInOut',
  duration: cycleDuration,
};
const floatTransition = {
  loop: Infinity,
  ease: 'easeInOut',
  duration: 5,
};

const boxShadowSpread = 0;
const boxShadowBlur = 0;
const boxShadowSize = `0px 0px ${boxShadowBlur}px ${boxShadowSpread}px`;

const outlineColor = [
  tailwindConfig.theme.colors.indigo[300],
  tailwindConfig.theme.colors.indigo[300],
  tailwindConfig.theme.colors.indigo[300],
  tailwindConfig.theme.colors.indigo[300],
  tailwindConfig.theme.colors.indigo[300],
  tailwindConfig.theme.colors.indigo[300],
  tailwindConfig.theme.colors.indigo[300],
];

const boxShadow = [
  `${boxShadowSize} ${tailwindConfig.theme.colors.indigo[300]}`,
  `${boxShadowSize} ${tailwindConfig.theme.colors.indigo[300]}`,
  `${boxShadowSize} ${tailwindConfig.theme.colors.indigo[300]}`,
  `${boxShadowSize} ${tailwindConfig.theme.colors.indigo[300]}`,
  `${boxShadowSize} ${tailwindConfig.theme.colors.indigo[300]}`,
  `${boxShadowSize} ${tailwindConfig.theme.colors.indigo[300]}`,
  `${boxShadowSize} ${tailwindConfig.theme.colors.indigo[300]}`,
];

export default Crate;
