import "../../styles/loginStyle.css";

function SignupLink() {
  return (
    <span class="signUp">
      <button
        class="signUpButton"
        onclick="document.getElementById('id01').style.display='block'"
      >
        Don't have an account? Make one here!
      </button>
    </span>
  );
}

export default SignupLink;
