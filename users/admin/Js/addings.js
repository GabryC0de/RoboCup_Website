// Codice da sistemare:

//      aggiungere funzione per caricare immagini
//      modulare il codice
//      aggiungere ReGex per gli input

import { add } from "./jsonInteractions.js";

document.addEventListener('DOMContentLoaded', function () {

    // Get the form element
    const form = document.querySelector('#form_1');
    const formsContainer = document.querySelector('.nav-wrap-left');

    // Add an event listener to handle form submission
    // first form submit
    // -----------------------------------------------------------------------------------------------------------------------------------------
    form.addEventListener('submit', (event) => {

        // Prevent the form from submitting the traditional way
        event.preventDefault();

        // Get the form data
        const formData = new FormData(form);

        // Extract the values
        const year = formData.get('year');
        const squadsAmount = formData.get('teams');

        // delete the previous form (the year and teams amount one)
        form.innerHTML = '';
        form.remove();

        // creating the subform for the second part of the questions
        const subFormElement = document.createElement('form');
        subFormElement.id = 'sub-form';
        subFormElement.classList.add('form');
        subFormElement.classList.add('query-selectable-form');

        formsContainer.appendChild(subFormElement);

        for (let i = 0; i < squadsAmount; i++) {

            if (i == squadsAmount - 1) {
                subFormElement.innerHTML += `
                    <h3 class="formDescription">Team ${i + 1} Generalities:</h3>
                    <input type="text" placeholder="Team Name" autocomplete="off" class="inputs" name="teamName" required>
                    <input type="number" placeholder="Members Amount" autocomplete="off" class="inputs" name="membersNum" required>
                    <input type="submit" value="Next" class="add-btn">
                `;
            } else {
                const inputs = `
                <h3 class="formDescription">Team ${i + 1} Generalities:</h3>
                <input type="text" placeholder="Team Name" autocomplete="off" class="inputs" name="teamName" required>
                <input type="number" placeholder="Members Amount" autocomplete="off" class="inputs" name="membersNum" required>
                `;
                subFormElement.innerHTML += inputs;
            }
        }

        // Add an event listener to handle sub-form submission
        subFormElement.addEventListener('submit', (event) => {

            // Prevent the form from submitting the traditional way
            event.preventDefault();

            // Get the form data
            const subFormsData = new FormData(subFormElement);

            // Extract the values
            const teamsNames = subFormsData.getAll('teamName');
            const membersNum = subFormsData.getAll('membersNum');

            // delete the previous form (the query-selectable-form)
            subFormElement.innerHTML = '';
            subFormElement.remove();

            const lastForm = document.createElement('form');
            lastForm.classList.add("form");
            lastForm.classList.add("team-infos-form");
            lastForm.id = "sender";

            // loops around as many times as the previus teams number is
            for (let i = 0; i < squadsAmount; i++) {

                for (let j = 0; j < membersNum[i]; j++) {
                    const memberInfos = document.createElement('div');
                    memberInfos.innerHTML = `
                            <h3>Member ${j + 1} infos:</h3>
                            <input type="text" placeholder="Member Name" autocomplete="off" class="inputs" name="memberName_${i}" required>
                            <input type="text" placeholder="Member Roles" autocomplete="off" class="inputs" name="memberRoles_${i}" required>
                        `;
                    if (j == membersNum[i] - 1 && i == squadsAmount - 1) {
                        const submitButton = document.createElement('input');
                        submitButton.type = 'submit';
                        submitButton.value = 'Next';
                        submitButton.classList.add('add-btn');
                        memberInfos.appendChild(submitButton);
                    }
                    lastForm.appendChild(memberInfos);
                }
            }

            formsContainer.appendChild(lastForm);

            // Add an event listener to handle last-form submission
            lastForm.addEventListener('submit', (event) => {

                // Preventing the page from refreshing when submitting the forms
                event.preventDefault();

                // Getting the form data
                const teamsInfoDatas = new FormData(lastForm);

                // Create arrays to store members and roles by team
                const membersNamesByTeam = [];
                const membersRolesByTeam = [];

                // Loop over teams
                for (let i = 0; i < squadsAmount; i++) {
                    const teamMembers = teamsInfoDatas.getAll(`memberName_${i}`);
                    const teamRoles = teamsInfoDatas.getAll(`memberRoles_${i}`);
                    membersNamesByTeam.push(teamMembers);
                    membersRolesByTeam.push(teamRoles);
                }

                // Assuming teamsImgs and membersImgs are collected similarly or handled separately
                add(year, teamsNames, membersNamesByTeam, membersRolesByTeam, [], []);
            });
        });
    });
});