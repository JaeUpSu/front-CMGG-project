import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Avatar,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuGroup,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";

import { FiSettings } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { BsPlayCircle, BsFileEarmarkText } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";

import { RiHomeHeartLine } from "react-icons/ri";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { BsPersonVideo3 } from "react-icons/bs";
import { isLoggedInVar } from "../../../src/services/apollo";
import { getAccessToken } from "../../../src/services/Token";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import css from "./Header.module.scss";
import { removeAccessToken } from "../../services/Token";
export default function WithSubnavigation() {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [isOpenToggle, setIsOpenToggle] = useState(false);
  const [context, setContext] = useState("");
  const dividerColor = useColorModeValue("gray.300", "gray.700");
  const { colorMode, toggleColorMode } = useColorMode();
  const handleMouseEnter = () => {
    setIsOpenToggle(true);
  };

  const handleMouseLeave = () => {
    setIsOpenToggle(false);
  };

  // 검색 기능
  const gotoLectures = () => {
    if (context === "") {
      navigate("/lectures/all/all?page=1");
    } else {
      let url = "/lectures/all/all?page=1&search=" + context;
      navigate(url);
      window.location.reload();
    }
  };
  const handleLogout = () => {
    removeAccessToken();
  };
  const handleButtonClick = () => {
    window.location.href = "/mypage";
  };
  const token = getAccessToken();

  return (
    <div>
      <div className={css.headerContainer}>
        <Box>
          <Flex
            bg={useColorModeValue("white", "gray.800")}
            color={useColorModeValue("gray.600", "white")}
            minH={"60px"}
            pt="2"
            px={{ base: 4 }}
            align={"center"}
          >
            <Flex
              flex={{ base: 1, md: "auto" }}
              ml={{ base: -2 }}
              display={{ base: "flex", md: "none" }}
            >
              <IconButton
                onClick={onToggle}
                icon={
                  isOpen ? (
                    <CloseIcon w={3} h={3} />
                  ) : (
                    <HamburgerIcon w={5} h={5} />
                  )
                }
                variant="ghost"
                aria-label="Toggle Navigation"
              />
            </Flex>
            <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
              <Flex
                display={{ base: "none", md: "flex" }}
                ml={10}
                w="50%"
                mt={2}
              >
                {/* <Text
                  mr="120px"
                  pt="5px"
                  pl="60px"
                  // pt={0}
                  // py={{ base: 2 }}
                  px={{ base: 4 }}
                  // textAlign={useBreakpointValue({ base: "center", md: "left" })}
                  fontFamily="heading"
                  color={useColorModeValue("gray.800", "white")}
                > */}
                <a href="/" className={css.a}>
                  <img
                    className={css.img}
                    src="https://statics.goorm.io/logo/edu/goormedu-public.svg"
                  />
                </a>
                {/* </Text> */}

                <InputGroup w="150%">
                  <Input
                    w="100%"
                    placeholder="보고싶은 강의를 검색하세용"
                    fontSize="13px"
                    // borderRadius="100%"
                    type="text"
                    className="Input"
                    border="none"
                    backgroundColor="rgb(247 247 250)"
                    _focus={{ outline: "none" }}
                    borderRadius="2xl"
                    onChange={(e) => {
                      setContext(e.target.value);
                    }}
                    onKeyDown={(
                      event: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      if (event.keyCode === 13) {
                        gotoLectures();
                      }
                    }}
                  />

                  <InputRightElement
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                  >
                    <Button
                      borderRadius="50%"
                      type="button"
                      className="Button"
                      border="none"
                      backgroundColor="#003c93;"
                      size="sm"
                      width="30px"
                      onClick={() => {
                        gotoLectures();
                      }}
                    >
                      <span
                        style={{ display: "inline-block", fontSize: "16px" }}
                      >
                        <AiOutlineSearch color="white" />
                      </span>
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Flex>
            </Flex>

            <Stack
              pr="30px"
              flex={{ base: 1, md: 0 }}
              justify="flex-end"
              direction="row"
              spacing={6}
            >
              <IconButton
                icon={
                  colorMode === "light" ? (
                    <div>🌙&nbsp; Dark</div>
                  ) : (
                    <div>🌞&nbsp; Light</div>
                  )
                }
                px="3"
                fontSize="13px"
                aria-label="Toggle color mode"
                onClick={toggleColorMode}
                marginLeft="1rem"
                _hover={
                  colorMode === "light"
                    ? { backgroundColor: "#333", color: "#eee" }
                    : { backgroundColor: "#eee", color: "#333" }
                }
              />
              {token ? (
                <Flex>
                  <a href="/mypage/cart">
                    <IoCartOutline
                      style={{
                        fontSize: 30,
                        marginRight: 20,
                      }}
                    />
                  </a>
                  {/* <BsPersonVideo3 style={{ fontSize: 30, color: "#003c93" }} /> */}

                  <Menu
                    isOpen={isOpenToggle}
                    onClose={() => setIsOpenToggle(false)}
                    placement="bottom-start"
                  >
                    <MenuButton
                      as="span"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleButtonClick()}
                      style={{ cursor: "pointer" }}
                    >
                      <a href="/mypage">
                        <Avatar
                          bg="#003c93"
                          icon={<RiHomeHeartLine size={20} />}
                          style={{ width: "32px", height: "32px" }}
                        />
                      </a>
                    </MenuButton>

                    <MenuList
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      css={{
                        position: "absolute",
                        top: "calc(100% + -8px)",
                        right: "-70px",
                        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.5)",
                        border: `1px solid ${dividerColor}`,
                        borderRadius: "0 0 10px 10px",
                        overflow: "hidden",
                        "::before": {
                          content: '""',
                          position: "absolute",
                          top: "-10px",
                          left: "20px",
                          width: "20px",
                          height: "20px",
                          transform: "skew(-45deg)",
                          background: "white",
                          border: `1px solid ${dividerColor}`,
                          borderBottom: "none",
                          borderTop: "none",
                        },
                      }}
                    >
                      {" "}
                      <div style={{ border: `1px solid ${dividerColor}` }}>
                        <MenuGroup title="대시보드">
                          <MenuItem fontSize="14px">
                            {" "}
                            <BsFileEarmarkText
                              style={{ marginRight: "10px" }}
                            />
                            학습 관리
                          </MenuItem>
                        </MenuGroup>
                        <MenuDivider color={dividerColor} />
                        <MenuGroup title="수강강의">
                          <MenuItem fontSize="14px">
                            <BsPlayCircle style={{ marginRight: "10px" }} />
                            수강중인 강의
                          </MenuItem>
                        </MenuGroup>
                        <MenuDivider color={dividerColor} />
                        <MenuGroup title="수강신청 관리">
                          <MenuItem fontSize="14px">
                            {" "}
                            <MdPayment style={{ marginRight: "10px" }} />
                            결제 내역
                          </MenuItem>
                          <MenuItem fontSize="14px">
                            <AiOutlineShoppingCart
                              style={{ marginRight: "10px" }}
                            />
                            수강바구니
                          </MenuItem>
                        </MenuGroup>
                        <MenuDivider color={dividerColor} />
                        <MenuGroup title="회원정보 수정">
                          <MenuItem fontSize="14px">
                            {" "}
                            <FiSettings style={{ marginRight: "10px" }} />
                            정보수정
                          </MenuItem>
                          <MenuItem fontSize="14px">
                            <FiLogOut
                              size={16}
                              style={{ marginRight: "10px" }}
                            />
                            로그아웃
                          </MenuItem>
                        </MenuGroup>
                      </div>
                    </MenuList>
                  </Menu>
                </Flex>
              ) : (
                <>
                  <Button
                    as="a"
                    fontSize="sm"
                    fontWeight={600}
                    variant="link"
                    href="/login"
                    _hover={{ textDecoration: "none", color: "#003c93" }}
                  >
                    Login
                  </Button>
                  <Button
                    color="#003c93"
                    as="a"
                    fontSize="sm"
                    fontWeight={600}
                    variant="link"
                    href="/signup"
                    _hover={{ textDecoration: "none", fontWeight: "700" }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          </Flex>
        </Box>
      </div>
      <Box h="20">
        <Flex
          bg={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("gray.600", "white")}
          minH={"50px"}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.900")}
          // align={"center"}
        >
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={{ base: -2 }}
            display={{ base: "flex", md: "none" }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant={"ghost"}
              aria-label={"Toggle Navigation"}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
            <Flex display={{ base: "none", md: "flex" }} ml={10} pt="6px">
              <DesktopNav />
            </Flex>
          </Flex>

          {/* <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={6}
          >
            <Button
              as={"a"}
              fontSize={"sm"}
              fontWeight={400}
              variant={"link"}
              href={"#"}
            >
              Sign In
            </Button>
            <Button
              as={"a"}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              href={"#"}
              _hover={{
                bg: "pink.300",
              }}
            >
              Sign Up
            </Button>
          </Stack> */}
        </Flex>
      </Box>
    </div>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={8}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={4}
                href={navItem.href ?? "#"}
                fontSize="md"
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: "#003c93",
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{
        bg: useColorModeValue("gray.50", "gray.900"),
        color: "rgb(0 60 147)",
      }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "#003c93" }}
            fontWeight={500}
            _hover={{
              fontWeight: "600",
            }}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"#769dd6"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Whole Lectures",
    href: "/lectures/all/all/?page=1",
  },
  {
    label: "Basic Coding",
    href: "/lectures/basic/all/?page=1",
    children: [
      {
        label: "HTML",
        subLabel: "웹사이트의 모습을 기술하기 위한 마크업 언어",
        href: "/lectures/basic/html/?page=1",
      },
      {
        label: "CSS",
        subLabel: "웹사이트에 표현되는 방법을 정해주는 스타일 시트 언어",
        href: "/lectures/basic/css/?page=1",
      },
    ],
  },
  {
    label: "Frontend",
    href: "/lectures/frontend/all/?page=1",
    children: [
      {
        label: "React",
        subLabel: "UI를 구축하기 위한 자바스크립트 라이브러리",
        href: "/lectures/frontend/react/?page=1",
      },
      {
        label: "Vue",
        subLabel: "프론트엔드 웹 개발을 위한 JavaScript 프레임워크",
        href: "/lectures/frontend/vue/?page=1",
      },
    ],
  },
  {
    label: "Backend",
    href: "/lectures/backend/all/?page=1",
    children: [
      {
        label: "Spring",
        subLabel: "Java 언어를 기반으로 한 오픈소스 애플리케이션 프레임워크",
        href: "/lectures/backend/spring/?page=1",
      },
      {
        label: "Django",
        subLabel: "Python 언어를 기반으로 한 오픈소스 애플리케이션 프레임워크",
        href: "/lectures/backend/django/?page=1",
      },
    ],
  },
  {
    label: "Mobile",
    href: "/lectures/mobile/all/?page=1",
    children: [
      {
        label: "Swift",
        subLabel: "애플에서 개발한 멀티 패러다임 프로그래밍 언어",
        href: "/lectures/mobile/swift/?page=1",
      },
      {
        label: "Kotlin",
        subLabel: "JetBrains사에서 개발한 안드로이드 앱 개발 언어",
        href: "/lectures/mobile/android/?page=1",
      },
    ],
  },
];
