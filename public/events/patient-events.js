// File for handing event listeners for Patient dashboard

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('test').addEventListener('click', async () => {
        const res = await axios.get('rs');
        const data = res.json();
        console.log(data)
    });
});
