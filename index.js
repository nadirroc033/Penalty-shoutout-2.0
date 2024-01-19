document.addEventListener("DOMContentLoaded", function () {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    var window_height = window.innerHeight;
    var window_width = window.innerWidth;

    canvas.width = window_width;
    canvas.height = window_height;

    const soccerImage = new Image();
    soccerImage.src = "soccer.png";

    const boardImage = new Image();
    boardImage.src = "board.png";

    const startButton = document.createElement("button");

    const testerImage = new Image();
    testerImage.src = "StartUI.png";
    testerImage.classList.add("Tester");

    const startText = document.createElement("span");
    startText.classList.add("StartText");
    startText.textContent = "START";

    const textTitel = document.createElement("h1");
    textTitel.classList.add("TextTitel");
    textTitel.textContent = "Penalty Shootout";

    startButton.appendChild(testerImage);
    startButton.appendChild(startText);

    document.body.appendChild(textTitel);
    document.body.appendChild(startButton);

    const setStyle = (element, styles) => Object.assign(element.style, styles);

    setStyle(startButton, {
        position: "absolute",
        top: "10px",
        left: "10px",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        transform: "scale(0.4)"
    });

    setStyle(startText, {
        display: "flex",
        alignContent: "center",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "-17%",
        fontSize: "45px",
        fontWeight: "bold",
        marginLeft: "128%"
    });

    setStyle(testerImage, {
        marginLeft: "80%",
        marginTop: "26%"
    });

    setStyle(textTitel, {
        fontSize: "80px",
        marginTop: "-16%",
        marginLeft: "114%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start"
    });

    soccerImage.onload = function () {
        context.drawImage(soccerImage, 0, 0, window_width, window_height);

        boardImage.onload = function () {
            context.drawImage(boardImage, 500, 0, 500, 600);
        };
    };

    startButton.addEventListener("click", function () {
        console.log("Start Button Clicked!");


        startButton.style.transform = "scale(0.5)";


        soccerImage.style.display = "none";
        boardImage.style.display = "none";

        setTimeout(function () {
            startButton.style.transform = "scale(0.4)";
        }, 200);


        setTimeout(function () {
            document.body.style.transition = "opacity 0.5s";
            document.body.style.opacity = 0;

            setTimeout(function () {
                window.location.href = "index2.html";
            }, 500);
        }, 400);
    });
});
