/*-------START: JSON Fetch Implementation-------*/

const getContent = async function (url) { // Function to fetch JSON data, return promise
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

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
    .then((data) => { // Ensure function call only after given promise is achieved
        listEmpDetail();
        fillSkillDropdown();
    });

const listEmpDetail = function (filtered = false) { // Handle listing of employee in HTML
    const appendEmpData = document.getElementById('list-employee');
    const removePlaceholderImage = appendEmpData.querySelector('#placeholder-image');
    const filterDropdownText = document.getElementById('skill-dropdown').querySelector('span');

    const empData = (filtered) ? JSON.parse(localStorage.getItem('empFilterData')) : JSON.parse(localStorage.getItem('empData'));
    if (!filtered) {
        filterDropdownText.innerText = 'Skill Search';
    }

    removePlaceholderImage.style.display = 'none';

    for (let empObj of empData) {
        let displayEmp = document.createElement('ul');

        let empSkillList = getSkillNamesFromId(empObj.empSkill);

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
};

const generateSkillChips = function (empSkill) { // Function returns required skill chips in HTML syntax
    const empSkillNames = getSkillNamesFromId(empSkill).split(', ');
    const displaySkillSection = document.createElement('div');

    for (let skillName of empSkillNames) {
        let chipContainer = document.createElement('div');
        chipContainer.setAttribute('class', 'chip');
        chipContainer.setAttribute('contenteditable', 'false');
        chipContainer.innerHTML = `
        <span class="skill-heading">${skillName}</span>
        <span class="skill-closebtn" onclick="this.parentElement.remove()">&times;</span>
        `;
        displaySkillSection.appendChild(chipContainer);
    }

    return displaySkillSection.innerHTML;
};

const getSkillNamesFromId = function (empSkill) { // Function returns skillNames for given empObj
    const skillData = JSON.parse(localStorage.getItem('skillData'));
    return empSkill.map((skillIdentifier) => { // Return array with employee skill
        for (let skillObj of skillData) {
            if (skillObj.skillId == skillIdentifier) {
                return skillObj.skillName;
            }
        }
    }).join(', ');
};

/*-------END: Employee Data Listing Implementation-------*/

/*-------START: Update Form Function Implementation-------*/

const fillUpdateClearForm = function (isClear, empId) { // Function fills or clear data in modal
    const empForm = document.getElementById('addUpdate-emp');
    const empName = empForm.querySelector('#emp-name');
    const empMail = empForm.querySelector('#emp-email');
    const empDesignation = empForm.querySelector('#emp-designation');
    const empDob = empForm.querySelector('#emp-dob');
    const empSkill = empForm.querySelector('#skill-display-section');

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
    empSkill.innerHTML = (isClear) ? '' : `${generateSkillChips(reqEmpObj.empSkill)}`;
};

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
};

const fillSkillDropdown = function () { // Fill skill dropdown with data
    const skillData = JSON.parse(localStorage.getItem('skillData'));
    const skillDropdowns = document.getElementsByClassName('skill-dropdown-content');

    for (let dropdown of skillDropdowns) {
        let groupSkill = document.createElement('ul');
        for (let skillObj of skillData) {
            let individualSkill = document.createElement('li');
            individualSkill.setAttribute('data-skillid', `id-${skillObj.skillId}`);
            individualSkill.innerHTML = `${skillObj.skillName}`;
            groupSkill.appendChild(individualSkill);
        }
        dropdown.appendChild(groupSkill);
    }
};

const addUpdateModal = function (isAdd, empId) { // Handle modal on update or add operation
    const modalBackground = document.getElementById('modal-background');
    const modalContent = modalBackground.querySelector('#addUpdate-emp');
    const modalHeading = modalContent.querySelector('#modal-heading');
    const formSubmit = modalContent.querySelector('#form-submit');
    const formCancel = modalContent.querySelector('#form-cancel');

    modalHeading.innerText = (isAdd) ? 'Add Employee Details' : 'Update Employee Details';
    formSubmit.value = (isAdd) ? 'SAVE' : 'UPDATE';

    modalBackground.classList.remove('display-none');
    modalContent.classList.remove('display-none');

    formCancel.onclick = () => {
        modalContent.classList.add('display-none');
        modalBackground.classList.add('display-none');
        fillUpdateClearForm(true);
    };

    const displayErrorMessage = (isClear, validationErrorStatus) => {
        const displayErrorSections = document.querySelectorAll('.validation-error');
        displayErrorSections.forEach((val, index) => {
            if (!isClear && validationErrorStatus[index] == 1) {
                val.innerHTML = `<span>${val.dataset.errorName} is  not valid</span>`;
            }
            else {
                val.innerHTML = ``;
            }
        });
    };

    if (!isAdd) {
        fillUpdateClearForm(false, empId);
        formSubmit.onclick = () => {
            const validationErrorStatus = validateInput();
            if (validationErrorStatus.some(checkValue => checkValue !== 0)) {
                displayErrorMessage(false, validationErrorStatus);
            }
            else {
                generateUpdateEmpObj(false, empId);
                modalContent.classList.add('display-none');
                modalBackground.classList.add('display-none');
                fillUpdateClearForm(true);
            }
        }
    }
    else {
        formSubmit.onclick = () => {
            const validationErrorStatus = validateInput();
            if (validationErrorStatus.some(checkValue => checkValue !== 0)) {
                displayErrorMessage(false, validationErrorStatus);
            }
            else {
                generateUpdateEmpObj(true);
                modalContent.classList.add('display-none');
                modalBackground.classList.add('display-none');
                fillUpdateClearForm(true);
            }
        }
    }
    displayErrorMessage(true);
};

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
    };

    confirmDelete.onclick = () => {
        removeEmpDetail(false, empDeleteIcon);
        modalContent.classList.replace('flex-box', 'display-none');
        modalBackground.classList.add('display-none');
    };
};

