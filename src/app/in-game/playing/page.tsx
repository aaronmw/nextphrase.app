import { AppContainer } from "@/app/client-components/AppContainer"
import { AppHeader } from "@/app/client-components/AppHeader"
import { Icon } from "@/app/client-components/Icon"
import { PhraseCarousel } from "@/app/client-components/PhraseCarousel"

export default () => {
  return (
    <AppContainer>
      <AppHeader contentInCenter={<Icon name="pause" />} />
      <PhraseCarousel />
    </AppContainer>
  )
}
