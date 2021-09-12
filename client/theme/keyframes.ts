import { keyframes } from "styled-components"

const fadeInDown = keyframes`
 from {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`

const fadeInUp = keyframes`
 from {
    opacity: 0;
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`

const fadeInRight = keyframes`
  from {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }

  to {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`

const slideInStar = keyframes`
  from {
    opacity: 0;
    -webkit-transform: translateX(30px);
    transform: translateX(30px);
  }

  to {
    opacity: 1;
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
`

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

export default {
  fadeInDown,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  slideInStar,
  fadeIn,
}
