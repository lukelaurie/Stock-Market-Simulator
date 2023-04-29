import "../styles/commonStyle.css";

function HeaderLink(props) {
  const { curPage } = props;
  console.log(curPage);
  return (
    <span>
      {/* Sets the buttons color to active based on which page is on */}
      <a className={curPage === "home" ? "active" : ""} href="index.html">
        Home
      </a>
      <a className={curPage === "profile" ? "active" : ""} href="profile.html">
        Profile
      </a>
      <a
        className={curPage === "predictions" ? "active" : ""}
        href="predictions.html"
      >
        Top Predictions
      </a>
    </span>
  );
}

export default HeaderLink;
