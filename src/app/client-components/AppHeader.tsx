"use client";

import { Button } from "@/app/client-components/Button";
import { Icon } from "@/app/client-components/Icon";
import { Menu } from "@/app/client-components/Menu";
import { Tooltip } from "@/app/client-components/Tooltip";
import { useAppContext } from "@/app/context";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";

export { AppHeader };

interface AppHeaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {}

const menuItems = [
  {
    default: true,
    href: "/invoices-and-bills",
    label: "Invoices & Bills",
  },
];

const AppHeader = ({ className, ...otherProps }: AppHeaderProps) => {
  const { dispatch: dispatchAppAction, state: appState } = useAppContext();

  const [isDarkModeEnabledLocally, setIsDarkModeEnabledLocally] =
    useLocalStorage<boolean | undefined>({
      key: "isDarkModeEnabled",
      initialValue: undefined,
    });

  const pathname = usePathname();

  const router = useRouter();

  const { authenticatedCompany, isDarkModeEnabled: isDarkModeEnabledInState } =
    appState;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (typeof isDarkModeEnabledLocally === "undefined" && mediaQuery.matches) {
      setIsDarkModeEnabledLocally(true);
    }
  }, [isDarkModeEnabledLocally, setIsDarkModeEnabledLocally]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkModeEnabledLocally);

    dispatchAppAction({
      type: "settings/setIsDarkModeEnabled",
      payload: {
        isDarkModeEnabled: isDarkModeEnabledLocally ?? false,
      },
    });
  }, [dispatchAppAction, isDarkModeEnabledLocally]);

  const handleClickToggleDarkMode = () => {
    setIsDarkModeEnabledLocally(!isDarkModeEnabledLocally);
  };

  return (
    <div
      className={twMerge(
        `
          flex
          justify-between
          bg-brandColor
          px-6
          py-3
          text-white
        `,
        className
      )}
      {...otherProps}
    >
      <div className="flex items-center gap-12">
        <div className="font-bold">CoFi</div>

        <div className="flex h-full items-stretch gap-6">
          {menuItems.map((menuItem) => {
            const isActive =
              pathname.startsWith(menuItem.href) ||
              (menuItem.default &&
                (pathname === "/" || pathname.startsWith("/#")));

            return (
              <Link
                className={twMerge(
                  `
                    -my-3
                    flex
                    grow
                    items-center
                    border-y-4
                    border-y-transparent
                    transition
                    hover:border-b-white/50
                    hover:opacity-100
                  `,
                  isActive ? "border-b-white" : "opacity-80"
                )}
                href={menuItem.href}
                key={menuItem.href}
              >
                {menuItem.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Tooltip className="dark" tip="Toggle Dark/Light Mode">
          <Button variant="iconOnly">
            <Icon
              name={isDarkModeEnabledInState ? "lightbulb-on" : "moon-cloud"}
              onClick={handleClickToggleDarkMode}
            />
          </Button>
        </Tooltip>

        <div>
          Logged in as{" "}
          <span className="font-bold">
            {authenticatedCompany?.name ?? authenticatedCompany?.email}
          </span>
        </div>

        <Menu
          contentBeforeItems={
            <div
              className="
                flex
                cursor-default
                flex-col
                gap-0
                bg-shadedColor
                px-4
                py-2
                text-fadedTextColor
                dark:bg-shadedColorInDarkMode
                dark:text-fadedTextColorInDarkMode
              "
            >
              <span>
                {authenticatedCompany?.name ?? authenticatedCompany?.email}
              </span>

              {authenticatedCompany?.name && (
                <span className="text-xs">{authenticatedCompany?.email}</span>
              )}
            </div>
          }
          items={[
            [
              {
                icon: "square-user",
                label: "Profile",
                href: "/profile",
              },
            ],
            [
              {
                icon: "power-off",
                label: "Log Out",
                href: "/",
              },
            ],
          ]}
          trigger={<Icon className="hover:animate-spin" name="gear" />}
        />
      </div>
    </div>
  );
};
