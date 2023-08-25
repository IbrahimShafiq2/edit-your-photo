document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const fileInput = container.querySelector('.file-input');
    const filterOptions = container.querySelectorAll('.filter button');
    const filterName = container.querySelector('.filter-info .name');
    const filterValue = container.querySelector('.filter-info .value');
    const filterSlider = container.querySelector('.slider input');
    const rotateOptions = container.querySelectorAll('.rotate button');
    const resetFilterBtn = container.querySelector('.reset-filter');
    const previewImg = container.querySelector('.preview-img img');
    const chooseImgBtn = container.querySelector('.choose-img');
    const saveImgBtn = container.querySelector('.save-img');
    const widthInput = container.querySelector('.widthBox input');
    const heightInput = container.querySelector('.heightBox input');
    const qualiyInput = container.querySelector('.quality input');
    const ratioInput = container.querySelector('.ratio input');
    
    let brightness = 100,
        saturation = 100,
        inversion = 0,
        grayScale = 0,
        sebia = 0,
        opacity = 100,
        contrast = 100,
        bluur = 0;
    
    let rotate = 0, 
        flipHorizontal = 1, 
        flipVertical = 1;
    
    let imgRatio;
    
    const applyFilter = () => {
        previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
        previewImg.style.filter = `brightness(${brightness}%)
                                saturate(${saturation}%)
                                invert(${inversion}%)
                                grayscale(${grayScale}%)
                                sepia(${sebia}%)
                                opacity(${opacity}%)
                                contrast(${contrast}%)
                                blur(${bluur}px)`;
    };
    
    const loadImg = () => {
        const file = fileInput.files[0];
        if (!file) return;
        previewImg.src = URL.createObjectURL(file);
        previewImg.addEventListener('load', () => {
            widthInput.value = previewImg.naturalWidth;
            heightInput.value = previewImg.naturalHeight;
            widthInput.nextElementSibling.classList.add('spanActive');
            heightInput.nextElementSibling.classList.add('spanActive');
            imgRatio = previewImg.naturalWidth / previewImg.naturalHeight;
            resetFilterBtn.click();
            container.classList.remove('disable');
        });
    };
    
    filterOptions.forEach(option => {
        option.addEventListener('click', () => {
            container.querySelector('.filter .active').classList.remove('active');
            option.classList.add('active');
            filterName.innerText = option.innerText;
    
            const optionValues = {
                brightness: 200,
                saturation: 200,
                inversion: 100,
                grayScale: 100,
                sebia: 100,
                opacity: 100,
                contrast: 200,
                blur: 100
            };
    
            filterSlider.max = optionValues[option.id];
            filterSlider.value = eval(option.id);
            filterValue.innerText = `${filterSlider.value}${option.id === 'blur' ? 'px' : '%'}`;
        });
    });
    
    const updateFilter = () => {
        filterValue.innerText = `${filterSlider.value}${filterSlider.id === 'blur' ? 'px' : '%'}`;
        const selectedFilter = container.querySelector('.filter .active');
    
        eval(`${selectedFilter.id} = filterSlider.value`);
    
        applyFilter();
    };
    
    rotateOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option.id === 'left') {
                rotate -= 90;
            } else if (option.id === 'right') {
                rotate += 90;
            } else if (option.id === 'vertical') {
                flipHorizontal = -flipHorizontal;
            } else {
                flipVertical = -flipVertical;
            }
    
            applyFilter();
        });
    });
    
    const resetFilter = () => {
        brightness = 100;
        saturation = 100;
        inversion = 0;
        grayScale = 0;
        sebia = 0;
        opacity = 100;
        contrast = 100;
        bluur = 0;
    
        rotate = 0; 
        flipHorizontal = 1; 
        flipVertical = 1;
    
        filterOptions[0].click();
    
        applyFilter();
    };
    
    const saveImg = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = widthInput.value;
        canvas.height = heightInput.value;
        ctx.filter = `brightness(${brightness}%)
                        saturate(${saturation}%)
                        invert(${inversion}%)
                        grayscale(${grayScale}%)
                        sepia(${sebia}%)
                        opacity(${opacity}%)
                        contrast(${contrast}%)
                        blur(${bluur}px)`;
    
        const imgQuality = qualiyInput.checked ? 0.7 : 1.0;
    
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotate !== 0) {
            ctx.rotate(rotate * Math.PI / 180);
        }
        ctx.scale(flipHorizontal, flipVertical);
        ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image.jpg", imgQuality);
        link.download = `${new Date().getTime()}.jpg`;
        link.click();
    };
    
    fileInput.addEventListener('change', loadImg);
    filterSlider.addEventListener('input', updateFilter);
    resetFilterBtn.addEventListener('click', resetFilter);
    saveImgBtn.addEventListener('click', saveImg);
    chooseImgBtn.addEventListener('click', () => fileInput.click());
});