/*-------END: Dropdown, Modal Display and Hide Implementation-------*/

/*-------START: Add, Update, Delete Employee Implementation-------*/

const generateUpdateEmpObj = function (createNew, empId) { // Function updates/create employee data into object
    const empData = JSON.parse(localStorage.getItem('empData'));
    const empName = document.querySelector('#emp-name').value;
    const empEmail = document.querySelector('#emp-email').value;
    const empDesignation = document.querySelector('#emp-designation').value;
    const empDob = document.querySelector('#emp-dob').value;
    const empSkillNames = document.querySelectorAll('.skill-heading');
    const skillData = JSON.parse(localStorage.getItem('skillData'));

    const empSkill = [];
    empSkillNames.forEach(val => {
        for (let skillObj of skillData) {
            if (skillObj.skillName == val.innerText) {
                empSkill.push(skillObj.skillId);
            }
        }
    });

    if (createNew) {
        const sortOptions = document.getElementById('sort-dropdown-head').dataset.sortOption.split(', ');
        let empId = 1001;
        if (empData.length > 0) {
            maxEmpIdObj = empData.reduce((maxIdObj, obj) => (maxIdObj.empId > obj.empId) ? maxIdObj : obj);
            empId = maxEmpIdObj.empId + 1;
        }

        const newEmpObj = {
            empId,
            empName,
            empEmail,
            empDesignation,
            empDob,
            empSkill
        };

        empData.push(newEmpObj);

        localStorage.setItem('empData', JSON.stringify(empData));

        const boolSortOptions = sortOptions.map(val => +val);

        sortEmployeeData(...boolSortOptions);
    }
    else {
        const reqEmpObj = empData.find(empObj => {
            if (empObj.empId == empId) {
                return empObj;
            }
        });

        reqEmpObj.empName = empName;
        reqEmpObj.empEmail = empEmail;
        reqEmpObj.empDesignation = empDesignation;
        reqEmpObj.empDob = empDob;
        reqEmpObj.empSkill = empSkill;

        localStorage.setItem('empData', JSON.stringify(empData));

        removeEmpDetail(true);
        listEmpDetail();
    }
};

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
};

