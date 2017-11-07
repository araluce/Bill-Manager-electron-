const remote = require('electron').remote;
const main = remote.require('./main.js');
const ipc = require('electron').ipcRenderer;
const models = require('./models/index.js')
var Sequelize = require('sequelize');
const bill_controller = require('./controllers/bill.js');

// Bill elements
var createBillButton = document.getElementById('createBillButton');
var billClientDniInput = document.getElementById('bill_client_dni');
var billClientFirstNameInput = document.getElementById('bill_client_firstName');
var billClientLastNameInput = document.getElementById('bill_client_lastName');
var billClientPhoneInput = document.getElementById('bill_client_phone');
var billClientSelect = document.getElementById('bill_client_select');
var billReceiptDateInput = document.getElementById('bill_receipt_date_input');
var billReceiptLotNumber = document.getElementById('bill_receipt_lot_number');
var billReceiptWeight = document.getElementById('bill_receipt_weight');
var billReceiptPrice = document.getElementById('bill_receipt_price');
var billReceiptTReception = document.getElementById('bill_receipt_t_reception');
var billReceiptOrigin = document.getElementById('bill_origin');
var billReceiptNRSI = document.getElementById('bill_n_rsi');
var billReceiptNumHams = document.getElementById('bill_receipt_num_hams');
var billReceiptNumPalettes = document.getElementById('bill_receipt_num_palettes');

createBillButton.addEventListener('click', function (event) {
    bill_controller.createBillButtonClick(models);
});

billClientDniInput.addEventListener('keyup', function (event) {
    bill_controller.clientDniInputKeyUp(models, Sequelize);
});

billClientFirstNameInput.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateFullName();
});

billClientLastNameInput.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateFullName();
});

billClientPhoneInput.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdatePhone();
});

billReceiptDateInput.addEventListener('focusout', function (event) {
    bill_controller.pdfUpdateDateInput();
});

billReceiptLotNumber.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateLotNumber();
});

billReceiptWeight.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateWeight();
});

billReceiptPrice.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdatePrice();
});

billReceiptTReception.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateTReception();
});

billReceiptOrigin.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateOrigin();
});

billReceiptNRSI.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateNRSI();
});

billReceiptNumHams.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateNumHams();
});

billReceiptNumPalettes.addEventListener('keyup', function (event) {
    bill_controller.pdfUpdateNumPalettes();
});

billClientSelect.addEventListener('change', function (event) {
    bill_controller.billClientSelectChange(models);
});


