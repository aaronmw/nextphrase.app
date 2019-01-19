import styled from 'styled-components';
import { dimensions } from '../config';
import PointButton from './PointButton';

const PointButtonForA = styled(PointButton)`
  left: ${dimensions.borderWidth};
  ${props => !props.isVisible && `transform: translateX(-110%);`}
`;

export default PointButtonForA;
