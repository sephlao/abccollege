console.log(`hello world`);

/**
 * listen to value change on employee type radio input
 */
document.querySelectorAll(`[name="employeeType"]`).forEach(el => {
    el.addEventListener(`change`, () => {
        document.getElementById(`qualificationCode`).classList.toggle(`show`);
        document.getElementById(`fixedSalary`).classList.toggle(`hide`);
    });
});

// set constants
const mastersHourlyRate = 175; //$ per hour
const bachelorsHourlyRate = 100;
const mastersAllowance = 1500; //teaching allowance $ per month
const bachelorsAllowance = 600;
const regularWorkHourLimit = 160; //limit of work hours a month

const form = document.getElementById(`payrollForm`);
form.addEventListener(`submit`, e => {
    e.preventDefault();
    const formData = new FormData(form);
    let data = {}; // form data container
    for (let [key, value] of formData.entries()) data[key] = value;
    
});