const validateInput = function () { // Basic Name, Email, DoB, Designation, skill validation of data
    const empName = document.querySelector('#emp-name').value;
    const empEmail = document.querySelector('#emp-email').value;
    const empDesignation = document.querySelector('#emp-designation').value;
    const empDob = document.querySelector('#emp-dob').value;

    const validationErrors = [];
    const emailRegex = new RegExp(/^[^\s@]+@[^\s@.]+\.[^\s@]+$/);
    const dobRegex = new RegExp(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
    const stringSpaceRegex = new RegExp(/^[a-zA-Z ]{2,30}$/);
    const stringSymobolRegex = new RegExp(/^[a-zA-Z ,+]{1,100}$/);

    const validateRegex = (regexPatternObj, text) => {
        if (regexPatternObj.test(text)) {
            validationErrors.push(0);
        }
        else {
            validationErrors.push(1);
        }
    };

    validateRegex(stringSpaceRegex, empName);
    validateRegex(emailRegex, empEmail);
    validateRegex(stringSpaceRegex, empDesignation);
    validateRegex(dobRegex, empDob);

    return validationErrors;

};

/*-------END: Add, Update, Delete Employee Implementation-------*/

/*-------START: Sort Employee Data Listing Implementation-------*/

const sortEmployeeData = function (withEmpId, inAscending) { // Sort employee data, localstorage and display
    let empData = JSON.parse(localStorage.getItem('empData'));
    const sortDropdownHeading = document.getElementById('sort-dropdown-head');

    const idComparatorFunction = (firstObj, secondObj) => {
        return firstObj.empId - secondObj.empId;
    };
    const nameComparatorFunction = (firstObj, secondObj) => {
        const nameA = firstObj.empName.toUpperCase();
        const nameB = secondObj.empName.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    };

    if (withEmpId) {
        if (inAscending) {
            sortDropdownHeading.innerText = 'Employee ID (Low > High)';
            sortDropdownHeading.dataset.sortOption = '1, 1';
            empData.sort((firstItem, secondItem) => {
                return idComparatorFunction(firstItem, secondItem);
            });
        }
        else {
            sortDropdownHeading.innerText = 'Employee ID (High > Low)';
            sortDropdownHeading.dataset.sortOption = '1, 0';
            empData.sort((firstItem, secondItem) => {
                return idComparatorFunction(secondItem, firstItem);
            });
        }
    }
    else {
        if (inAscending) {
            sortDropdownHeading.innerText = 'Employee Name (A > Z)';
            sortDropdownHeading.dataset.sortOption = '0, 1';
            empData.sort((firstItem, secondItem) => {
                return nameComparatorFunction(firstItem, secondItem);
            });
        }
        else {
            sortDropdownHeading.innerText = 'Employee Name (Z > A)';
            sortDropdownHeading.dataset.sortOption = '0, 0';
            empData.sort((firstItem, secondItem) => {
                return nameComparatorFunction(secondItem, firstItem);
            });
        }
    }

    localStorage.setItem('empData', JSON.stringify(empData));
    removeEmpDetail(true);
    listEmpDetail();
};

/*-------END: Sort Employee Data Listing Implementation-------*/

/*-------START: Filter Employee Data Listing Implementation-------*/

const filterEmployeeData = function (dropdownBox) { // Function filter skill, localstorage and display it
    const filterDropdownSelect = document.getElementById('filter-skill-dropdown');
    const changeDropdownHeading = dropdownBox.querySelector('span');
    const empData = JSON.parse(localStorage.getItem('empData'));

    filterDropdownSelect.onclick = (event) => {
        if (event.target.dataset.skillid.startsWith('id')) {
            const selectedSkillId = +event.target.dataset.skillid.slice(3);
            changeDropdownHeading.innerText = event.target.innerText;

            const filteredSkillCollection = empData.filter(empObj => {
                if (empObj.empSkill.includes(selectedSkillId)) {
                    return empObj
                }
            });

            localStorage.setItem('empFilterData', JSON.stringify(filteredSkillCollection));
            removeEmpDetail(true);
            listEmpDetail(true);
        }
    };
};

/*-------END: Filter Employee Data Listing Implementation-------*/