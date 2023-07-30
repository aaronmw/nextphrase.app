import { AppContainer } from "@/app/client-components/AppContainer";
import { Icon } from "@/app/client-components/Icon";
import { PhraseCarousel } from "@/app/client-components/PhraseCarousel";
import { TitleBar } from "@/app/client-components/TitleBar";

export default () => {
  return (
    <AppContainer>
      <TitleBar contentInCenter={<Icon name="pause" />} />
      <PhraseCarousel />
    </AppContainer>
  );
};
