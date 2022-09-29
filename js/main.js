/*-------START: JSON Fetch Implementation-------*/

const getContent = async function (url) { // Function to fetch JSON data, return promise
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

/*-------END: JSON Fetch Implementation-------*/

/*-------START: Employee Data Listing Implementation-------*/

const empDataFetch = getContent('json/empdata.json')
    .then((data) => { // Fetch employee data and store in empData as localstorage
        localStorage.setItem('empData', JSON.stringify(data));
    });

const skillListFetch = getContent('json/skill.json')
    .then((data) => { // Fetch skill data and store in empData as localstorage
        localStorage.setItem('skillData', JSON.stringify(data));
    });

Promise.all([empDataFetch, skillListFetch])
    .then((data) => {
        listEmpDetail();
        fillSkillDropdown();
    });

const getSkillNamesFromId = function (empObj) { // Function returns skillNames for given empObj
    const skillData = JSON.parse(localStorage.getItem('skillData'));
    return empObj.empSkill.map((skillIdentifier) => { // Return array with employee skill
        for (let skillObj of skillData) {
            if (skillObj.skillId == skillIdentifier) {
                return skillObj.skillName;
            }
        }
    }).join(', ');
}

const listEmpDetail = function () { // Handle listing of employee in HTML
    const appendEmpData = document.getElementById('list-employee');
    const removePlaceholderImage = appendEmpData.querySelector('#placeholder-image');

    const empData = JSON.parse(localStorage.getItem('empData'));

    removePlaceholderImage.style.display = 'none';

    for (let empObj of empData) {
        let displayEmp = document.createElement('ul');

        let empSkillList = getSkillNamesFromId(empObj);

        displayEmp.setAttribute('class', 'flex-box table-data');
        displayEmp.setAttribute('id', `${empObj.empId}`)
        displayEmp.innerHTML = `
        <li class="position-id" onclick="addUpdateModal(false, ${empObj.empId})">${empObj.empId}</li>
        <li class="position-name" onclick="addUpdateModal(false, ${empObj.empId})">${empObj.empName}</li>
        <li class="position-skill" onclick="addUpdateModal(false, ${empObj.empId})">${empSkillList}</li>
        <li class="position-operation" onclick="confirmdeleteOperation(this)"><img src="images/remove-employee.png" alt="Delete row of table"></li>
        `;

        appendEmpData.appendChild(displayEmp);
    }
}

/*-------END: Employee Data Listing Implementation-------*/

/*-------START: Update Form Function Implementation-------*/

const fillUpdateClearForm = function (isClear, empId) { // Function fills or clear data in modal
    const empForm = document.getElementById('addUpdate-emp');
    const empName = empForm.querySelector('#emp-name');
    const empMail = empForm.querySelector('#emp-email');
    const empDesignation = empForm.querySelector('#emp-designation');
    const empDob = empForm.querySelector('#emp-dob');
    const empSkill = empForm.querySelector('#emp-skill');

    const empData = JSON.parse(localStorage.getItem('empData'));
    const reqEmpObj = empData.find(empObj => {
        if (empObj.empId == empId) {
            return empObj;
        }
    });

    empName.value = (isClear) ? '' : `${reqEmpObj.empName}`;
    empMail.value = (isClear) ? '' : `${reqEmpObj.empEmail}`;
    empDesignation.value = (isClear) ? '' : `${reqEmpObj.empDesignation}`;
    empDob.value = (isClear) ? '' : `${reqEmpObj.empDob}`;
    empSkill.value = (isClear) ? '' : `${getSkillNamesFromId(reqEmpObj)}`;
}

/*-------END: Update Form Function Implementation-------*/

/*-------START: Dropdown, Modal Display and Hide Implementation-------*/

const toggleDropdown = function (element) { // Function to show/hide dropdown and change arrow direction
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

const fillSkillDropdown = function () { // Fill skill dropdown with data
    const skillData = JSON.parse(localStorage.getItem('skillData'));
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

const addUpdateModal = function (isAdd, empId) { // Handle modal on update or add operation
    const modalBackground = document.getElementById('modal-background');
    const modalContent = modalBackground.querySelector('#addUpdate-emp');
    const modalHeading = modalContent.querySelector('#modal-heading');
    const modalDropdown = modalContent.querySelector('.dropdown-element');
    const formSubmit = modalContent.querySelector('#form-submit');
    const formCancel = modalContent.querySelector('#form-cancel');

    modalHeading.innerText = (isAdd) ? 'Add Employee Details' : 'Update Employee Details';
    formSubmit.value = (isAdd) ? 'SAVE' : 'UPDATE';

    modalBackground.classList.remove('display-none');
    modalContent.classList.remove('display-none');

    formCancel.onclick = () => {
        modalContent.classList.add('display-none');
        modalBackground.classList.add('display-none');
        if (!modalDropdown.querySelector('.display-none')) {
            toggleDropdown(modalDropdown);
        }

        if (!isAdd) {
            fillUpdateClearForm(true);
        }
    }

    if (!isAdd) {
        fillUpdateClearForm(false, empId);
        formSubmit.onclick = () => {
            if (validateInput()) {
                generateUpdateEmpObj(false, empId);
                modalContent.classList.add('display-none');
                modalBackground.classList.add('display-none');
            }
        }
    }
    else {
        formSubmit.onclick = () => {
            if (validateInput()) {
                generateUpdateEmpObj(true);
                modalContent.classList.add('display-none');
                modalBackground.classList.add('display-none');
                fillUpdateClearForm(true);
            }
        }
    }
}

const confirmdeleteOperation = function (empDeleteIcon) { // Handle confirm delete option modal
    const modalBackground = document.getElementById('modal-background');
    const modalContent = modalBackground.querySelector('#confirmDelete-emp');
    const cancelDelete = modalContent.querySelector('#cancel-delete');
    const confirmDelete = modalContent.querySelector('#confirm-delete');

    modalBackground.classList.remove('display-none');
    modalContent.classList.replace('display-none', 'flex-box');

    cancelDelete.onclick = () => {
        modalContent.classList.replace('flex-box', 'display-none');
        modalBackground.classList.add('display-none');
    }

    confirmDelete.onclick = () => {
        removeEmpDetail(false, empDeleteIcon);
        modalContent.classList.replace('flex-box', 'display-none');
        modalBackground.classList.add('display-none');
    }
}

/*-------END: Dropdown, Modal Display and Hide Implementation-------*/

/*-------START: Add, Update, Delete Employee Implementation-------*/

const generateUpdateEmpObj = function (createNew, empId) { // Function updates/create employee data into object
    const empData = JSON.parse(localStorage.getItem('empData'));
    const empName = document.querySelector('#emp-name').value;
    const empMail = document.querySelector('#emp-email').value;
    const empDesignation = document.querySelector('#emp-designation').value;
    const empDob = document.querySelector('#emp-dob').value;
    const empSkill = document.querySelector('#emp-skill').value.split(', ');

    if (createNew) {
        const empId = empData[empData.length - 1].empId + 1;


        const newEmpObj = {
            empId,
            empName,
            empMail,
            empDesignation,
            empDob,
            empSkill
        };
    
        empData.push(newEmpObj);
        localStorage.setItem('empData', JSON.stringify(empData));
    }
    else {
        const reqEmpObj = empData.find(empObj => {
            if (empObj.empId == empId) {
                return empObj;
            }
        });

        reqEmpObj.empName = empName;
        reqEmpObj.empEmail = empMail;
        reqEmpObj.empDesignation = empDesignation;
        reqEmpObj.empDob = empDob;
        reqEmpObj.empSkill = empSkill;

        console.log(reqEmpObj);

        localStorage.setItem('empData', JSON.stringify(empData));
    }

    removeEmpDetail(true);
    listEmpDetail();
}

const removeEmpDetail = function (removeAll, deleteEmpList) { // Function remove all/individual employee data and set placeholder image
    if (removeAll) {
    const entireTable = document.getElementById('list-employee');

    entireTable.querySelectorAll('.table-data').forEach(empRow => empRow.remove());

    entireTable.querySelector('#placeholder-image').style.display = 'block';
    }
    else {
        const empData = JSON.parse(localStorage.getItem('empData'));
        const deleteParent = deleteEmpList.parentNode;
        const empId = deleteParent.id;
        deleteParent.remove();

        const reqData = empData.filter(empObj => empObj.empId != empId);

        localStorage.setItem('empData', JSON.stringify(reqData));
    }
}

const validateInput = function () { // Basic validation of data
    const empName = document.querySelector('#emp-name').value;
    const empMail = document.querySelector('#emp-email').value;

    return (
        ( empName != '' ) &&
        ( empMail != '' )
    )? true : false;
}

/*-------END: Add, Update, Delete Employee Implementation-------*/