const COGNITO_CONFIG = {
  UserPoolId: "YOUR_USER_POOL_ID",
  ClientId: "YOUR_CLIENT_ID",
};

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const authData = {
      Username: email,
      Password: password,
    };

    // Initialize the Amazon Cognito AuthenticationDetails
    const authenticationDetails =
      new AmazonCognitoIdentity.AuthenticationDetails(authData);

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(COGNITO_CONFIG);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        const token = result.getIdToken().getJwtToken();
        sessionStorage.setItem("userToken", token);
        window.location.href = "upload.html";
      },
      onFailure: function (err) {
        alert("Error: " + err.message || JSON.stringify(err));
      },
    });
  } catch (error) {
    alert("Error: " + error.message);
  }
});
