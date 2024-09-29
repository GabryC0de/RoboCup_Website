document.addEventListener('DOMContentLoaded', () => {
    const jsonData = async () => {
        // production
        const response = await fetch('/api/data');
        // developement
        // const response = await fetch('http://127.0.0.1:3000/api/data');
        const data = await response.json();
        return data[0];
    };

    jsonData().then((data) => {
        const strYear = localStorage.getItem('selectedYear');
        const year = parseInt(strYear);
        // const generalContainer = document.querySelector('.container');
        for (let i = 0; i < data.years.length; i++) {
            let yearTeamsJson = data.years[i].yearTeams;
            let IdIncreaser = 1;
            yearTeamsJson.forEach((team, index) => {

                // if the year in the json matches the year retrieved from the click the start building the html
                if (team.year === year) {

                    const container = document.querySelector('.container'); // assume you have a container element with id "teams-container"



                    let id_and_for = "c" + IdIncreaser.toString();

                    let members = team.members;
                    let descriptionText = "";

                    // preparing the content of the paragraph
                    members.forEach(member => {
                        descriptionText = descriptionText + member + ' ' + '/' + ' ';
                    });

                    const iconPNG = "https://cdn.iconscout.com/icon/free/png-256/free-people-1768021-1502195.png"

                    // generating the html
                    const html = `
                            <input type="radio" name="slide" id="${id_and_for}">
                            
                            <label for="${id_and_for}" class="card">
                            <div class="row">
                                <div class="icon">
                                <img src="${iconPNG}" class="picture"></div>
                                <div class="description">
                                <h4><a href="Team Details/aboutus.html" class="link">${team.teamName}</a></h4>
                                <p>${descriptionText}</p>
                                </div>
                            </div>
                            </label>
                        `;

                    const cssRule = `
                            .card[for="${id_and_for}"] {
                                background-image: url('${team.img}');
                            }`;

                    IdIncreaser += 1;
                    container.innerHTML += html;
                    document.styleSheets[0].insertRule(cssRule, document.styleSheets[0].cssRules.length);
                    console.log(index);
                }
            });
        }
        const clickedTeam = document.querySelectorAll('.link');
        clickedTeam.forEach((click) => {
            click.addEventListener('click', (event) => {
                const selectedTeam = event.target.textContent;
                localStorage.setItem('selectedTeam', selectedTeam);
            });
        });
    });
});