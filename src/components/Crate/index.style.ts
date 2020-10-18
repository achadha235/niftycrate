import css from 'styled-jsx/css';

interface IStyleProps {
  size?: number;
}

const style = ({ size = 80 }: IStyleProps) => {
  const halfSize = Math.ceil(size / 2);
  const outlineWidth = 0;

  return css.resolve`
    .container {
      width: ${size}px;
      height: ${size}px;
      position: relative;
      perspective: 1000px;
      background: none;
    }

    .cube {
      width: 100%;
      height: 100%;
      position: absolute;
      transform-style: preserve-3d;
    }

    .cube div {
      width: ${size}px;
      height: ${size}px;
      display: block;
      position: absolute;
      border: none;
      line-height: ${size}px;
      text-align: center;
      font-size: 50px;
      font-weight: bold;
      padding: 0px;
      transform-style: preserve-3d;
      background: white;
      border: solid 3px black;
      -moz-outline-radius: 10px;
    }

    .cube div img {
      transform: scale(0.9) translateZ(${1}px);
      background: white;
      max-height: ${size}px;
      max-width: ${size}px;
      vertical-align: middle;
    }

    .front {
      outline: solid ${outlineWidth}px;
    }

    .back {
      outline: solid ${outlineWidth}px;
    }

    .right {
      outline: solid ${outlineWidth}px;
    }

    .left {
      outline: solid ${outlineWidth}px;
    }

    .top {
      outline: double ${outlineWidth}px;
    }

    .bottom {
      outline: double ${outlineWidth}px;
    }

    .cube .front {
      transform: rotateY(0deg) translateZ(${halfSize}px);
    }

    .cube .back {
      transform: rotateX(180deg) translateZ(${halfSize}px);
    }

    .cube .right {
      transform: rotateY(90deg) translateZ(${halfSize}px);
    }

    .cube .left {
      transform: rotateY(-90deg) translateZ(${halfSize}px);
    }

    .cube .top {
      transform: rotateX(90deg) translateZ(${halfSize}px);
    }
    .cube .bottom {
      transform: rotateX(-90deg) translateZ(${halfSize}px);
    }
  `;
};

export default style;
