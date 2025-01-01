document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const preview = document.getElementById('preview');
    const settings = document.getElementById('settings');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const maintainRatio = document.getElementById('maintainRatio');
    const resizeBtn = document.getElementById('resize');
    const downloadBtn = document.getElementById('download');

    let originalImage = null;
    let aspectRatio = 1;

    // 处理拖放
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2ecc71';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#3498db';
        handleFile(e.dataTransfer.files[0]);
    });

    // 点击上传
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
    });

    // 处理图片文件
    function handleFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择有效的图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                preview.src = img.src;
                aspectRatio = img.width / img.height;
                widthInput.value = img.width;
                heightInput.value = img.height;
                settings.style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 维持宽高比
    widthInput.addEventListener('input', () => {
        if (maintainRatio.checked) {
            heightInput.value = Math.round(widthInput.value / aspectRatio);
        }
    });

    heightInput.addEventListener('input', () => {
        if (maintainRatio.checked) {
            widthInput.value = Math.round(heightInput.value * aspectRatio);
        }
    });

    // 调整大小
    resizeBtn.addEventListener('click', () => {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = parseInt(widthInput.value);
        canvas.height = parseInt(heightInput.value);
        
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
        preview.src = canvas.toDataURL();
    });

    // 下载图片
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'resized-image.png';
        link.href = preview.src;
        link.click();
    });
}); 