import { FC, Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/dist/client/router";
import Content from "../Content";

const navLinks = [
  { title: "Dashboard", active: true, to: "/" },
  // { title: "Customers", active: false, to: "/customers" },
  { title: "Mansions", active: false, to: "/mansions" },
  { title: "Hosts", active: false, to: "/hosts" },
  { title: "Task Definitions", active: false, to: "/taskDefinitions" },
  { title: "Tasks", active: false, to: "/tasks" },
  // { title: "Company Directory", active: false },
  // { title: "Openings", active: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  children: React.ReactNode;
};

const Layout: FC<Props> = (props) => {
  const { children } = props;
  const { data: session } = useSession();

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <Popover as="header" className="pb-24 bg-indigo-600">
        {({ open }) => (
          <>
            <div className=" mx-auto px-4 sm:px-6  lg:px-8">
              <div className="relative py-5 flex items-center justify-center lg:justify-between">
                {/* Logo */}
                <div className="absolute left-0 flex-shrink-0 lg:static">
                  <Link href="/">
                    <a>
                      <span className="sr-only">Workflow</span>
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-300.svg"
                        alt="Workflow"
                      />
                    </a>
                  </Link>
                </div>

                {/* Right section on desktop */}
                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                  {/* <button
                      type="button"
                      className="flex-shrink-0 p-1 text-indigo-200 rounded-full hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}

                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-4 relative flex-shrink-0">
                    {({ open: isUserMenuOpen }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-white rounded-full flex text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://www.gravatar.com/avatar/ANY"
                              // FIXME: Azure AD profilephoto is not working, https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#/examples
                              // src={session.user.image ?? "https://www.gravatar.com/avatar/ANY"}
                              alt={session.user.name}
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={isUserMenuOpen}
                          as={Fragment}
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="origin-top-right z-40 absolute -right-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            {/* <Menu.Item>
                                {({ active }) => (
                                  <Link href="/profile">
                                    <a
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Your Profile
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item> */}
                            {/* <Menu.Item>
                                {({ active }) => (
                                  <Link href="/settings">
                                    <a
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Settings
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item> */}
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  role="button"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    signOut();
                                  }}
                                  aria-hidden="true"
                                >
                                  Sign out
                                </div>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>

                {/* Search */}
                {/* <div className="flex-1 min-w-0 px-12 lg:hidden">
                    <div className="max-w-xs w-full mx-auto">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative text-white focus-within:text-gray-600">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <SearchIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <input
                          id="search"
                          className="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Search"
                          type="search"
                          name="search"
                        />
                      </div>
                    </div>
                  </div> */}

                {/* Menu button */}
                <div className="absolute right-0 flex-shrink-0 lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="bg-transparent p-2 rounded-md inline-flex items-center justify-center text-indigo-200 hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
              </div>
              <div className="hidden lg:block border-t border-white border-opacity-20 py-5">
                <div className="grid grid-cols-3 gap-8 items-center">
                  <div className="col-span-2">
                    <nav className="flex space-x-4">
                      {navLinks.map((link) => (
                        <Link key={link.title} href={link.to}>
                          <a
                            className={classNames(
                              router.pathname === link.to
                                ? "text-white  bg-opacity-10"
                                : "text-indigo-100",
                              "text-sm font-medium rounded-md bg-white bg-opacity-0 px-3 py-2 hover:bg-opacity-10"
                            )}
                            aria-current={router.pathname === link.to ? "page" : "false"}
                          >
                            {link.title}
                          </a>
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div>
                    {/* <div className="max-w-md w-full mx-auto">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative text-white focus-within:text-gray-600">
                          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <SearchIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            id="search"
                            className="block w-full bg-white bg-opacity-20 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-gray-900 placeholder-white focus:outline-none focus:bg-opacity-100 focus:border-transparent focus:placeholder-gray-500 focus:ring-0 sm:text-sm"
                            placeholder="Search"
                            type="search"
                            name="search"
                          />
                        </div>
                      </div> */}
                  </div>
                </div>
              </div>
            </div>

            <Transition.Root show={open} as={Fragment}>
              <div className="lg:hidden">
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Overlay static className="z-20 fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    static
                    className="z-30 absolute top-0 inset-x-0  mx-auto w-full p-2 transition transform origin-top"
                  >
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y divide-gray-200">
                      <div className="pt-3 pb-2">
                        <div className="flex items-center justify-between px-4">
                          <div>
                            <img
                              className="h-8 w-auto"
                              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                              alt="Workflow"
                            />
                          </div>
                          <div className="-mr-2">
                            <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                              <span className="sr-only">Close menu</span>
                              <XIcon className="h-6 w-6" aria-hidden="true" />
                            </Popover.Button>
                          </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                          {navLinks.map((item) => (
                            <Link key={item.title} href={item.to}>
                              <a className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                                {item.title}
                              </a>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="pt-4 pb-2">
                        <div className="flex items-center px-5">
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src="https://www.gravatar.com/avatar/ANY"
                              // FIXME: Azure AD profilephoto is not working, https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#/examples
                              // src={session.user.image ?? "https://www.gravatar.com/avatar/ANY"}
                              alt={session.user.name}
                            />
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <div className="text-base font-medium text-gray-800 truncate">
                              {session.user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500 truncate">
                              {session.user.email}
                            </div>
                          </div>
                          {/* <button className="ml-auto flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <span className="sr-only">
                                View notifications
                              </span>
                              <BellIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button> */}
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                          {/* <Link href="/profile">
                              <a className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                                Your Profile
                              </a>
                            </Link> */}

                          {/* <Link href="/settings">
                              <a className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800">
                                Settings
                              </a>
                            </Link> */}

                          <div
                            role="button"
                            className="block rounded-md px-3 py-2 text-base text-gray-900 font-medium hover:bg-gray-100 hover:text-gray-800"
                            onClick={(e) => {
                              e.preventDefault();
                              signOut();
                            }}
                            aria-hidden="true"
                          >
                            Sign out
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition.Child>
              </div>
            </Transition.Root>
          </>
        )}
      </Popover>
      <main className="-mt-24 pb-8 mx-auto">
        <Content>{children}</Content>
      </main>
      <footer>
        <div className=" mx-auto px-4  ">
          <div className="border-t border-gray-200 py-8 text-sm text-gray-500 text-center sm:text-left">
            <span className="block sm:inline">
              &copy; {new Date().getFullYear()} funnyapp Inc.
            </span>{" "}
            <span className="block sm:inline">All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );

  // return <Login />;
};

export default Layout;
