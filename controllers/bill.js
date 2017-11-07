module.exports = {
    dataFields: {
        firstName: document.getElementById('bill_client_firstName').value,
        lastName: document.getElementById('bill_client_lastName').value,
        phone: document.getElementById('bill_client_phone').value,
        dni: document.getElementById('bill_client_dni').value,
        selectIdClient: document.getElementById('bill_client_select').value
    },
    errorMessage: function (message) {
        error_wrapper = document.getElementById('billErrorMessage');
        content = '<div class="alert alert-danger fade in">';
        content += '    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
        content += '    <strong>Se han producido errores de validación, por favor, revise los siguientes errores:</strong>';
        message.errors.forEach(function (error) {
            content += '<br><strong>' + error.path + ': </strong>' + error.message;
        });
        content += '</div>';
        error_wrapper.innerHTML = content;
        this.errorFields(message);
    },
    errorFields: function (prefix, message) {
        message.errors.forEach(function (error) {
            fieldTarget = document.getElementById(prefix + '' + error.path);
            parent = fieldTarget.parentElement;
            parent.className += " has-error";
        });
    },
    clientDniInputKeyUp: function (models, Sequelize) {
        dni = document.getElementById('bill_client_dni').value;
        if (dni.length > 2) {
            models.Client.findAll({
                where: {
                    dni: {
                        [Sequelize.Op.like]: '%' + dni + '%'
                    }
                }
            }).then(clients => {
                selectOptions = '<option value="0">Selecciona un cliente</option>';
                clients.forEach(function (client) {
                    selectOptions += '<option value="' + client.id + '">' + client.dni + '</option>';
                });
                document.getElementById('bill_client_select').innerHTML = selectOptions;
            });
            this.pdfUpdateDNI();
        }
    },
    createBillButtonClick: function (models) {
        that = this;

        errorFields = document.getElementsByClassName("has-error");
        while (errorFields.length)
            errorFields[0].className = errorFields[0].className.replace(/\has-error\b/g, "");

        client = models.Client.findOrCreate({
            where: {
                firstName: document.getElementById('bill_client_firstName').value.toUpperCase(),
                lastName: document.getElementById('bill_client_lastName').value.toUpperCase(),
                dni: document.getElementById('bill_client_dni').value.toUpperCase(),
                phone: document.getElementById('bill_client_phone').value
            }
        }).then(function (response) {
            console.log('====== Client Success ======');
            console.log(response);
            bill = models.Bill.create({
                client_id: response[0].dataValues.id,
                origin: document.getElementById('bill_origin').value.toUpperCase(),
                n_rsi: document.getElementById('bill_n_rsi').value
            }).then(function (bill_response) {
                console.log('====== Bill Success ======');
                console.log(bill_response);
                receipt = models.Receipt.create({
                    bill_id: bill_response.dataValues.id,
                    date_input: new Date(document.getElementById('bill_receipt_date_input').value),
                    lot_number: document.getElementById('bill_receipt_lot_number').value,
                    weight: document.getElementById('bill_receipt_weight').value,
                    price: document.getElementById('bill_receipt_price').value,
                    t_reception: document.getElementById('bill_receipt_t_reception').value.toUpperCase(),
                    num_hams: document.getElementById('bill_receipt_num_hams').value,
                    num_palettes: document.getElementById('bill_receipt_num_palettes').value
                }).then(function (receipt_response) {
                    console.log('====== Receipt Success ======');
                    console.log(receipt_response);
                }).catch(function (err) {
                    //that.errorMessage('bill_receipt_',err);
                    console.log('====== Receipt Error ======');
                    //console.log(err);
                });
            }).catch(function (err) {
                //that.errorMessage('bill_',err);
                console.log('====== Bill Error ======');
                //console.log(err);
            });
        }).catch(function (err) {
            console.log(err.errors);
            that.errorMessage('bill_client_',err);
        });


    },
    billClientSelectChange: function (models) {
        id = document.getElementById('bill_client_select').value;
        that = this;
        if (id != 0) {
            models.Client.findById(id)
                .then(client => {
                    document.getElementById('bill_client_firstName').value = client.firstName;
                    document.getElementById('bill_client_lastName').value = client.lastName;
                    document.getElementById('bill_client_phone').value = client.phone;
                    document.getElementById('bill_client_dni').value = client.dni;
                    that.pdfUpdateAll();
                });
        }
    },
    pdfUpdateAll: function () {
        this.pdfUpdateFullName();
        this.pdfUpdateDNI();
        this.pdfUpdatePhone();
    },
    pdfUpdateFullName: function () {
        document.getElementById('pdfBillFullName').innerHTML = document.getElementById('bill_client_firstName').value.toUpperCase() + ' ' + document.getElementById('bill_client_lastName').value.toUpperCase();
    },
    pdfUpdateDNI: function () {
        document.getElementById('pdfBillDNI').innerHTML = document.getElementById('bill_client_dni').value.toUpperCase();
    },
    pdfUpdatePhone: function () {
        document.getElementById('pdfBillPhone').innerHTML = document.getElementById('bill_client_phone').value;
    },
    pdfUpdateDateInput: function () {
        document.getElementById('pdfBillDateInput').innerHTML = document.getElementById('bill_receipt_date_input').value;
    },
    pdfUpdateLotNumber: function () {
        document.getElementById('pdfBillLotNumber').innerHTML = document.getElementById('bill_receipt_lot_number').value;
    },
    pdfUpdateWeight: function () {
        document.getElementById('pdfBillWheight').innerHTML = document.getElementById('bill_receipt_weight').value;
    },
    pdfUpdatePrice: function () {
        document.getElementById('pdfBillPrice').innerHTML = document.getElementById('bill_receipt_price').value;
    },
    pdfUpdateTReception: function () {
        document.getElementById('pdfBillTReception').innerHTML = document.getElementById('bill_receipt_t_reception').value;
    },
    pdfUpdateOrigin: function () {
        document.getElementById('pdfBillOrigin').innerHTML = document.getElementById('bill_origin').value;
    },
    pdfUpdateNRSI: function () {
        document.getElementById('pdfBillNRSI').innerHTML = document.getElementById('bill_n_rsi').value;
    },
    pdfUpdateNumHams: function () {
        document.getElementById('pdfBillNumHams').innerHTML = document.getElementById('bill_receipt_num_hams').value;
    },
    pdfUpdateNumPalettes: function () {
        document.getElementById('pdfBillNumPalettes').innerHTML = document.getElementById('bill_receipt_num_palettes').value;
    }
}