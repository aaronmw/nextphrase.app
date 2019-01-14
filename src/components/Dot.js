import styled from 'styled-components';
import { DESIGN_TOKENS } from '../config';

const Dot = styled.div`
  display: inline-block;
  flex-grow: 0;
  flex-shrink: 0;
  width: 0.35rem;
  height: 0.35rem;
  margin: 0 2px;
  border-radius: 1000px;
  border: 2px solid ${DESIGN_TOKENS.colors.foreground};
  font-size: 0;
  line-height: 0;
  opacity: 0.4;

  ${props =>
    props.isActive &&
    `
    opacity: 1;
    background: ${DESIGN_TOKENS.colors.foreground};
  `}
`;

export default Dot;
