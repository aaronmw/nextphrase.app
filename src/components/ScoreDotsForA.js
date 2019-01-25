import styled from 'styled-components';
import HeaderSection from './HeaderSection';

const ScoreDotsForA = styled(HeaderSection)`
  ${props =>
    !props.isVisible && `transform: translateX(-120%) translateY(0) scale(1);`}
  ${props => !props.isVisible && `transform: translateX(-100%);`}
  ${props => props.reversed && `flex-direction: row-reverse;`}
`;

export default ScoreDotsForA;
