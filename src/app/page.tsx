"use client";

import { AppOutspaceContainer } from "@/app/client-components/AppOutspaceContainer";
import { AnchorButton } from "@/app/client-components/Button";
import { Container } from "@/app/client-components/Container";
import { Icon } from "@/app/client-components/Icon";
import { StyledText } from "@/app/client-components/StyledText";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default () => {
  const router = useRouter();

  const GetStartedButton = (
    <AnchorButton href="/signup" iconRight="chevron-right" variant="primary">
      Get Started
    </AnchorButton>
  );

  return (
    <AppOutspaceContainer
      className="
        flex
        h-screen
        flex-col
        items-stretch
        justify-stretch
        gap-0
      "
    >
      <header
        className="
          group/header
          dark
          flex
          items-center
          justify-between
          bg-appBackgroundColorInDarkMode
          px-6
          py-3
          text-appBackgroundColor
          hover:text-appBackgroundColor
        "
      >
        <div className="italic">
          <span
            className="
              font-bold
              not-italic
            "
          >
            CoFi
          </span>{" "}
          by Informal Systems
        </div>

        <div className="space-x-6">
          <AnchorButton
            className="opacity-10 group-hover/header:opacity-100"
            href="/invoices-and-bills"
            variant="link--subtle"
          >
            Invoices & Bills
          </AnchorButton>

          <AnchorButton href="/login" variant="link--subtle">
            Log In
          </AnchorButton>

          <AnchorButton href="/signup" variant="primary">
            Sign Up
          </AnchorButton>
        </div>
      </header>

      <main
        className="
          flex-grow
          overflow-y-auto
          overflow-x-hidden
          md:snap-y
          md:snap-proximity
        "
      >
        <section
          className="
            dark
            relative
            flex
            min-h-screen
            snap-start
            items-center
            justify-center
            bg-gradient-to-tr
            from-transparent
            to-brandColor
            py-12
            text-center
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              h-full
              w-full
              overflow-hidden
              opacity-30
              mix-blend-luminosity
            "
          >
            <Image
              className="scale-125 object-cover"
              src="/images/homepage/graphic.network-diagram.png"
              alt="Network"
              fill={true}
            />
          </div>

          <Container>
            <div className="scale-100 space-y-12 transition md:scale-125">
              <div
                className="space-y-1.5"
                style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.4)" }}
              >
                <StyledText as="h2" variant="h1">
                  Unleash the Power of{" "}
                  <span className="whitespace-nowrap">Liquidity Savings</span>
                </StyledText>

                <StyledText as="p" variant="paragraph">
                  Maximize your company&rsquo;s financial stability by freeing
                  up working capital, saving on invoice payment fees, and
                  building stronger relationships with your{" "}
                  <span className="whitespace-nowrap">
                    customers and suppliers.
                  </span>
                </StyledText>
              </div>

              {GetStartedButton}
            </div>
          </Container>
        </section>

        <section
          className="
            dark
            flex
            min-h-screen
            snap-start
            items-center
            justify-center
            py-12
          "
        >
          <Container>
            <div className="space-y-12">
              <StyledText as="h2" variant="h1">
                Make Capital Work Harder For Your Business
              </StyledText>

              <div
                className="
                  grid
                  gap-12
                  md:grid-cols-3
                "
              >
                <div className="space-y-3">
                  <StyledText as="h3" variant="h4">
                    <br className="hidden md:block" />
                    Free Up Working Capital
                  </StyledText>
                  <StyledText as="p" variant="paragraph">
                    Reduce outstanding Accounts Payable by letting Collaborative
                    Finance&rsquo;s cutting edge technology offset it through
                    Account Receivable balances.
                  </StyledText>
                </div>

                <div className="space-y-3">
                  <StyledText as="h3" variant="h4">
                    <br className="hidden md:block" />
                    Save On Fees
                  </StyledText>
                  <StyledText as="p" variant="paragraph">
                    Pay a fraction of the cost to settle invoices when compared
                    to credit cards.
                  </StyledText>
                </div>

                <div className="space-y-3">
                  <StyledText as="h3" variant="h4">
                    Get Closer to Your{" "}
                    <span className="whitespace-nowrap">
                      Customers <span className="font-light italic">and</span>{" "}
                      Suppliers
                    </span>
                  </StyledText>
                  <StyledText as="p" variant="paragraph">
                    When Collaborative Finance finds set-offs everyone wins
                    &mdash; your suppliers, you, your customers.
                  </StyledText>
                </div>
              </div>

              <div className="text-center">{GetStartedButton}</div>
            </div>
          </Container>
        </section>

        <section
          className="
            dark
            flex
            min-h-screen
            snap-start
            items-center
            justify-center
            bg-brandColor/20
            py-12
          "
        >
          <Container className="space-y-12">
            <StyledText as="h2" variant="h1">
              How It Works
            </StyledText>

            <div
              className="
                flex
                flex-col
                items-center
                gap-12
                md:grid
                md:grid-cols-3
                md:gap-6
              "
            >
              <div
                className="
                  space-y-1
                "
              >
                <StyledText as="h3" variant="label">
                  Step One
                </StyledText>

                <StyledText as="h4" variant="h3">
                  Input Your Obligations
                </StyledText>

                <StyledText as="p" variant="paragraph">
                  Upload invoices in bulk (CSV format), or punch-in manually.
                  The more you add, the greater your potential savings.
                </StyledText>
              </div>

              <div
                className="
                  relative
                  flex
                  h-[316px]
                  items-center
                  justify-center
                  font-bold
                "
              >
                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    z-10
                    h-[316px]
                    -translate-x-1/2
                    -translate-y-1/2
                    md:scale-75
                    lg:scale-100
                  "
                >
                  <svg
                    width="662"
                    height="316"
                    viewBox="0 0 662 316"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g className="opacity-100">
                      <rect
                        className="fill-accentColor"
                        x="216"
                        y="108"
                        width="198"
                        height="75"
                        rx="37.5"
                      />
                      <rect
                        className="fill-accentColor"
                        x="182"
                        y="142"
                        width="296"
                        height="80"
                        rx="40"
                      />
                      <rect
                        className="fill-accentColor"
                        x="251"
                        y="65"
                        width="89"
                        height="89"
                        rx="44.5"
                      />
                    </g>
                    <path
                      className="
                        fill-transparent
                        md:fill-accentColor
                      "
                      d="M195.938 84.9981C196.489 85.0323 196.964 84.6131 196.998 84.0619L197.555 75.0791C197.589 74.5279 197.17 74.0533 196.618 74.0192C196.067 73.985 195.593 74.4042 195.558 74.9554L195.064 82.9401L187.079 82.4455C186.528 82.4114 186.053 82.8305 186.019 83.3818C185.985 83.933 186.404 84.4075 186.955 84.4417L195.938 84.9981ZM0.800455 89.7855C0.405798 90.1718 0.399064 90.805 0.785412 91.1996C1.17176 91.5943 1.80489 91.601 2.19955 91.2147L0.800455 89.7855ZM196.749 83.338C169.994 53.0486 132.902 42.9818 96.596 46.3167C60.3096 49.6498 24.7184 66.371 0.800455 89.7855L2.19955 91.2147C25.7816 68.129 60.9404 51.6003 96.779 48.3084C132.598 45.0183 169.006 54.9515 195.251 84.6621L196.749 83.338Z"
                    />
                    <path
                      className="
                        fill-transparent
                        md:fill-accentColor
                      "
                      d="M620.739 259.535C621.272 259.391 621.821 259.706 621.965 260.239L624.314 268.927C624.458 269.461 624.142 270.01 623.609 270.154C623.076 270.298 622.527 269.982 622.383 269.449L620.296 261.726L612.573 263.814C612.039 263.958 611.49 263.642 611.346 263.109C611.202 262.576 611.518 262.027 612.051 261.883L620.739 259.535ZM375.157 245.538C374.86 245.073 374.996 244.455 375.462 244.157C375.927 243.86 376.545 243.996 376.843 244.462L375.157 245.538ZM621.867 260.998C611.576 278.911 593.417 290.741 571.481 297.47C549.543 304.199 523.749 305.855 498.029 303.365C472.304 300.876 446.602 294.235 424.836 284.326C403.086 274.425 385.176 261.218 375.157 245.538L376.843 244.462C386.574 259.692 404.102 272.69 425.664 282.506C447.211 292.315 472.696 298.904 498.221 301.375C523.751 303.845 549.269 302.191 570.894 295.558C592.521 288.924 610.174 277.339 620.133 260.002L621.867 260.998Z"
                    />
                    <path
                      className="
                        fill-accentColor
                        md:fill-transparent
                      "
                      d="M178.192 110.395C178.412 110.901 178.18 111.49 177.674 111.711L169.421 115.301C168.914 115.521 168.325 115.289 168.105 114.783C167.885 114.276 168.117 113.687 168.623 113.467L175.959 110.276L172.768 102.94C172.548 102.433 172.779 101.844 173.286 101.624C173.792 101.403 174.382 101.635 174.602 102.142L178.192 110.395ZM164.457 0.982945C164.857 0.601743 165.49 0.61668 165.871 1.01631C166.252 1.41594 166.237 2.04893 165.838 2.43013L164.457 0.982945ZM176.909 111.724C149.334 100.867 137.459 81.4259 136.946 60.4801C136.434 39.6265 147.184 17.4593 164.457 0.982945L165.838 2.43013C148.871 18.6144 138.45 40.2679 138.945 60.4311C139.437 80.5022 150.746 99.274 177.641 109.863L176.909 111.724Z"
                    />
                    <path
                      className="
                        fill-accentColor
                        md:fill-transparent
                      "
                      d="M493.34 310.395C493.12 310.901 493.352 311.49 493.858 311.711L502.111 315.301C502.618 315.521 503.207 315.289 503.427 314.783C503.648 314.276 503.416 313.687 502.909 313.467L495.573 310.276L498.764 302.94C498.985 302.433 498.753 301.844 498.246 301.624C497.74 301.403 497.151 301.635 496.93 302.142L493.34 310.395ZM507.075 200.983C506.675 200.602 506.042 200.617 505.661 201.016C505.28 201.416 505.295 202.049 505.695 202.43L507.075 200.983ZM494.624 311.724C522.198 300.867 534.073 281.426 534.587 260.48C535.098 239.626 524.348 217.459 507.075 200.983L505.695 202.43C522.661 218.614 533.082 240.268 532.587 260.431C532.095 280.502 520.786 299.274 493.891 309.863L494.624 311.724Z"
                    />
                  </svg>
                </div>

                <StyledText
                  as="div"
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    z-20
                    -translate-x-1/2
                    translate-y-1/2
                    whitespace-nowrap
                    md:max-lg:translate-y-1/4
                  "
                  variant="h3"
                >
                  CoFi in the Cloud
                </StyledText>
              </div>

              <div
                className="
                  space-y-1
                "
              >
                <StyledText as="h3" variant="label">
                  Step Two
                </StyledText>
                <StyledText as="h4" variant="h3">
                  Receive Set-Off Notices
                </StyledText>
                <StyledText as="p" variant="paragraph">
                  If payment cycles are found, you&rsquo;ll receive official
                  set-off notices to adjust your books.
                </StyledText>
              </div>
            </div>

            <div className="text-center">{GetStartedButton}</div>
          </Container>
        </section>

        <footer
          className="
            dark
            snap-start
            pb-12
          "
        >
          <Container
            className="
              flex
              items-start
              justify-between
            "
          >
            <div className="space-y-1">
              <StyledText as="h3" variant="label">
                Stewarded By
              </StyledText>

              <div className="relative h-14 w-32">
                <Image
                  alt="Informal Systems Logo"
                  src="/images/homepage/logo.informal-systems.white.svg"
                  fill={true}
                />
              </div>
            </div>

            <div className="space-y-3 text-right">
              <div className="space-x-3">
                <AnchorButton href="#" variant="link--subtle">
                  Terms of Use
                </AnchorButton>

                <AnchorButton href="#" variant="link--subtle">
                  Privacy Policy
                </AnchorButton>
              </div>

              <div className="space-x-2">
                <AnchorButton
                  className="no-underline"
                  href="#"
                  variant="link--subtle"
                >
                  <Icon name="github" variant="brands" />
                </AnchorButton>

                <AnchorButton
                  className="no-underline"
                  href="#"
                  variant="link--subtle"
                >
                  <Icon name="twitter" variant="brands" />
                </AnchorButton>

                <AnchorButton
                  className="no-underline"
                  href="#"
                  variant="link--subtle"
                >
                  <Icon name="discord" variant="brands" />
                </AnchorButton>

                <AnchorButton
                  className="no-underline"
                  href="#"
                  variant="link--subtle"
                >
                  <Icon name="linkedin" variant="brands" />
                </AnchorButton>
              </div>
            </div>
          </Container>
        </footer>
      </main>
    </AppOutspaceContainer>
  );
};
