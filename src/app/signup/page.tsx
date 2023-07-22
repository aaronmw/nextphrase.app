"use client";

import { AppOutspaceContainer } from "@/app/client-components/AppOutspaceContainer";
import { AnchorButton, Button } from "@/app/client-components/Button";
import { Checkbox } from "@/app/client-components/CheckableInputs";
import { FieldLabel } from "@/app/client-components/FieldLabel";
import { Input } from "@/app/client-components/Input";
import { ModalWindow } from "@/app/client-components/ModalWindow";
import { StyledText } from "@/app/client-components/StyledText";
import { useRouter } from "next/navigation";
import { FormEventHandler, MouseEventHandler, useState } from "react";

export default () => {
  const [isShowingTerms, setIsShowingTerms] = useState(false);

  const router = useRouter();

  const handleClickTerms: MouseEventHandler = (event) => {
    event.preventDefault();

    setIsShowingTerms(true);
  };

  const handleCloseTerms = () => {
    setIsShowingTerms(false);
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    router.push("/invoices-and-bills");
  };

  return (
    <AppOutspaceContainer>
      <div className="dark">
        <StyledText as="h1" variant="h1">
          Sign Up
        </StyledText>
      </div>

      <form
        className="
          flex
          w-80
          flex-col
          gap-3
        "
        onSubmit={handleSubmit}
      >
        <FieldLabel label="Email Address" required={true}>
          <Input name="email" type="email" />
        </FieldLabel>

        <FieldLabel label="Company Name" required={true}>
          <Input name="label" type="text" />
        </FieldLabel>

        <FieldLabel label="Password" required={true}>
          <Input name="password" type="password" />
        </FieldLabel>

        <FieldLabel label="Re-Type Password" required={true}>
          <Input name="password_again" type="password" />
        </FieldLabel>

        <FieldLabel label="Legal" required={true}>
          <div
            className="
              flex
              items-center
              gap-2
              pb-3
              text-xs
            "
          >
            <Checkbox type="checkbox" name="accepts_terms" value="yes" />
            <StyledText variant="footnote">
              I have read and agreed to the{" "}
              <Button
                iconRight="arrow-up-right-from-square"
                onClick={handleClickTerms}
                variant="link"
              >
                terms of use
              </Button>
            </StyledText>
          </div>
        </FieldLabel>

        <Button className="w-full" variant="primary">
          Save Profile
        </Button>
      </form>

      <StyledText as="div" className="text-center" variant="footnote">
        Already a member? <AnchorButton href="/login">Log In</AnchorButton>
      </StyledText>

      <ModalWindow
        className="dark"
        isOpen={isShowingTerms}
        title="Terms of Use"
        onClose={handleCloseTerms}
      >
        {[
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac rhoncus justo. Nunc rhoncus purus quis ante vulputate fringilla. Suspendisse tempor nunc libero. Duis mauris nulla, tincidunt eu dictum eget, feugiat eu leo. Curabitur sed maximus eros. In rhoncus eros velit, non tincidunt nulla finibus ut. Duis condimentum lectus ac tristique egestas. Nunc vitae urna urna. Nam sagittis nisi elementum condimentum mattis. Sed condimentum, risus tempus facilisis congue, felis orci porta massa, auctor commodo nulla eros eu justo. Curabitur non venenatis elit. Mauris et ex non neque ultrices dictum. Mauris est erat, bibendum nec hendrerit in, auctor in justo. Etiam non aliquam odio, eu pharetra erat.",
          "Donec ultrices ultrices elit, at vehicula nisl pharetra quis. Duis eu ante elit. Nulla et rhoncus ligula. Cras mollis lacinia dui, eget lobortis sem ornare sed. Morbi at nunc nunc. Mauris interdum lacus vitae dui ultricies facilisis. Sed at ipsum dictum, blandit ligula eu, hendrerit eros. Vestibulum gravida libero eget ex consectetur scelerisque.",
          "Fusce vulputate scelerisque tellus, eget tempus odio suscipit et. Vivamus neque urna, feugiat nec lacus ut, tristique vestibulum ligula. In hac habitasse platea dictumst. Suspendisse mollis finibus ipsum eu rutrum. Phasellus ut bibendum ante. Curabitur gravida pretium tincidunt. Nam tincidunt commodo nulla a posuere. Mauris semper convallis felis, tincidunt eleifend metus placerat ut. Suspendisse dictum arcu eget lorem elementum, in varius nulla tristique. Ut volutpat enim eget dolor euismod, vitae finibus eros sagittis. Aliquam quis velit quam. Suspendisse quis nisl mi. Quisque nec massa quis ante molestie maximus. Maecenas orci risus, tincidunt eget facilisis vestibulum, sagittis viverra tortor. Quisque venenatis diam quis velit iaculis cursus. In placerat in elit id euismod.",
          "Etiam vulputate quam at mi tristique, sed ullamcorper nulla porta. Sed ut justo risus. Praesent non consectetur augue. Donec dictum neque at efficitur gravida. Nullam id cursus urna. Suspendisse lobortis ultricies purus. Pellentesque non vehicula enim.",
          "Proin vestibulum ultricies erat, et tempor massa facilisis vel. Duis orci lorem, posuere vitae ullamcorper iaculis, gravida eu lacus. Nullam dolor ligula, pellentesque mattis ligula et, tempus blandit est. Morbi auctor velit nec ornare tristique. Mauris erat lectus, laoreet non semper vel, malesuada id purus. Sed elit turpis, blandit quis feugiat nec, facilisis id felis. Nulla facilisi. Nulla et elementum nisl. Mauris et augue facilisis, blandit massa eu, bibendum neque. Ut iaculis felis a rhoncus lobortis. Fusce pellentesque, eros eu ultrices posuere, justo lectus aliquam velit, nec rhoncus diam risus sit amet sapien. Vestibulum efficitur purus ac felis tempus, sed ullamcorper ipsum sagittis. Curabitur pulvinar semper velit non volutpat. Morbi faucibus facilisis augue at vestibulum. Maecenas mollis lorem sapien, et posuere enim mollis in.",
        ].map((text) => (
          <StyledText as="p" className="px-6 py-3" variant="paragraph">
            {text}
          </StyledText>
        ))}
      </ModalWindow>
    </AppOutspaceContainer>
  );
};
