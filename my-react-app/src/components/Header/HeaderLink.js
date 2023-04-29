import "../../styles/commonStyle.css";

function HeaderLink(props) {
  const { curPage } = props;
  return (
    <span>
      {/* Sets the buttons color to active based on which page is on */}
      <a className={curPage === "home" ? "active" : ""} href="/">
        Home
      </a>
      <a className={curPage === "profile" ? "active" : ""} href="profile">
        Profile
      </a>
      <a
        className={curPage === "predictions" ? "active" : ""}
        href="predictions"
      >
        Top Predictions
      </a>
      <a className={curPage === "help" ? "active" : ""} href="help">Help</a>
    </span>
  );
}

export default HeaderLink;
