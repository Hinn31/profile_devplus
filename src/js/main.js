const PUBLIC_KEY = "suHbMmtH0y86FpcHF";
const SERVICE_ID = "service_tbq38wj";
const TEMPLATE_ID = "template_gplh6bv";
if (window.emailjs) {
    window.emailjs.init(PUBLIC_KEY);
}

const darkModeIcon = document.querySelector("#darkmode-icon");
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const textElement = document.querySelector(".typing-text");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const applyForm = document.getElementById("apply-form");
const btnApply = document.getElementById("btn-apply");

if (localStorage.getItem("theme") === "dark" && darkModeIcon) {
    document.body.classList.add("active-dark");
    darkModeIcon.classList.remove("fa-moon");
    darkModeIcon.classList.add("fa-sun");
}

if (darkModeIcon) {
    darkModeIcon.onclick = () => {
        darkModeIcon.classList.toggle("fa-sun");
        darkModeIcon.classList.toggle("fa-moon");
        document.body.classList.toggle("active-dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("active-dark") ? "dark" : "light"
        );
    };
}

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle("fa-times");
        navbar.classList.toggle("active");
    };
}

const words = ["QA Tester", "Software Tester", "Quality Analyst"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typeEffect = () => {
    if (!textElement) return;

    const currentWord = words[wordIndex];
    textElement.textContent = currentWord.substring(0, charIndex);

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex += 1;
        setTimeout(typeEffect, 100);
        return;
    }

    if (isDeleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeEffect, 50);
        return;
    }

    isDeleting = !isDeleting;
    if (!isDeleting) {
        wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(typeEffect, isDeleting ? 2000 : 500);
};

document.addEventListener("DOMContentLoaded", typeEffect);

if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelector(".filter-btn.active")?.classList.remove("active");
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            projectCards.forEach((card) => {
                const isVisible =
                    filterValue === "all" || card.getAttribute("data-item") === filterValue;

                card.classList.toggle("hide", !isVisible);
                card.classList.toggle("show", isVisible);
            });
        });
    });
}

const ensureStatusElement = () => {
    let statusElement = document.getElementById("apply-status");

    if (!statusElement && applyForm) {
        statusElement = document.createElement("p");
        statusElement.id = "apply-status";
        statusElement.className = "form-status";
        statusElement.setAttribute("aria-live", "polite");
        applyForm.appendChild(statusElement);
    }

    return statusElement;
};

const setApplyStatus = (message, type = "") => {
    const statusElement = ensureStatusElement();
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `form-status ${type}`.trim();
};

const setSubmitState = (isSubmitting) => {
    if (!btnApply) return;

    btnApply.disabled = isSubmitting;
    btnApply.style.opacity = isSubmitting ? "0.7" : "1";
    btnApply.innerHTML = isSubmitting
        ? 'Sending... <i class="fas fa-spinner fa-spin"></i>'
        : 'Send CV <i class="fas fa-paper-plane"></i>';
};

if (applyForm && btnApply) {
    const hrEmailInput = applyForm.querySelector('input[name="hr_email"]');
    const subjectInput = applyForm.querySelector('input[name="subject"]');
    const cvLinkInput = applyForm.querySelector('input[name="cv_link"]');
    const messageInput = applyForm.querySelector('textarea[name="message"]');
    const formHeading = applyForm.querySelector("h3");
    const formLabels = applyForm.querySelectorAll("label");
    const secretCodeInput = document.getElementById("secret-code");
    const secretCodeLabel = applyForm.querySelector('label[for="secret-code"]');

    if (formHeading) {
        formHeading.textContent = "Send Application";
    }

    if (formLabels[1]) {
        formLabels[1].textContent = "Subject";
    }

    if (formLabels[2]) {
        formLabels[2].textContent = "CV Link";
    }

    if (formLabels[3]) {
        formLabels[3].textContent = "Cover Letter";
    }

    btnApply.innerHTML = 'Send CV <i class="fas fa-paper-plane"></i>';
    messageInput.value =
        "Dear Hiring Manager, I am writing to apply for the QA Tester position. Please find my CV attached via the link above. I would appreciate the opportunity to discuss how I can contribute to your team.";

    if (secretCodeLabel) {
        secretCodeLabel.remove();
    }

    if (secretCodeInput) {
        secretCodeInput.remove();
    }

    applyForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const hrEmail = hrEmailInput?.value.trim() || "";
        const subject = subjectInput?.value.trim() || "";
        const cvLink = cvLinkInput?.value.trim() || "";
        const message = messageInput?.value.trim() || "";

        if (!hrEmail || !subject || !cvLink || !message) {
            setApplyStatus("Please complete all fields before sending your application.", "error");
            return;
        }

        if (!window.emailjs || typeof window.emailjs.send !== "function") {
            setApplyStatus("Email service is not available. Please check the EmailJS script.", "error");
            return;
        }

        setSubmitState(true);
        setApplyStatus("Sending your application...", "pending");

        const templateParams = {
            hr_email: hrEmail,
            to_email: hrEmail,
            subject,
            cv_link: cvLink,
            message,
            applicant_name: "Vo Thi Thu Hien",
            applicant_email: "hien.vo26@student.passerellesnumeriques.org",
            phone: "0876 068 001"
        };

        try {
            await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
            setApplyStatus(`Application sent successfully to ${hrEmail}.`, "success");
            applyForm.reset();
        } catch (error) {
            console.error("EmailJS send failed:", error);
            const errorDetails = [
                error?.status ? `status ${error.status}` : "",
                error?.text || error?.message || ""
            ]
                .filter(Boolean)
                .join(" - ");

            setApplyStatus(
                `Sending failed${errorDetails ? `: ${errorDetails}` : "."}`,
                "error"
            );
        } finally {
            setSubmitState(false);
        }
    });
}
