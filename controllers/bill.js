module.exports = {
    dataFields: {
        firstName: document.getElementById('bill_client_firstName').value,
        lastName: document.getElementById('bill_client_lastName').value,
        phone: document.getElementById('bill_client_phone').value,
        dni: document.getElementById('bill_client_dni').value,
        selectIdClient: document.getElementById('bill_client_select').value
    },
    notice: message => {
        content = '<div class="alert alert-info fade in">';
        content += '    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
        content += '    <strong>' + message + '</strong>';
        content += '</div>';
        $('#billErrorMessage').html(content);
    },
    errorMessages: function (message) {
        content = '<div class="alert alert-danger fade in">';
        content += '    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
        content += '    <strong>Se han producido errores de validación, por favor, revise los siguientes errores:</strong>';
        message.errors.forEach(function (error) {
            content += '<br><strong>' + error.path + ': </strong>' + error.message;
        });
        content += '</div>';
        $('#billErrorMessage').html(content);
        this.errorFields(message);
    },
    errorMessage: function (message) {
        content = '<div class="alert alert-danger fade in">';
        content += '    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
        content += '    <strong>Se han producido errores de validación, por favor, revise los siguientes errores:</strong>';
        content += '<br><strong>' + message + '</strong>';
        content += '</div>';
        $('#billErrorMessage').html(content);
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
        }
    },
    billClientSelectChange: function (models) {
        id = $('#bill_client_select').val();
        that = this;
        if (id != 0) {
            models.Client.findById(id)
                .then(client => {
                    $('#bill_client_firstName').val(client.firstName);
                    $('#bill_client_lastName').val(client.lastName);
                    $('#bill_client_phone').val(client.phone);
                    $('#bill_client_dni').val(client.dni);
                });
        }
    },
    pdfUpdateAll: function (firstname, lastname, dni, phone, date_input, lot_number, weight, price, origin, treception, nrsi, num_hams, num_palettes) {
        $('.pdfBillFullName').html(firstname + ' ' + lastname);
        $('#pdfBillDNI').html(dni);
        $('#pdfBillPhone').html(phone);
        $('.pdfBillDateInput').html(date_input);
        $('#pdfBillLotNumber').html(lot_number);
        $('.pdfBillWheight').html(weight);
        $('.pdfBillPrice').html(price);
        $('#pdfBillTReception').html(treception);
        $('.pdfBillOrigin').html(origin);
        $('#pdfBillNRSI').html(nrsi);
        $('.pdfBillNumHams').html(num_hams);
        $('.pdfBillNumPalettes').html(num_palettes);
    }
}