async function getRoute(type) {
    const fromBank = document.getElementById('fromBank').value;
    const toBank = document.getElementById('toBank').value;
    const resultDiv = document.getElementById('result');

    if (!fromBank || !toBank) {
        resultDiv.innerHTML = '<div class="error">Please fill both BIC fields</div>';
        return;
    }

    try {
        const response = await fetch(`/api/${type === 'fastest' ? 'fastestroute' : 'cheapestroute'}?fromBank=${fromBank}&toBank=${toBank}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<div class="error">${data.error}</div>`;
        } else {
            resultDiv.innerHTML = `
                <h3>${type === 'fastest' ? 'Fastest' : 'Cheapest'} Route:</h3>
                <p><strong>Path:</strong> ${data.route}</p>
                <p><strong>${type === 'fastest' ? 'Time' : 'Cost'}:</strong> ${data[type === 'fastest' ? 'time' : 'cost']}</p>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = '<div class="error">An error occurred. Please try again.</div>';
    }
}