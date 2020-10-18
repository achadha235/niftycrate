import React from 'react';
import { motion } from 'framer-motion';
import styleGenerator from './index.style';

function Crate() {
  const images = [
    // Fancy Kitty
    'https://storage.opensea.io/0x06012c8cf97bead5deae237070f9587f8e7a266d/1662879-1564341308.png',
    // Another kitty
    'https://storage.opensea.io/0x06012c8cf97bead5deae237070f9587f8e7a266d/1411566-1550960707.png',
    // CryptoHero Vitalik
    'https://storage.opensea.io/0x0ba000163959726c90d41c804386d37718d5edc8/39-1556631642.png',
    // CryptoHero
    'https://storage.opensea.io/0x273f7f8e6489682df756151f5525576e322d51a3/20020336-1549622415.png',
    // Axie lime green
    'https://storage.opensea.io/0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d/25358-1563761138.png',
    // Axie yellow
    'https://storage.opensea.io/0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d/56444-1567357552.png',
  ];

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
  const cycleDuration = 120;
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

  const size = 500;
  const boxShadowSpread = 0;
  const boxShadowBlur = 0;
  const boxShadowSize = `0px 0px ${boxShadowBlur}px ${boxShadowSpread}px`;
  const crateStyle = styleGenerator({
    size,
  });
  const styledClassName = (c?) =>
    c ? `${crateStyle.className} ${c}` : crateStyle.className;
  return (
    <motion.div className={styledClassName('container')}>
      <motion.div
        className={styledClassName('cube')}
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
            className={styledClassName(face)}
            animate={{
              outlineColor: [
                '#ff00ff',
                '#ff00ff',
                '#ff00ff',
                '#ff00ff',
                '#ff00ff',
                '#ff00ff',
                '#ff00ff',
              ],
              boxShadow: [
                `${boxShadowSize} #ff00ff`,
                `${boxShadowSize} #ff00ff`,
                `${boxShadowSize} #ff00ff`,
                `${boxShadowSize} #ff00ff`,
                `${boxShadowSize} #ff00ff`,
                `${boxShadowSize} #ff00ff`,
                `${boxShadowSize} #ff00ff`,
              ],
            }}
            transition={{
              duration: cycleDuration,
              ease: 'easeInOut',
              loop: Infinity,
            }}
          >
            <img
              alt={images[i]}
              className={styledClassName()}
              src={images[i]}
            />
          </motion.div>
        ))}
      </motion.div>
      {crateStyle.styles}
    </motion.div>
  );
}

export default Crate;
