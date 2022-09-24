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

const addUpdateModal = function (isAdd) {
    const modalBackground = document.getElementById('modal-background');
    const modalContent = modalBackground.querySelector('#addUpdate-emp'); // try using getElementById
    const modalHeading = modalContent.querySelector('#modal-heading');
    const formSubmit = modalContent.querySelector('#form-submit');
    const formCancel = modalContent.querySelector('#form-cancel');

    modalHeading.innerText = (isAdd)? 'Add Employee Details': 'Update Employee Details';
    formSubmit.value = (isAdd)? 'SAVE': 'UPDATE';

    modalBackground.classList.remove('display-none');
    modalContent.classList.remove('display-none');

    formCancel.onclick = () => {
        modalContent.classList.add('display-none');
        modalBackground.classList.add('display-none');
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

/*-------END: Modal Display and Hide Implementation-------*/