import { partialAdd, show } from "./jsonInteractions.js";

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#form-1-center');

    const dropdownYears = document.createElement('select');
    dropdownYears.id = "dropdown-years-center";
    dropdownYears.name = "target-year";
    dropdownYears.className = 'inputs';
    dropdownYears.setAttribute('required', '');

    const inputTeamMembers = document.createElement('input');
    inputTeamMembers.id = "team-members";
    inputTeamMembers.name = "members-num";
    inputTeamMembers.className = 'inputs';
    inputTeamMembers.type = 'number';
    inputTeamMembers.setAttribute('required', '');

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Next';
    submitButton.className = 'add-btn';

    const form2 = document.createElement('form');
    form2.id = "form-2-center";
    form2.className = 'forms';

    form.appendChild(dropdownYears);
    form.appendChild(submitButton);

    // production
    fetch('/api/data')
    // developement
    // fetch('http://127.0.0.1:3000/api/data')
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

                const targetYear = inputYear.get('target-year');
                console.log(targetYear);

                form.innerHTML = '';
                form.remove();

                const navCenter = document.querySelector('.nav-wrap-center');
                const formsContainer = navCenter.querySelector('.forms');

                formsContainer.appendChild(form2);

                const question2 = document.createElement('h3');
                question2.innerText = "How many members?";
                form2.appendChild(question2);
                form2.appendChild(inputTeamMembers);
                form2.appendChild(submitButton);

                form2.addEventListener('submit', (event) => {

                    event.preventDefault();

                    // getting the previous input data
                    const membersNumForm = new FormData(form2);

                    const membersNum = membersNumForm.get('members-num');

                    const form3 = document.createElement('form');
                    form3.id = 'form-3-center';
                    form3.className = 'forms';

                    form2.innerHTML = '';
                    form2.remove();

                    formsContainer.appendChild(form3);

                    for (let i = 0; i < membersNum; i++) {
                        if (i == 0) {
                            const teamNameInput = `
                                <h3>Team name:</h3>
                                <input type="text" placeholder="Team Name" autocomplete="off" class="inputs" name="teamName" required>
                            `;
                            form3.innerHTML += teamNameInput;
                        }
                        const member = `
                            <h3>Member ${i + 1} infos:</h3>
                            <input type="text" placeholder="Member Name" autocomplete="off" class="inputs" name="memberName" required>
                            <input type="text" placeholder="Member Roles" autocomplete="off" class="inputs" name="memberRoles" required>
                        `
                        form3.innerHTML += member;
                        if (i == membersNum - 1) {
                            form3.appendChild(submitButton);
                        }
                    }
                    form3.addEventListener('submit', (event) => {

                        // Preventing the page from refreshing when submitting the forms
                        event.preventDefault();

                        // Getting the form data
                        const membersInfos = new FormData(form3);

                        const teamMembers = membersInfos.getAll(`memberName`);
                        const membersRoles = membersInfos.getAll(`memberRoles`);
                        const teamName = membersInfos.get(`teamName`);

                        console.log(teamMembers);
                        console.log(membersRoles);

                        partialAdd(targetYear, teamName, teamMembers, membersRoles, [], []);
                        show();
                    })
                });
            });
        })
        .catch(error => {
            console.error("Error: " + error);
        });
});