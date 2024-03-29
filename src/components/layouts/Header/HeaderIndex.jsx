import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Container, Image, Media, Button, InputGroup, FormControl, Badge, Dropdown} from "react-bootstrap";
import configuration from "react-global-configuration";
import VerifiedBadgeNoShadow from "../../Handlers/VerifiedBadgeNoShadow";
// import SideBarIndex from "../SideBar/SideBarIndex";
import io from "socket.io-client";
import { updateNotificationCount } from "../../../store/actions/NotificationAction";
import Alert from "react-bootstrap/Alert";
import { connect } from "react-redux";
import { translate, t } from "react-multi-lang";
import CreateContentCreatorModal from "../../helper/CreateContentCreatorModal";
import LoginModal from "../../Model/LoginModal";
import SignupModal from "../../Model/SignupModal";
import { searchUserStart } from "../../../store/actions/HomeAction";
import CommonCenterLoader from "../../Loader/CommonCenterLoader";

let chatSocket;

const HeaderIndex = (props) => {
  const [chatCount, setChatCount] = useState(0);
  const [bellCount, setBellCount] = useState(0);

  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);

  useEffect(() => {
    console.log("Inside");
    let chatSocketUrl = configuration.get("configData.chat_socket_url");
    if (chatSocketUrl === "") {
      console.log("no keys configured");
    }
    if (configuration.get("configData.is_notification_count_enabled") == 1) {
      chatSocketConnect();
    }
    if (configuration.get("configData.is_web_notification_enabled")) {
      navigator.serviceWorker.addEventListener("message", (message) => {
        showNotification(message.data.notification);
      });
    }
  }, []);

  const showNotification = (message) => {
    var options = {
      body: message.body,
      icon: configuration.get("configData.site_icon"),
      dir: "ltr",
    };
    var notification = new Notification(message.title, options);
    notification.onclick = function (event) {
      event.preventDefault();
      window.location.replace(
        configuration.get("configData.frontend_url") + message.click_action
      );
    };
    setTimeout(notification.close.bind(notification), 5000);
  };
  const chatSocketConnect = () => {
    // check the socket url is configured
    let chatSocketUrl = configuration.get("configData.chat_socket_url");
    if (chatSocketUrl) {
      chatSocket = io(chatSocketUrl, {
        query:
          `commonid:'user_id_` +
          localStorage.getItem("userId") +
          `',myid:` +
          localStorage.getItem("userId"),
      });
      chatSocket.emit("notification update", {
        commonid: "user_id_" + localStorage.getItem("userId"),
        myid: localStorage.getItem("userId"),
      });
      if (localStorage.getItem("socket") == "true") {
        chatSocket.on("notification", (newData) => {
          console.log(newData);
          setChatCount(newData.chat_notification);
          setBellCount(newData.bell_notification);
        });
      } else {
        console.log(false);
        chatSocket.disconnect();
      }
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const [createContentCreatorModal, setCreateContentCreatorModal] =
    useState(false);

  const closeCreateContentCreatorModal = () => {
    setCreateContentCreatorModal(false);
  };

  const closeLoginModal = () => {
    setLoginModal(false);
  };
  const closeSignupModal = () => {
    setSignupModal(false);
  };

  const openSignupModal = () => {
    setLoginModal(false);
    setSignupModal(true);
  };

  const [show, toggleShow] = useState(false);
  const handleSearch = (event) => {
    if (event.currentTarget.value === "") {
      toggleShow(false);
    } else {
      toggleShow(true);
      props.dispatch(searchUserStart({ key: event.currentTarget.value }));
    }
  };



  return (
    <>
      {localStorage.getItem("userId") ? (
        <header className="main-header">
          <Container>
            <div className="new-header-sec">
              <Link to={"/"} className="new-header-logo">
                <img
                  src={configuration.get("configData.site_logo")}
                  alt={configuration.get("configData.site_name")}
                />
              </Link>
              <div className="new-header-tab">
                <Link to={"/"} onClick={() => setIsVisible(false)}>
                  <img
                    src="assets/images/icons/new/dark-icon/home-new.svg"
                    alt=""
                  />
                  <span>Home</span>
                </Link>
                <Link to={"/explore"} onClick={() => setIsVisible(false)}>
                  <img
                    src="assets/images/icons/new/dark-icon/compass-new.svg"
                    alt=""
                  />
                  <span>Explore</span>
                </Link>
                {/* {configuration.get("configData.is_one_to_many_call_enabled") ==
                1 ? (
                  <Link to={"/live-videos"} onClick={() => setIsVisible(false)}>
                    <img
                      src="assets/images/icons/new/dark-icon/tv-new.svg"
                      alt=""
                    />
                    <span>On Live</span>
                  </Link>
                ) : (
                  ""
                )} */}
                {localStorage.getItem("is_content_creator") == 2 ? (
                  <><Link to={"/add-post"} onClick={() => setIsVisible(false)}>
                    <img
                      src="assets/images/icons/new/dark-icon/plus-square-new.svg"
                      alt="" />
                    <span>New Post</span>
                  </Link>
                  <Link to={"/add-poll"} onClick={() => setIsVisible(false)}>
                      <img
                        src="assets/images/icons/new/dark-icon/plus-square-new.svg"
                        alt="" />
                      <span>Add New Poll</span>
                    </Link>
                  </>
                ) : (
                  <>
                  <Link
                      to="#"
                      onClick={() => setCreateContentCreatorModal(true)}
                    >
                      <img
                        src="assets/images/icons/new/dark-icon/plus-square-new.svg"
                        alt="" />
                      <span>New Post</span>
                    </Link>
                    <Link
                      to="#"
                      onClick={() => setCreateContentCreatorModal(true)}
                    >
                      <img
                        src="assets/images/icons/new/dark-icon/plus-square-new.svg"
                        alt="" />
                      <span>Add New Poll</span>
                    </Link>
                    </>
                )}
                <Link to={"/inbox"} onClick={() => setIsVisible(false)}>
                  <img
                    src="assets/images/icons/new/dark-icon/mail-new.svg"
                    alt=""
                  />
                  <span>Chat</span>
                </Link>
                <Link to={"/notification"} onClick={() => setIsVisible(false)}>
                  <img
                    src="assets/images/icons/new/dark-icon/bell-new.svg"
                    alt=""
                  />
                  <span>Notifications</span>
                </Link>
                <div className="new-profile-img">
                  <Link
                    to="#"
                    type="button"
                    data-drawer-trigger
                    aria-controls="drawer-name"
                    aria-expanded="false"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <img
                      src="assets/images/icons/new/dark-icon/user-new.svg"
                      alt=""
                    />
                  </Link>
                </div>
              </div>
              <div className="new-header-end">
                <div className="new-search-form">
                  <input
                    placeholder={t("search")}
                    aria-describedby="basic-addon2"
                    onChange={handleSearch}
                    className="new-search-hover-txt"
                  />
                  <a className="new-search-hover-btn">
                    <i className="fa fa-search"></i>
                  </a>
                </div>
                {show && (
                  <div className="search-dropdown-sec">
                    <ul className="list-unstyled search-dropdown-list-sec">
                      {props.searchUser.loading ? (
                        <CommonCenterLoader />
                      ) : props.searchUser.data.users.length > 0 ? (
                        props.searchUser.data.users.map((user) => (
                          <Media as="li" key={user.user_unique_id}>
                            <Link to={`/${user.user_unique_id}`}>
                              <div className="search-body">
                                <div className="user-img-sec">
                                  <Image
                                    alt="#"
                                    src={user.picture}
                                    className="user-img"
                                  />
                                </div>
                                <div className="search-content">
                                  <h5>
                                    {user.name}{" "}
                                    {user.is_verified_badge == 1 ? (
                                      <div className="pl-2">
                                        <VerifiedBadgeNoShadow />
                                      </div>
                                    ) : null}
                                  </h5>
                                  <p className="text-muted f-12">@{user.username}</p>
                                </div>
                              </div>
                            </Link>
                          </Media>
                        ))
                      ) : (
                        t("no_user_found")
                      )}
                    </ul>
                  </div>
                )}
                {/* <div className="new-dropdown-language">
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      <div className="nav-end-dropdown">
                        <img
                          src="assets/images/icons/new/dark-icon/united-kingdom.png"
                          alt=""
                        />
                        English
                        <div className="new-down-icon">
                          <img
                            src="assets/images/icons/new/dark-icon/downward-arrow.png"
                            alt=""
                          />
                        </div>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">French</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Russian</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Spanish</Dropdown.Item>
                    </Dropdown.Menu>
                    
                  </Dropdown>
                </div> */}

                <div className="new-profile-img">
                  <Link
                    to="#"
                    type="button"
                    data-drawer-trigger
                    aria-controls="drawer-name"
                    aria-expanded="false"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <img
                      src="assets/images/icons/new/dark-icon/user-new.svg"
                      alt=""
                    />
                  </Link>
                </div>
              </div>
            </div>
            {/* <div className="new-header-sec">
              <nav className="main-header-menu">
                <Link
                  to={"/home"}
                  className="main-header-menu icon-with-round-hover m-current"
                  onClick={() => setIsVisible(false)}
                >
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/new/home-new.svg"
                    }
                  />
                </Link>
                <Link
                  to={"/explore"}
                  className="main-header-menu icon-with-round-hover m-current"
                  onClick={() => setIsVisible(false)}
                >
                  
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/new/compass-new.svg"
                    }
                  />
                </Link>

                {configuration.get("configData.is_one_to_many_call_enabled") ==
                1 ? (
                  <Link
                    to={"/live-videos"}
                    className="main-header-menu icon-with-round-hover"
                    onClick={() => setIsVisible(false)}
                  >
                    <Image
                      src={
                        window.location.origin +
                        "/assets/images/icons/new/tv-new.svg"
                      }
                    />
                  </Link>
                ) : (
                  ""
                )}

                {localStorage.getItem("is_content_creator") == 2 ? (
                  <Link
                    to={"/add-post"}
                    className="main-header-menu icon-with-round-hover"
                    onClick={() => setIsVisible(false)}
                  >
                    <Image
                      src={
                        window.location.origin +
                        "/assets/images/icons/new/plus-square-new.svg"
                      }
                    />
                  </Link>
                ) : (
                  <Link
                    className="main-header-menu icon-with-round-hover"
                    onClick={() => setCreateContentCreatorModal(true)}
                  >
                    <Image
                      src={
                        window.location.origin +
                        "/assets/images/icons/new/plus-square-new.svg"
                      }
                    />
                  </Link>
                )}

                <Link
                  to={"/inbox"}
                  className="main-header-menu icon-with-round-hover"
                  onClick={() => setIsVisible(false)}
                >
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/new/mail-new.svg"
                    }
                  />
                  {chatCount > 0 ? (
                    <Badge variant="light" className="badge-notify">
                      {chatCount}
                    </Badge>
                  ) : (
                    ""
                  )}
                </Link>

                <Link
                  to={"/notification"}
                  className="main-header-menu icon-with-round-hover"
                  active-classname="m-current"
                  exact-active-classname=""
                  onClick={() => setIsVisible(false)}
                >
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/new/bell-new.svg"
                    }
                  />
                  {bellCount > 0 ? (
                    <Badge variant="light" className="badge-notify">
                      {bellCount}
                    </Badge>
                  ) : (
                    ""
                  )}
                </Link>

                <Button
                  type="button"
                  className="main-header-menu icon-with-round-hover"
                  to="#"
                  data-drawer-trigger
                  aria-controls="drawer-name"
                  aria-expanded="false"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/new/user-new.svg"
                    }
                  />
                </Button>
              </nav>
            </div> */}
          </Container>
        </header>
      ) : (
        <header className="main-header">
          <Container>
            <nav className="main-header-menu">
              <Link
                to={"/"}
                className="main-header-menu icon-with-round-hover m-current"
                onClick={() => setIsVisible(false)}
              >
                <Image
                  src={window.location.origin + "/assets/images/icons/home.svg"}
                />
              </Link>
              <ul className="list-unstyled single-profile-menu">
                <Media as="li">
                  <Link
                    to="#"
                    className="nav-link"
                    onClick={() => {
                      setSignupModal(false);
                      setLoginModal(true);
                    }}
                  >
                    Login
                  </Link>
                </Media>
                <Media as="li">
                  <Link
                    to="#"
                    className="nav-link"
                    onClick={() => {
                      setSignupModal(true);
                      setLoginModal(false);
                    }}
                  >
                    Signup
                  </Link>
                </Media>
              </ul>
            </nav>
          </Container>
        </header>
      )}
      {isVisible && localStorage.getItem("userId") ? (
        <div className="drawer" id="drawer-name" data-drawer-target>
          <div
            className="drawer__overlay"
            data-drawer-close
            tabIndex="-1"
            onClick={() => setIsVisible(!isVisible)}
          ></div>
          <div className="drawer__wrapper">
            <div className="drawer__header">
              <div className="drawer__title">
                <Link to="#" className="l-sidebar__avatar" data-name="Profile">
                  <span className="sidebar-hamburger-user-profile">
                    <Image
                      src={localStorage.getItem("user_picture")}
                      alt={configuration.get("configData.site_name")}
                    />
                  </span>
                  <span onClick={() => setIsVisible(!isVisible)}>
                    {" "}
                    <i className="material-icons add-icon">clear</i>
                  </span>
                </Link>
                <div className="pull-left side-user-head">
                  <Link
                    to={"/profile"}
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <h3 className="g-user-name">
                      {localStorage.getItem("name")} {"  "}
                      {localStorage.getItem("is_verified_badge") == 1 ? (
                        <div className="pl-2">
                          <VerifiedBadgeNoShadow />
                        </div>
                      ) : null}
                    </h3>
                    <span className="user-id">
                      @{localStorage.getItem("username")}
                    </span>
                  </Link>

                  <ul className="list-inline">
                    <Media as="li">
                      <Link to={"/fans"} onClick={() => setIsVisible(false)}>
                        <span className="fans-follow">
                          {localStorage.getItem("total_followers")
                            ? localStorage.getItem("total_followers")
                            : 0}
                        </span>{" "}
                        {t("fans")}
                      </Link>
                    </Media>
                    <Media as="li">
                      <Link
                        to={"/following"}
                        onClick={() => setIsVisible(false)}
                      >
                        <span className="fans-follow">
                          {localStorage.getItem("total_followings")
                            ? localStorage.getItem("total_followings")
                            : 0}
                        </span>{" "}
                        {t("following")}
                      </Link>
                    </Media>
                  </ul>
                </div>

                {/* <div className="pull-right">
                  <span className="m-arrow">
                    <Image
                      src={
                        window.location.origin +
                        "/assets/images/icons/arrow-down.svg"
                      }
                      alt={configuration.get("configData.site_name")}
                    />
                  </span>
                </div> */}
              </div>
              {/* <Button
              className="drawer__close"
              data-drawer-close
              aria-label="Close Drawer"
            ></Button> */}
            </div>
            <div className="drawer__content">
              <div className="right-sidebar-menu-item">
                <Link
                  to={"/profile"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/Profile.png"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("my_profile")}
                </Link>

                {localStorage.getItem("is_content_creator") != 2 ? (
                  <Link
                    to={"/become-a-content-creator"}
                    className="sidebar-menus-item"
                    data-name="Profile"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <Image
                      src={
                        window.location.origin +
                        "/assets/images/icons/referal-friend.svg"
                      }
                      alt={configuration.get("configData.site_name")}
                    />{" "}
                    {t("become_a_content_creator")}
                  </Link>
                ) : (
                  <Link
                    to={"/dashboard"}
                    className="sidebar-menus-item"
                    data-name="Profile"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <Image
                      src={
                        window.location.origin +
                        "/assets/images/icons/analytics.svg"
                      }
                      alt={configuration.get("configData.site_name")}
                    />{" "}
                    {t("dashboard")}
                  </Link>
                )}

                {/* <Link
                  to={"/ecom"}
                  className="sidebar-menus-item"
                  data-name="ecommerce"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <i className="fas fa-shopping-bag"></i>
                  {t("ecommerce")}
                </Link> */}

                <Link
                  to={"/stories"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <i className="fas fa-history"></i>
                  {t("stories")}
                </Link>

                <Link
                  to={"/bookmarks"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/bookmarks.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("bookmarks")}
                </Link>
                <Link
                  to={"/list"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/lists.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("lists")}
                </Link>
                <hr className="sidebar-menu-divider" />

                <Link
                  to={"/edit-profile"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin +
                      "/assets/images/icons/settings.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("settings")}
                </Link>

                {/* <Link
                  to={"/live-videos"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/live.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("live_videos")}
                </Link> */}
                {/* {configuration.get("configData.is_one_to_one_call_enabled") ==
                1 ? (
                  <>
                    <Link
                      to={"/video-calls-history"}
                      className="sidebar-menus-item"
                      data-name="Profile"
                      onClick={() => setIsVisible(!isVisible)}
                    >
                      <Image
                        src={
                          window.location.origin +
                          "/assets/images/icons/video.svg"
                        }
                        alt={configuration.get("configData.site_name")}
                      />{" "}
                      {t("video_calls")}
                    </Link>
                    <Link
                      to={"/audio-calls-history"}
                      className="sidebar-menus-item"
                      data-name="Profile"
                      onClick={() => setIsVisible(!isVisible)}
                    >
                      <Image
                        src={
                          window.location.origin +
                          "/assets/images/icons/audio.png"
                        }
                        alt={configuration.get("configData.site_name")}
                      />{" "}
                      {t("audio_calls")}
                    </Link>
                  </>
                ) : (
                  ""
                )} */}

                {configuration.get("configData.is_referral_enabled") == 1 ? (
                  <Link
                    to={"/referrals"}
                    className="sidebar-menus-item"
                    data-name="Profile"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    <i className="fas fa-gift"></i> {t("referrals")}
                  </Link>
                ) : (
                  ""
                )}

                <div to="#" className="sidebar-menus-dark">
                  <div className="toggle-mode">
                    <div className="toggle-switch">
                      <label className="switch">
                        <input
                          type="checkbox"
                          id="switch-style"
                          onChange={props.toggleTheme}
                          checked={props.darkTheme}
                        />
                        <div className="slider round" id="switch-style"></div>
                      </label>
                      <div className="toggle-label">
                        <p>Dark Mode</p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="sidebar-menu-divider" />

                {/* <Link
                  to={"/cards"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/card.svg"
                    }
                    alt="Your Cards"
                  />{" "}
                  {t("your_cards")}{" "}
                  <span className="desc">({t("to_subscribe")})</span>
                </Link> */}

                <Link
                  to={"/add-bank"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/bank.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("add_bank")} <span className="desc">({t("to_earn")})</span>
                </Link>
                <Link
                  to={"/wallet"}
                  className="sidebar-menus-item"
                  data-name="Wallet"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/wallet.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("wallet")}{" "}
                  <span className="desc">({t("your_earnings")})</span>
                </Link>

                <hr className="sidebar-menu-divider" />

                <Link
                  to={`/help`}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/help.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("help_and_support")}
                </Link>

                <Link
                  to=""
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                  style={{ display: "none" }}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/dark.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("dark_mode")}
                </Link>
                <hr className="sidebar-menu-divider" />
                <Link
                  to={"/logout"}
                  className="sidebar-menus-item"
                  data-name="Profile"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  <Image
                    src={
                      window.location.origin + "/assets/images/icons/logout.svg"
                    }
                    alt={configuration.get("configData.site_name")}
                  />{" "}
                  {t("logout")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <CreateContentCreatorModal
        createContentCreatorModal={createContentCreatorModal}
        closeCreateContentCreatorModal={closeCreateContentCreatorModal}
      />
      <LoginModal
        loginModal={loginModal}
        closeLoginModal={closeLoginModal}
        openSignupModal={openSignupModal}
      />
      <SignupModal
        signupModal={signupModal}
        closeSignupModal={closeSignupModal}
      />
    </>
  );
  
};


const mapStateToPros = (state) => ({
  notifications: state.notification.notifications,
  searchUser: state.home.searchUser,
});

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(
  mapStateToPros,
  mapDispatchToProps
)(translate(HeaderIndex));
