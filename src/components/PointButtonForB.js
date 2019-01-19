import styled from 'styled-components';
import { dimensions } from '../config';
import PointButton from './PointButton';

const PointButtonForB = styled(PointButton)`
  right: ${dimensions.borderWidth};
  ${props => !props.isVisible && `transform: translateX(110%);`}
`;

export default PointButtonForB;
