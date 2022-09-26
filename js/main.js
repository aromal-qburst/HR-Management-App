/*-------START: JSON Fetch Implementation-------*/

const getContent = async function (url) { // Function to fetch JSON data, return promise
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

/*-------END: JSON Fetch Implementation-------*/

/*-------START: Employee Data Listing Implementation-------*/

const empDataFetch = getContent('../json/empdata.json')
    .then((empData) => {
        const skillList = getContent('../json/skill.json')
            .then((skillData) => {
                listEmpDetail(empData, skillData);
                fillSkillDropdown(skillData);
            });
    });

const listEmpDetail = function (empData,skillData) { // Handle listing of employee in HTML
    const appendEmpData = document.getElementById('list-employee');
    
    for (let empObj of empData) {
        let displayEmp = document.createElement('ul');

        let empSkillList = empObj.empSkill.map((skillIdentifier) => { // Return array with employee skill
            for (let skillObj of skillData) {
                if (skillObj.skillId == skillIdentifier) {
                    return skillObj.skillName;
                }
            }
        });

        displayEmp.setAttribute('class', 'flex-box');
        displayEmp.innerHTML = `
        <li class="position-id" onclick="addUpdateModal(${empObj.empId}, false)">${empObj.empId}</li>
        <li class="position-name" onclick="addUpdateModal(${empObj.empId}, false)">${empObj.empName}</li>
        <li class="position-skill" onclick="addUpdateModal(${empObj.empId}, false)">${empSkillList.join(', ')}</li>
        <li class="position-operation" onclick="confirmdeleteOperation()"><img src="images/remove-employee.png" alt="Delete row of table"></li>
        `;

        appendEmpData.appendChild(displayEmp);
    }
}

/*-------END: Employee Data Listing Implementation-------*/

/*-------START: Update Form Function Implementation-------*/

const fillUpdateForm = function (empId) {
    const empForm = document.getElementById('addUpdate-emp');
    const empName = empForm.querySelector('#emp-name');
    const empMail = empForm.querySelector('#emp-email');
    const empDesignation = empForm.querySelector('#emp-designation');
    const empDob = empForm.querySelector('#emp-dob');
    const empSkill = empForm.querySelector('#emp-skill');

    
}

/*-------END: Update Form Function Implementation-------*/

/*-------START: Dropdown, Modal Display and Hide Implementation-------*/

const toggleDropdown = function (element) {
    const dropdownContent = element.querySelector('.dropdown-content');
    const arrowDirection = element.querySelector('img');
    
    if (dropdownContent.classList.contains('display-none')) {
        arrowDirection.src = 'images/up-arrow.svg';
        dropdownContent.classList.remove('display-none');
    }
    else {
        arrowDirection.src = 'images/down-arrow.svg';
        dropdownContent.classList.add('display-none');
    }
}

const fillSkillDropdown = function (skillData) {
    const skillDropdowns = document.getElementsByClassName('skill-dropdown-content');

    for (let dropdown of skillDropdowns) {
        let groupSkill = document.createElement('ul');
        for (let skillObj of skillData) {
            let individualSkill = document.createElement('li');
            individualSkill.innerHTML = `${skillObj.skillName}`;
            groupSkill.appendChild(individualSkill);
        }
        dropdown.appendChild(groupSkill);
    }
}

const addUpdateModal = function (empId, isAdd) {
    const modalBackground = document.getElementById('modal-background');
    const modalContent = modalBackground.querySelector('#addUpdate-emp');
    const modalHeading = modalContent.querySelector('#modal-heading');
    const modalDropdown = modalContent.querySelector('.dropdown-element');
    const formSubmit = modalContent.querySelector('#form-submit');
    const formCancel = modalContent.querySelector('#form-cancel');

    modalHeading.innerText = (isAdd)? 'Add Employee Details': 'Update Employee Details';
    formSubmit.value = (isAdd)? 'SAVE': 'UPDATE';

    // if (!isAdd) {
    //     fillUpdateForm(empId);
    // }

    modalBackground.classList.remove('display-none');
    modalContent.classList.remove('display-none');

    formCancel.onclick = () => {
        modalContent.classList.add('display-none');
        modalBackground.classList.add('display-none');
        if (!modalDropdown.querySelector('.display-none')){
            toggleDropdown(modalDropdown);
        }
    }
}

const confirmdeleteOperation = function () {
    const modalBackground = document.getElementById('modal-background');
    const modalContent = modalBackground.querySelector('#confirmDelete-emp');
    const cancelDelete = modalContent.querySelector('#cancel-delete');

    modalBackground.classList.remove('display-none');
    modalContent.classList.replace('display-none', 'flex-box');

    cancelDelete.onclick = () => {
        modalContent.classList.replace('flex-box', 'display-none');
        modalBackground.classList.add('display-none');
    }
}

/*-------END: Dropdown, Modal Display and Hide Implementation-------*/