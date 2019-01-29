import styled from 'styled-components';
import { dimensions } from '../config';

const ButtonMention = styled.span`
  display: inline-block;
  border: ${dimensions.borderWidth} solid ${props => props.bg};
  border-top: 0;
  border-bottom: 0;
  color: ${props => props.fg};
  background-color: ${props => props.bg};
`;

export default ButtonMention;
