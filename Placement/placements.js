document.addEventListener('DOMContentLoaded', () => {
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const labels = document.querySelectorAll('label');

    radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', (event) => {
            const checkedRadioButton = event.target;
            // console.log(`Radio ${checkedRadioButton.id} checked`);

            // Remove background image from all labels
            labels.forEach((label) => {
                label.style.backgroundImage = '';
                label.style.backgroundColor = 'transparent';
            });

            // Set background image for the corresponding label
            const correspondingLabel = labels[index];
            correspondingLabel.style.backgroundImage = 'url("ROBOCUP_2023.jpg")';
            correspondingLabel.style.backgroundSize = 'cover';
            correspondingLabel.style.backgroundRepeat = 'no-repeat';
            correspondingLabel.style.backgroundColor = 'transparent';
        });
    });
});