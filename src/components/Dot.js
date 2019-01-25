import styled from 'styled-components';
import { colors } from '../config';

const Dot = styled.div`
  font-family: 'Font Awesome 5 Pro';
  display: inline-block;
  font-size: 0.35rem;
  margin: 0 2px;
  font-weight: 900;

  &:before {
    content: '\f004';
  }
  ${props =>
    props.isActive &&
    `
    font-weight: 100;
    opacity: 0.6;
  `}
`;

export default Dot;
