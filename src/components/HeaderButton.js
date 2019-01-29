import styled from 'styled-components';
import Button from './Button';

const HeaderButton = styled(Button).attrs({
  tapSound: 'woosh'
})`
  position: absolute;
  width: 12vw;
  height: 12vw;
  font-size: 0.6rem;
  background: transparent;
  /* z-index: 10000; */
  ${props => !props.isVisible && `transform: translateY(-100%);`}
`;

export default HeaderButton;
