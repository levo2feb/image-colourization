document.getElementById('upload-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const res = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    const data = await res.json();
    const outputImg = document.getElementById('output-img');
    outputImg.src = data.output_url;
    outputImg.style.display = 'block';
});
