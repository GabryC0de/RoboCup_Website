document.addEventListener('DOMContentLoaded', () => {
    const jsonData = async () => {
        const response = await fetch(
            `../../../users/Node/prova.json`);
        const data = await response.json();
        return data;
    };

    // fetching the json data
    jsonData().then((data) => {

        // getting the team name from the browser storage
        const strTeam = localStorage.getItem('selectedTeam');
        console.log(strTeam);

        // const generalContainer = document.querySelector('.container');
        for (let i = 0; i < data.years.length; i++) {
            let yearTeamsJson = data.years[i].yearTeams;
            yearTeamsJson.forEach((team) => {



                // if the name in the json matches the name retrieved from the click then start building the html
                if (team.teamName === strTeam) {

                    let teamMembers = team.members;
                    const container = document.querySelector('.carrossel'); // assume you have a container element with id "teams-container"
                    let childCounter = 1;
                    teamMembers.forEach((member, index) => {
                        // generating the html
                        const html = `
                            <div class="carrossel-item">
                                <div class="infos">
                                    <p>${member} | ${team.membersRole[index]}</p>
                                </div>
                            </div>
                        `;

                        const cssRule = `
                            .carrossel-item:nth-child(${childCounter}) {
                                --rotatey: 0;
                                transform: rotatey(var(--rotatey)) translatez(var(--tz));
                                background: url('${team.membersImg[index]}');
                                background-size: cover;
                            }
                        `;
                        document.styleSheets[0].insertRule(cssRule, document.styleSheets[0].cssRules.length);
                        container.innerHTML += html;
                        childCounter++;
                    });
                }
            });
        }

        // ultra fucking cool JavaScript animated caroussel from GitHub (Cassianosch)
        const container = document.querySelector(".container");
        const containercarrossel = container.querySelector(".container-carrossel");
        const carrossel = container.querySelector(".carrossel");
        const carrosselItems = carrossel.querySelectorAll(".carrossel-item");

        // state-changing variables
        let isMouseDown = false;
        let currentMousePos = 0;
        let lastMousePos = 0;
        let lastMoveTo = 0;
        let moveTo = 0;

        const createcarrossel = () => {
            const carrosselProps = onResize();
            const length = carrosselItems.length; // lenght of the array
            const degress = 360 / length; // Grados por cada item
            const gap = 20; // Espacio entre cada item
            const tz = distanceZ(carrosselProps.w, length, gap);

            const fov = calculateFov(carrosselProps);
            const height = calculateHeight(tz);

            container.style.width = tz * 2 + gap * length + "px";
            container.style.height = height + "px";

            carrosselItems.forEach((item, i) => {
                const degressByItem = degress * i + "deg";
                item.style.setProperty("--rotatey", degressByItem);
                item.style.setProperty("--tz", tz + "px");
            });
        };

        // Funcion que da suavidad a la animacion
        const lerp = (a, b, n) => {
            return n * (a - b) + b;
        };

        // https://3dtransforms.desandro.com/carousel
        const distanceZ = (widthElement, length, gap) => {
            return widthElement / 2 / Math.tan(Math.PI / length) + gap; // Distancia Z de los items
        };

        // Calcula el alto del contenedor usando el campo de vision y la distancia de la perspectiva
        const calculateHeight = (z) => {
            const t = Math.atan((90 * Math.PI) / 180 / 2);
            const height = t * 2 * z;

            return height;
        };

        // Calcula el campo de vision del carrossel
        const calculateFov = (carrosselProps) => {
            const perspective = window
                .getComputedStyle(containercarrossel)
                .perspective.split("px")[0];

            const length =
                Math.sqrt(carrosselProps.w * carrosselProps.w) +
                Math.sqrt(carrosselProps.h * carrosselProps.h);
            const fov = 2 * Math.atan(length / (2 * perspective)) * (180 / Math.PI);
            return fov;
        };

        // Obtiene la posicion X y evalua si la posicion es derecha o izquierda
        const getPosX = (x) => {
            currentMousePos = x;

            moveTo = currentMousePos < lastMousePos ? moveTo - 2 : moveTo + 2;

            lastMousePos = currentMousePos;
        };

        const update = () => {
            lastMoveTo = lerp(moveTo, lastMoveTo, 0.05);
            carrossel.style.setProperty("--rotatey", lastMoveTo + "deg");

            requestAnimationFrame(update);
        };

        const onResize = () => {
            // Obtiene la propiedades del tamaño de carrossel
            const boundingcarrossel = containercarrossel.getBoundingClientRect();

            const carrosselProps = {
                w: boundingcarrossel.width,
                h: boundingcarrossel.height,
            };

            return carrosselProps;
        };

        const initEvents = () => {
            // Eventos del mouse
            carrossel.addEventListener("mousedown", () => {
                isMouseDown = true;
                carrossel.style.cursor = "grabbing";
            });
            carrossel.addEventListener("mouseup", () => {
                isMouseDown = false;
                carrossel.style.cursor = "grab";
            });
            container.addEventListener("mouseleave", () => (isMouseDown = false));

            carrossel.addEventListener(
                "mousemove",
                (e) => isMouseDown && getPosX(e.clientX)
            );

            // Eventos del touch
            carrossel.addEventListener("touchstart", () => {
                isMouseDown = true;
                carrossel.style.cursor = "grabbing";
            });
            carrossel.addEventListener("touchend", () => {
                isMouseDown = false;
                carrossel.style.cursor = "grab";
            });
            container.addEventListener(
                "touchmove",
                (e) => isMouseDown && getPosX(e.touches[0].clientX)
            );

            window.addEventListener("resize", createcarrossel);

            update();
            createcarrossel();
        };

        initEvents();

    });
});