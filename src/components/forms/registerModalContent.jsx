import React, { useEffect } from "react";
import ModalFooter from "./modalFooter";
// import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";
import SocialButton from "./socialButton";
import Icon from "../icon";
import TwitterLogin from "react-twitter-login";

export default function RegisterModalContent({
  onClose,
  onOpen,
  handleFormClick,
  handleRegisterClick,
}) {
  const handleTwitterLogin = (response) => {
    // Handle the response from Twitter login here
    console.log(response);
  };

  useEffect(() => {
    // Load the Facebook SDK asynchronously
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "3708593066040334",
          cookie: true,
          xfbml: true,
          version: "v14.0",
        });
      };

      // Load the Facebook SDK script
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.onload = initializeFacebookSDK;
      document.body.appendChild(script);
    };

    // Initialize the Facebook SDK
    const initializeFacebookSDK = () => {
      window.FB.init({
        appId: "3708593066040334",
        cookie: true,
        xfbml: true,
        version: "v14.0",
      });
    };

    // Load the Facebook SDK when the component mounts
    loadFacebookSDK();

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(
        document.querySelector(
          "script[src='https://connect.facebook.net/en_US/sdk.js']"
        )
      );
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        // Handle the response from Facebook login here
        console.log(response);
      },
      { scope: "email" } // Add any additional permissions you need
    );
  };

  return (
    <div className="modal-container">
      <img
        src="/brandNew.webp"
        alt="brand image"
        className="join-bannerImage"
      />
      <div>
        <div className="modal-content" onClick={handleFormClick}>
          <div>
            <Icon cancel className="cancel" onClick={onClose} />
          </div>
          <ModalHeading title="Create a new account" />
          <h4>
            Already have an account? <span onClick={onOpen}>Sign in</span>
          </h4>
          <SocialButton register handleRegisterClick={handleRegisterClick} />

          <div className="separator">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <div className="btn-group">
            <TwitterLogin
              authCallback={handleTwitterLogin}
              consumerKey="y4deowryNFB4JVMvYckJutyhZ" // Replace with your Twitter API key
              consumerSecret="qob0dx6e6x6FSCzmB7cDByTaJHAOukOwI1WlZJDRpOEtChncmH" // Replace with your Twitter API secret
              buttonTheme="dark"
              buttonText="Sign in with Twitter"
            >
              <button className="login-btn">
                <Icon twitter />
                Twitter
              </button>
            </TwitterLogin>

            {/* <button className="login-btn">
              <Icon twitter />
              Twitter
            </button> */}

            <button className="login-btn" onClick={handleFacebookLogin}>
              <Icon facebook />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
