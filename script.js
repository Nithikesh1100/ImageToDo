document.addEventListener("DOMContentLoaded", function () {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const MAX_IMAGES = 5;
    const MAX_SIZE_MB = 1; // Max size in megabytes
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // Max size in bytes
    let isHandlingClick = false;

    // Trigger file input when dropzone is clicked
    dropzone.addEventListener('click', () => {
        if (isHandlingClick) return;
        isHandlingClick = true;
        fileInput.click();
        setTimeout(() => isHandlingClick = false, 100);
    });

    // Prevent default behavior for drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });

    // Add visual feedback on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove('dragover');
        });
    });

    // Handle file drop
    dropzone.addEventListener('drop', (event) => {
        const files = event.dataTransfer.files;
        handleFiles(files);
    });

    // Handle file input change (when a file is selected via clicking)
    fileInput.addEventListener('change', () => {
        const files = fileInput.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > MAX_SIZE_BYTES) {
                alert(`The file ${files[i].name} is too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`);
                continue; // Skip this file
            }
            if (fileList.children.length >= MAX_IMAGES) {
                alert('Maximum allowed files reached (5 files)');
                break;
            }
            displayFile(files[i]);
        }
    }



    function displayFile(file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const div = document.createElement('div');
            div.className = 'file-name';

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name;
            img.className = 'thumbnail';
            div.appendChild(img);

            const desc = document.createElement('textarea');
            desc.placeholder = 'Enter description';  // Optionally add a placeholder
            desc.className = 'file-desc';  // Add a class for styling
            desc.rows = 2;
            desc.name = 'file-desc';
            desc.value = "";
            desc.addEventListener('change', (event) => {

                updateLocalStorage();

            })

            div.appendChild(desc);

            const icon = document.createElement('img');
            icon.src = 'delete.png';
            icon.className = 'icon';
            icon.addEventListener('click', () => {
                div.classList.add('removing');

                div.remove();
                updateLocalStorage(); // Update localStorage after removing file

            });
            div.appendChild(icon);

            // Append the file preview to the parent container
            fileList.appendChild(div);

            updateLocalStorage(); // Update localStorage after adding file

        };
        reader.readAsDataURL(file);
    }

    // Function to update localStorage with current file list data
    function updateLocalStorage() {
        const filesData = [];
        const fileNodes = fileList.querySelectorAll('.file-name');
        fileNodes.forEach(node => {
            const img = node.querySelector('.thumbnail');
            const desc = node.querySelector('.file-desc');
            // console.log(desc.value);
            filesData.push({
                src: img.src,
                name: img.alt,
                description: desc.value
            });

            // console.log(filesData[0]);
        });

        localStorage.setItem('storedImagesData', JSON.stringify(filesData));
    }



    // Function to load data from localStorage on page load
    function loadFromLocalStorage() {
        const storedImagesData = JSON.parse(localStorage.getItem('storedImagesData') || '[]');

        storedImagesData.forEach(data => {
            const div = document.createElement('div');
            div.className = 'file-name';

            const img = document.createElement('img');
            img.src = data.src;
            img.alt = data.name;
            img.className = 'thumbnail';
            div.appendChild(img);

            const desc = document.createElement('textarea');
            desc.value = data.description || ''; // Set description from localStorage
            desc.placeholder = 'Enter description';
            desc.className = 'file-desc';
            desc.rows = 2;
            div.appendChild(desc);

            const icon = document.createElement('img');
            icon.src = 'delete.png';
            icon.className = 'icon';
            icon.addEventListener('click', () => {
                div.classList.add('removing');

                div.remove();
                updateLocalStorage(); // Update localStorage after removing file

            });
            div.appendChild(icon);

            // Append the file preview to the parent container
            fileList.appendChild(div);
        });
    }

    loadFromLocalStorage();
});
