import { rgba } from 'polished';
import styled from 'styled-components';
import { colors, dimensions } from '../config';

const SectionContent = styled.div`
  border: calc(${dimensions.borderWidth} / 4) solid ${rgba(colors.faded, 0.25)};
  border-left: none;
  border-right: none;
  padding: 0.25rem;
  font-size: 0.5rem;
  line-height: 0.75rem;
  text-transform: none;

  & + & {
    border-top: none;
  }
`;

export default SectionContent;
