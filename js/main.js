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
const getSurchargeFee = salary => (salary > 3000) ? 33 : 19.20;
const getCIT = salary => (salary - 2500) * 0.25; // 25% canadian income tax
const getDeductions = salary => ({
    surcharge: getSurchargeFee(salary), // health surcharge fee
    cit: salary > 2500 ? getCIT(salary) : 0 // canadian income tax
});
const getNetIncome = (s, d) => s - (d.surcharge + d.cit);

const form = document.getElementById(`payrollForm`);
form.addEventListener(`submit`, e => {
    e.preventDefault();
    const formData = new FormData(form);
    let data = {}; // form data container
    for (let [key, value] of formData.entries()) data[key] = value;

    if (data.employeeType == 'r') calculateForRegularEmployee({ ...data });
    else calculateForFacultyEmployee({ ...data })
});

/**
 * calculate payroll for regular employee
 * @param {{}} data 
 */
function calculateForRegularEmployee(data) {
    const hourlyRate = data.fixedSalary / regularWorkHourLimit;
    const excessHours = data.hoursOfWork - regularWorkHourLimit;
    let grossSalary = hourlyRate * data.hoursOfWork;
    if (excessHours > 0) grossSalary += (excessHours * 2) * hourlyRate; // double time pay

    doNetCalculationAndPrint(data, grossSalary);
}

/**
 * calculate payroll for faculty employee
 * @param {{}} data 
 */
function calculateForFacultyEmployee(data) {
    // gross salary by qualification
    let grossSalary = data.hoursOfWork * (data.qualification == 'm' ? mastersHourlyRate : bachelorsHourlyRate);
    // add teaching allowance
    grossSalary += data.qualification == 'm' ? mastersAllowance : bachelorsAllowance;
    doNetCalculationAndPrint(data, grossSalary);
}

/**
 * calculates net income and deductions then calls renderer to print
 * @param {number} gross 
 */
function doNetCalculationAndPrint(employeeData, gross) {
    const deductions = getDeductions(gross);
    const net = getNetIncome(gross, deductions);
    renderPaystab({ ...employeeData, gross, net, deductions });
}

/**
 * takes employee data with salary information and prints it to the html page
 * @param {{}} data 
 */
function renderPaystab(data) {
    const appendQualification = q => (q == 'f') ? `<li>Qualification: ${data.qualification == 'm' ? 'Masters' : 'Bachelors'}</li>` : '';
    const htmlTemplate = `
    <ul>
        <li>Employee Number: ${data.number}</li>
        <li>Name: ${data.name}</li>
        <li>Department: ${data.department}</li>
        <li>Employee Type: ${data.employeeType == 'r' ? 'Regular' : 'Faculty'}</li>
        ${appendQualification(data.employeeType)}
        <li>Hours of Work this Month: ${data.hoursOfWork}</li>
        <li>Gross Salary: $${data.gross.toFixed(2)}</li>
        <li>
            Deductions:
            <ul>
                <li>Health Surcharge Fee: $${data.deductions.surcharge.toFixed(2)}</li>
                <li>CIT (25% of gross): $${data.deductions.cit.toFixed(2)}</li>
            </ul>
        </li>
        <li>Net Income: <strong>$${data.net.toFixed(2)}</strong></li>
    </ul>`;

    document.getElementById(`output`).innerHTML = htmlTemplate;
}