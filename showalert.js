function showAlert(message) {
    const modalBody = document.querySelector('#alertModal .modal-body');
    modalBody.textContent = message;
    $('#alertModal').modal('show');
}
