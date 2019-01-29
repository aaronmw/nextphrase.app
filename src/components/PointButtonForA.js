import styled from 'styled-components';
import { colors, dimensions } from '../config';
import PointButton from './PointButton';

const PointButtonForA = styled(PointButton)`
  left: ${dimensions.borderWidth};
  background-color: ${colors.teamA};
  ${props => !props.isVisible && `transform: translateX(-110%);`}
`;

export default PointButtonForA;
