import React from 'react';
import styled from 'styled-components';

const Background = () => {
  return (
    <DotBackground>
      <LinearMask />
      <DotPattern />
    </DotBackground>
  );
};

const DotBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
  z-index: 0;
`;

const DotPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#a0a0a0 1px, transparent 1px);
  background-size: 15px 15px;
  opacity: 0.15;
  background-position: top right;
  transform: rotate(0deg);
  overflow: hidden;
`;

const LinearMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  z-index: 0;
`;

export default Background;