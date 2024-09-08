import { show, erase } from './jsonInteractions.js'

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#form-1-right');
    const dropdownYears = document.createElement('select');
    dropdownYears.id = "dropdown-years";
    dropdownYears.name = "delete-team-year";
    dropdownYears.className = 'inputs';
    dropdownYears.setAttribute('required', '');

    const dropdownTeams = document.createElement('select');
    dropdownTeams.id = "dropdown-year-teams";
    dropdownTeams.name = "team-to-delete";
    dropdownTeams.className = 'inputs';
    dropdownTeams.setAttribute('required', '');

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Send';
    submitButton.className = 'add-btn';

    const form2 = document.createElement('form');
    form2.id = "form-2-right";
    form2.className = 'forms';


    form.appendChild(dropdownYears);
    // form.appendChild(dropdownTeams);
    form.appendChild(submitButton);


    fetch('../../Node/prova.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {

            const years = [];

            data.years.forEach(yearObject => {
                const year = yearObject.yearTeams[0].year;
                if (!years.includes(year)) {
                    years.push(year);
                }
            });

            years.forEach(year => {
                const yearOption = document.createElement('option');
                yearOption.className = 'options'; // corrected property name
                yearOption.value = year; // set the value attribute
                yearOption.innerText = year;
                dropdownYears.appendChild(yearOption);
            });

            form.addEventListener('submit', (event) => {
                event.preventDefault();

                // getting the previous input data
                const inputYear = new FormData(form);

                const targetYear = inputYear.get('delete-team-year');
                // console.log(targetYear);


                // changing the input
                form.innerHTML = '';
                form.remove();

                const navRight = document.querySelector('.nav-wrap-right');
                const formsContainer = navRight.querySelector('.forms');

                formsContainer.appendChild(form2);
                
                const question2 = document.createElement('h3');
                question2.innerText = "Whats the team name?";
                form2.appendChild(question2);
                form2.appendChild(dropdownTeams);
                form2.appendChild(submitButton);

                let teamNames = [];

                data.years.forEach((yearObject) => {
                    const year = yearObject.yearTeams[0].year;
                    if (year == targetYear) {
                        yearObject.yearTeams.forEach((yearTeam, index) => {
                            teamNames.push(yearObject.yearTeams[index].teamName);
                        });
                    }
                });

                // console.log(targetYear + ' teams: ' + teamNames);
                teamNames.forEach(teamName => {
                    const teamOption = document.createElement('option');
                    teamOption.className = 'options'; // corrected property name
                    teamOption.value = teamName; // set the value attribute
                    teamOption.innerText = teamName;
                    dropdownTeams.appendChild(teamOption);
                });
                form2.addEventListener('submit', (event) => {
                    event.preventDefault();


                    const targetTeamForm = new FormData(form2);
                    const targetTeam = targetTeamForm.get('team-to-delete');

                    // console.log(targetTeam);
                    erase(targetYear, targetTeam);
                    show();

                });
            });
        })
        .catch(error => {
            console.error("Error: " + error);
        });
});