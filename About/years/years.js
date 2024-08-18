document.addEventListener('DOMContentLoaded', () => {

    const elements = document.querySelectorAll('.link');
    elements.forEach(element => {
        element.addEventListener('click', (event) => {
            const clickedId = event.currentTarget.id;
            localStorage.setItem('selectedYear', clickedId);
        });
    });


    // DOM Manipulation Begin
    const listWrapper = document.querySelector('.list-wrapper');
    const list = document.createElement('ul');
    list.className = 'list';

    listWrapper.appendChild(list);

    fetch('../../users/Node/prova.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
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
                const listElement = `
                    <li class="list-element">
                        <a href="../teams/dynamicTeams.html" class="link">
                            <button type="button" class="buttons">
                                ${year} Teams
                            </button>
                        </a>
                    </li>
                    `;
                list.innerHTML += listElement;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});