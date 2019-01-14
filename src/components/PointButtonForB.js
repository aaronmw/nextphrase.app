import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';
import PointButton from './PointButton';

const PointButtonForB = styled(PointButton)`
  right: ${DESIGN_TOKENS.borders.width};
  ${props => !props.isVisible && `transform: translateX(110%);`}
`;

export default PointButtonForB;
