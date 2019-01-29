import styled from 'styled-components';
import { colors, dimensions } from '../config';
import PointButton from './PointButton';

const PointButtonForB = styled(PointButton)`
  right: ${dimensions.borderWidth};
  background-color: ${colors.teamB};
  ${props => !props.isVisible && `transform: translateX(110%);`}
`;

export default PointButtonForB;
