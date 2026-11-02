
/*--- 404 Page Elements ---*/
const bp404GoHome = document.getElementById("bp-404-go-home");
const bp404GoBack = document.getElementById("bp-404-go-back");

/*--- Go To Home ---*/
if (bp404GoHome) {
    bp404GoHome.addEventListener("click", function () {
        window.location.href = "index.html";
    });
}

/*--- Go Back To Previous Page ---*/
if (bp404GoBack) {
    bp404GoBack.addEventListener("click", function () {
        if (window.history.length > 1 && document.referrer) {
            window.history.back();
        } else {
            window.location.href = "index.html";
        }
    });
}
