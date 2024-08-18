// gotta work on this mother fucking function
// or maybe on the admin.js data management
export function add(year, teamsNames, membersNamesByTeam, membersRolesByTeam, teamsImgs, membersImgs) {
    fetch('../../Node/prova.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let yearTeamsDict = { "yearTeams": [] };
            data.years.push(yearTeamsDict);

            teamsNames.forEach((team, index) => {
                let teamInfosDict = {
                    "year": year,
                    "teamName": team,
                    "members": membersNamesByTeam[index],
                    "membersRole": membersRolesByTeam[index],
                    "img": teamsImgs[index] || "",  // Assuming you're handling images
                    "membersImg": membersImgs[index] || []
                };
                data.years[data.years.length - 1].yearTeams.push(teamInfosDict);
            });

            const updatedJsonData = JSON.stringify(data, null, 2);

            return fetch('http://127.0.0.1:3000/save-json', {  // Update the URL to match server port
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: updatedJsonData
            });
        })
        .then(response => {
            if (response.ok) {
                console.log('JSON data saved successfully!');
            } else {
                console.error('Failed to save JSON data.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



export function erase(targetYear, targetTeam) {
    fetch('../../Node/prova.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            data.years.forEach((yearObject) => {
                const year = yearObject.yearTeams[0].year;
                if (year == targetYear) {
                    yearObject.yearTeams.forEach((yearTeam, index) => {
                        if (yearObject.yearTeams[index].teamName == targetTeam) {
                            yearObject.yearTeams.splice(index, 1);
                        };
                    });
                }
            });

            const updatedJsonData = JSON.stringify(data, null, 2);

            return fetch('http://127.0.0.1:3000/save-json', {  // Update the URL to match server port
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: updatedJsonData
            });
        })
        .then(response => {
            if (response.ok) {
                console.log('JSON data saved successfully!');
            } else {
                console.error('Failed to save JSON data.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function partialAdd(targetYear, teamName, teamMembers, membersRoles, teamImg, membersImgs) {
    fetch('../../Node/prova.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        })
        .then(data => {
            let newTeam = {
                "year": targetYear,
                "teamName": teamName,
                "members": teamMembers,
                "membersRole": membersRoles,
                "img": teamImg,  // Assuming you're handling images
                "membersImg": membersImgs
            };
            data.years.forEach((yearObject) => {
                const year = yearObject.yearTeams[0].year;
                if (year == targetYear) {

                    yearObject.yearTeams.push(newTeam);

                }
            });

            const updatedJsonData = JSON.stringify(data, null, 2);

            return fetch('http://127.0.0.1:3000/save-json', {  // Update the URL to match server port
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: updatedJsonData
            });
        })
        .then(response => {
            if (response.ok) {
                console.log('JSON data saved successfully!');
            } else {
                console.error('Failed to save JSON data.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function show() {
    fetch('../../Node/prova.json')
        .then(response => response.json())
        .then(data => {
            console.log(data.years)
        });
}