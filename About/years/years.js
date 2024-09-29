document.addEventListener('DOMContentLoaded', () => {

    // DOM Manipulation Begin
    const listWrapper = document.querySelector('.list-wrapper');
    const list = document.createElement('ul');
    list.className = 'list';
    listWrapper.appendChild(list);
    // production
    fetch('/api/data')
    // developement
    // fetch('http://127.0.0.1:3000/api/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        })
        .then(data => {
            console.log(data);
            const years = [];
            data[0].years.forEach(yearObject => {
                const year = yearObject.yearTeams[0].year;
                if (!years.includes(year)) {
                    years.push(year);
                }
            });
            years.forEach(year => {
                const listElement = `
                  <li class="list-element">
                    <a href="../teams/dynamicTeams.html" class="link" id="${year}">
                      <button type="button" class="buttons">
                        ${year} Teams
                      </button>
                    </a>
                  </li>
                `;
                const element = document.createElement('li');
                element.innerHTML = listElement;
                list.appendChild(element);

                const linkElement = element.querySelector('.link');
                linkElement.addEventListener('click', (event) => {
                    const clickedId = event.currentTarget.id;
                    localStorage.setItem('selectedYear', clickedId);
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});