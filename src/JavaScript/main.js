const PUBLIC_KEY = "S_6owil9zwQsCCSpW";   
const SERVICE_ID = "service_4hapbne";  
const TEMPLATE_ID = "template_nug8o2e"; 
const MY_SECRET_CODE = "1234";          


(function(){
    emailjs.init(PUBLIC_KEY);
})();

let darkModeIcon = document.querySelector('#darkmode-icon');

if(localStorage.getItem('theme') === 'dark'){
    document.body.classList.add('active-dark');
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
}

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('fa-sun');
    darkModeIcon.classList.toggle('fa-moon');
    document.body.classList.toggle('active-dark');
    
    if(document.body.classList.contains('active-dark')){
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
};

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

/* ==================== 3. TYPEWRITER EFFECT ==================== */
const textElement = document.querySelector(".typing-text");
const words = ["Front-End Developer", "UI/UX Designer", "Web Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
    const currentWord = words[wordIndex];
    textElement.textContent = currentWord.substring(0, charIndex);
    
    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 100);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, isDeleting ? 2000 : 500);
    }
}
document.addEventListener("DOMContentLoaded", typeEffect);

/* ==================== 4. PROJECT FILTER ==================== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            if(filterValue === 'all' || card.getAttribute('data-item') === filterValue) {
                card.classList.remove('hide');
                card.classList.add('show');
            } else {
                card.classList.remove('show');
                card.classList.add('hide');
            }
        });
    });
});

/* ==================== 5. EMAILJS APPLY FORM ==================== */
const applyForm = document.getElementById('apply-form');
const btnApply = document.getElementById('btn-apply');

if(applyForm) {
    applyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const secretInput = document.getElementById('secret-code').value;

        // Check mật khẩu
        if (secretInput !== MY_SECRET_CODE) {
            alert("❌ Sai mã bảo mật! Vui lòng nhập đúng mã để gửi.");
            return;
        }

        btnApply.innerText = 'Đang gửi...';
        btnApply.style.opacity = '0.7';

        // Lấy dữ liệu form
        const templateParams = {
            hr_email: this.hr_email.value,
            subject: this.subject.value,
            cv_link: this.cv_link.value,
            message: this.message.value
        };

        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
            .then(() => {
                btnApply.innerText = 'Gửi thành công! ✅';
                btnApply.style.background = '#2ecc71';
                alert(`Đã gửi mail ứng tuyển đến: ${this.hr_email.value}`);
                
                setTimeout(() => {
                    btnApply.innerText = 'Gửi CV Ngay';
                    btnApply.style.background = 'var(--text-color)';
                    btnApply.style.opacity = '1';
                    applyForm.reset();
                }, 3000);
            }, (err) => {
                btnApply.innerText = 'Lỗi!';
                btnApply.style.background = '#e74c3c';
                alert("Lỗi: " + JSON.stringify(err));
            });
    });
}